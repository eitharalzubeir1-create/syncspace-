
import React, { useState, useEffect } from 'react';
import GroupsOverviewScreen from './groups/GroupsOverviewScreen';
import CreateGroupScreen from './groups/CreateGroupScreen';
import GroupTimeCoordinationScreen from './groups/GroupTimeCoordinationScreen';
import { saveGroupsState, loadGroupsState, clearGroupsState } from '@/utils/groupsStorage';

interface Group {
  id: string;
  name: string;
  icon: string;
  color: string;
  members: number;
  confirmedTime?: string;
  status?: 'draft' | 'pending' | 'completed';
  createdAt?: string;
}

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  availability: string;
  status: 'all' | 'partial' | 'few';
}

interface PendingGroup {
  name: string;
  selectedFriends: string[];
}

const GroupsScreen = () => {
  const [currentScreen, setCurrentScreen] = useState<'overview' | 'create' | 'schedule'>('overview');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [pendingGroup, setPendingGroup] = useState<PendingGroup | null>(null);
  const [formData, setFormData] = useState<{ groupName: string; selectedFriends: string[] } | null>(null);
  const [groups, setGroups] = useState<Group[]>([
    { 
      id: '1', 
      name: 'Study Group', 
      icon: '👥', 
      color: 'bg-blue-100', 
      members: 5,
      confirmedTime: 'Friday, 3:00 PM - 5:00 PM',
      status: 'completed',
      createdAt: '2024-01-15'
    },
    { 
      id: '2', 
      name: 'Basketball Team', 
      icon: '🏀', 
      color: 'bg-purple-100', 
      members: 8,
      status: 'pending',
      createdAt: '2024-01-20'
    },
    { 
      id: '3', 
      name: 'Work Project', 
      icon: '💼', 
      color: 'bg-green-100', 
      members: 4,
      status: 'completed',
      createdAt: '2024-01-18'
    },
  ]);

  // Load saved state on component mount
  useEffect(() => {
    const savedState = loadGroupsState();
    if (savedState.currentScreen !== 'overview' || savedState.pendingGroup || savedState.selectedGroup) {
      setCurrentScreen(savedState.currentScreen);
      setSelectedGroup(savedState.selectedGroup);
      setPendingGroup(savedState.pendingGroup);
      setFormData(savedState.formData || null);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (currentScreen !== 'overview' || pendingGroup || selectedGroup) {
      saveGroupsState({
        currentScreen,
        selectedGroup,
        pendingGroup,
        formData,
      });
    }
  }, [currentScreen, selectedGroup, pendingGroup, formData]);

  const handleCreateGroup = () => {
    setCurrentScreen('create');
  };

  const handleNext = (groupName: string, selectedFriends: string[]) => {
    const pendingGroupData = { name: groupName, selectedFriends };
    setPendingGroup(pendingGroupData);
    setFormData({ groupName, selectedFriends });
    
    const tempGroup: Group = {
      id: 'temp',
      name: groupName,
      icon: '👥',
      color: 'bg-indigo-100',
      members: selectedFriends.length + 1,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSelectedGroup(tempGroup);
    setCurrentScreen('schedule');
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setCurrentScreen('schedule');
  };

  const handleTimeConfirmed = (groupId: string, timeSlot: TimeSlot) => {
    if (pendingGroup) {
      // Create new group with confirmed time
      const newGroup: Group = {
        id: Date.now().toString(),
        name: pendingGroup.name,
        icon: '👥',
        color: 'bg-indigo-100',
        members: pendingGroup.selectedFriends.length + 1,
        confirmedTime: `${timeSlot.day}, ${timeSlot.time}`,
        status: 'completed',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setGroups(prev => [...prev, newGroup]);
      setPendingGroup(null);
      setFormData(null);
      clearGroupsState();
    } else {
      // Update existing group
      setGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { ...group, confirmedTime: `${timeSlot.day}, ${timeSlot.time}`, status: 'completed' as const }
            : group
        )
      );
    }
    setCurrentScreen('overview');
    setSelectedGroup(null);
  };

  const handleBackToOverview = () => {
    setCurrentScreen('overview');
    setSelectedGroup(null);
    // Don't clear pendingGroup here to preserve progress
  };

  const handleCancelProgress = () => {
    setPendingGroup(null);
    setFormData(null);
    setSelectedGroup(null);
    setCurrentScreen('overview');
    clearGroupsState();
  };

  const hasInProgressGroup = pendingGroup !== null;

  switch (currentScreen) {
    case 'create':
      return (
        <CreateGroupScreen
          onBack={handleBackToOverview}
          onNext={handleNext}
          onCancel={handleCancelProgress}
          initialData={formData}
        />
      );
    
    case 'schedule':
      return selectedGroup ? (
        <GroupTimeCoordinationScreen
          group={selectedGroup}
          onBack={handleBackToOverview}
          onTimeConfirmed={handleTimeConfirmed}
          onCancel={handleCancelProgress}
        />
      ) : null;
    
    default:
      return (
        <GroupsOverviewScreen
          groups={groups}
          onCreateGroup={handleCreateGroup}
          onSelectGroup={handleSelectGroup}
          hasInProgressGroup={hasInProgressGroup}
          onContinueProgress={() => setCurrentScreen('create')}
        />
      );
  }
};

export default GroupsScreen;
