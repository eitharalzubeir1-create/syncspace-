
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, ArrowRight, Play, Clock } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';

interface Group {
  id: string;
  name: string;
  icon: string;
  color: string;
  members: number;
  lastMeeting?: string;
  confirmedTime?: string;
  status?: 'draft' | 'pending' | 'completed';
  createdAt?: string;
}

interface GroupsOverviewScreenProps {
  groups: Group[];
  onCreateGroup: () => void;
  onSelectGroup: (group: Group) => void;
  hasInProgressGroup?: boolean;
  onContinueProgress?: () => void;
}

const GroupsOverviewScreen: React.FC<GroupsOverviewScreenProps> = ({
  groups,
  onCreateGroup,
  onSelectGroup,
  hasInProgressGroup,
  onContinueProgress,
}) => {
  const steps = ['Groups', 'Create', 'Schedule'];

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <span className="text-green-600">✅</span>;
      default: return null;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'pending': return 'Pending';
      case 'completed': return 'Active';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressIndicator currentStep={0} steps={steps} />
      
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Your Groups</h1>
          <Bell className="w-6 h-6 text-gray-600" />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 pb-32">
        {/* Continue Progress Banner */}
        {hasInProgressGroup && (
          <Card className="p-4 bg-blue-50 border-blue-200 rounded-xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-medium text-blue-900">Continue where you left off</h3>
                  <p className="text-sm text-blue-700">You have a group creation in progress</p>
                </div>
              </div>
              <Button
                onClick={onContinueProgress}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Continue
              </Button>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">All Groups ({groups.length})</h2>
          <Button
            onClick={onCreateGroup}
            className="bg-[#0057B7] hover:bg-[#0057B7]/90 text-white rounded-full w-10 h-10 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {groups.map((group) => (
            <Card 
              key={group.id} 
              className="p-4 bg-white shadow-sm border-0 rounded-xl hover:scale-105 transition-transform cursor-pointer"
              onClick={() => onSelectGroup(group)}
            >
              <div className="flex items-center space-x-4">
                <div className={`${group.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>
                  {group.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{group.name}</h3>
                    {group.status && (
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(group.status)}
                        <span className="text-xs text-gray-600">{getStatusText(group.status)}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{group.members} members</p>
                  {group.confirmedTime && (
                    <p className="text-sm text-green-600 font-medium mt-1">
                      ✅ {group.confirmedTime}
                    </p>
                  )}
                  {group.lastMeeting && !group.confirmedTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last meeting: {group.lastMeeting}
                    </p>
                  )}
                </div>
                <div className="text-gray-400">
                  →
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Create New Group Button */}
        <Card 
          className="p-6 bg-white shadow-sm border-2 border-dashed border-gray-300 rounded-xl hover:border-[#0057B7] transition-colors cursor-pointer mt-6"
          onClick={onCreateGroup}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900">Create New Group</h3>
            <p className="text-sm text-gray-600 mt-1">Start coordinating with friends</p>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom Right Create Button */}
      <div className="fixed bottom-20 right-6 z-50">
        <Button 
          onClick={onCreateGroup}
          className="bg-[#0057B7] hover:bg-[#0057B7]/90 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-105"
          size="icon"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default GroupsOverviewScreen;
