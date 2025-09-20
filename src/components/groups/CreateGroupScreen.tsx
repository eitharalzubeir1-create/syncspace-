
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, ArrowLeft, Search, ArrowRight, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProgressIndicator from './ProgressIndicator';

interface Friend {
  id: string;
  name: string;
  status: string;
  avatar: string;
}

interface CreateGroupScreenProps {
  onBack: () => void;
  onNext: (groupName: string, selectedFriends: string[]) => void;
  onCancel?: () => void;
  initialData?: {
    groupName: string;
    selectedFriends: string[];
  } | null;
}

const CreateGroupScreen: React.FC<CreateGroupScreenProps> = ({
  onBack,
  onNext,
  onCancel,
  initialData,
}) => {
  const [groupName, setGroupName] = useState(initialData?.groupName || '');
  const [selectedFriends, setSelectedFriends] = useState<string[]>(initialData?.selectedFriends || []);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const friends: Friend[] = [
    { id: '1', name: 'Emma Johnson', status: 'Available Now', avatar: '👩🏻‍💼' },
    { id: '2', name: 'Michael Chen', status: 'Busy Until 5 PM', avatar: '👨🏻‍💻' },
    { id: '3', name: 'Sophia Rodriguez', status: 'Available After 3 PM', avatar: '👩🏻‍🎓' },
    { id: '4', name: 'James Wilson', status: 'Available Now', avatar: '👨🏻‍🎨' },
    { id: '5', name: 'Olivia Thompson', status: 'In Meeting', avatar: '👩🏻‍🔬' },
  ];

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends(prev =>
      prev.includes(friendId)
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleNext = () => {
    console.log('Next button clicked');
    console.log('Group name:', groupName);
    console.log('Selected friends:', selectedFriends);

    if (!groupName.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group.",
        variant: "destructive",
      });
      return;
    }

    if (selectedFriends.length === 0) {
      toast({
        title: "No friends selected",
        description: "Please select at least one friend to create a group.",
        variant: "destructive",
      });
      return;
    }

    console.log('Calling onNext with:', groupName, selectedFriends);
    onNext(groupName, selectedFriends);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onBack();
    }
  };

  const steps = ['Groups', 'Create', 'Schedule'];
  const isResuming = !!initialData;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <ProgressIndicator currentStep={1} steps={steps} />
      
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="w-10 h-10 rounded-full hover:bg-gray-100 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-semibold">Create Group</h1>
            {isResuming && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                Resuming
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={handleCancel}
                className="w-8 h-8 rounded-full hover:bg-gray-100 p-0"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Bell className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 pb-40">
        {/* Resume notification */}
        {isResuming && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              ✨ Continuing from where you left off
            </p>
          </div>
        )}

        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Name
          </label>
          <Input
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Friends Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Select Friends</h2>
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-40">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFriends.map((friend) => (
              <Card key={friend.id} className="p-4 bg-white shadow-sm border-0 rounded-xl">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-[#0057B7] rounded border-gray-300"
                    checked={selectedFriends.includes(friend.id)}
                    onChange={() => handleFriendToggle(friend.id)}
                  />
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    {friend.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{friend.name}</h3>
                    <p className="text-sm text-gray-600">{friend.status}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected count */}
        {selectedFriends.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              {selectedFriends.length} friend{selectedFriends.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}
      </div>

      {/* Fixed Bottom Navigation */}
      <div className="fixed bottom-20 left-6 right-6 z-50 flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-white hover:bg-gray-50 text-gray-700 rounded-full w-14 h-14 shadow-lg"
          size="icon"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Button 
          onClick={handleNext}
          className="bg-[#0057B7] hover:bg-[#0057B7]/90 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-105"
          size="icon"
        >
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default CreateGroupScreen;
