import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ArrowLeft, Users, ArrowRight, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ProgressIndicator from './ProgressIndicator';

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  availability: string;
  status: 'all' | 'partial' | 'few';
}

interface Group {
  id: string;
  name: string;
  icon: string;
  color: string;
  members: number;
}

interface GroupTimeCoordinationScreenProps {
  group: Group;
  onBack: () => void;
  onTimeConfirmed: (groupId: string, timeSlot: TimeSlot) => void;
  onCancel?: () => void;
}

const GroupTimeCoordinationScreen: React.FC<GroupTimeCoordinationScreenProps> = ({
  group,
  onBack,
  onTimeConfirmed,
  onCancel,
}) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const { toast } = useToast();

  const timeSlots: TimeSlot[] = [
    {
      id: '1',
      day: 'Friday',
      time: '3:00 PM - 5:00 PM',
      availability: 'All members available',
      status: 'all'
    },
    {
      id: '2',
      day: 'Monday',
      time: '10:00 AM - 11:30 AM',
      availability: 'All members available',
      status: 'all'
    },
    {
      id: '3',
      day: 'Wednesday',
      time: '2:00 PM - 3:30 PM',
      availability: '5 of 7 members available',
      status: 'partial'
    },
    {
      id: '4',
      day: 'Thursday',
      time: '4:00 PM - 6:00 PM',
      availability: '3 of 7 members available',
      status: 'few'
    }
  ];

  const handleSlotToggle = (slotId: string) => {
    setSelectedSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleConfirmTime = () => {
    if (selectedSlots.length === 0) {
      toast({
        title: "No time selected",
        description: "Please select at least one time slot to vote for.",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, confirm the first selected slot
    const confirmedSlot = timeSlots.find(slot => selectedSlots.includes(slot.id));
    if (confirmedSlot) {
      onTimeConfirmed(group.id, confirmedSlot);
      toast({
        title: "Vote Submitted!",
        description: `Your vote for ${confirmedSlot.day}, ${confirmedSlot.time} has been recorded.`,
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onBack();
    }
  };

  const getSlotBorderColor = (status: string) => {
    switch (status) {
      case 'all': return 'border-green-200';
      case 'partial': return 'border-purple-200';
      case 'few': return 'border-orange-200';
      default: return 'border-gray-200';
    }
  };

  const getSlotStatusColor = (status: string) => {
    switch (status) {
      case 'all': return 'text-green-600';
      case 'partial': return 'text-purple-600';
      case 'few': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const steps = ['Groups', 'Create', 'Schedule'];

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressIndicator currentStep={2} steps={steps} />
      
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
          <h1 className="text-xl font-semibold">Schedule Meeting</h1>
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
      <div className="px-6 py-6 pb-40">
        {/* Group Info */}
        <Card className="p-4 bg-white shadow-sm border-0 rounded-xl mb-6">
          <div className="flex items-center space-x-3">
            <div className={`${group.color} w-12 h-12 rounded-xl flex items-center justify-center text-xl`}>
              {group.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {group.members} members
              </p>
            </div>
          </div>
        </Card>

        {/* AI Analysis */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-gray-600">Common Availability</span>
            <span className="text-purple-600 font-medium">✨ AI-powered</span>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-purple-200 rounded-full animate-spin flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600">Analysis complete!</p>
            <p className="text-center text-xs text-gray-500 mt-1">Found {timeSlots.length} possible time slots</p>
          </div>
        </div>

        {/* Time Slots */}
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-semibold">Vote for Preferred Times</h2>
          {timeSlots.map((slot) => (
            <Card 
              key={slot.id} 
              className={`p-4 bg-white border rounded-xl cursor-pointer transition-all ${
                selectedSlots.includes(slot.id) 
                  ? 'border-[#0057B7] bg-blue-50' 
                  : getSlotBorderColor(slot.status)
              }`}
              onClick={() => handleSlotToggle(slot.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-purple-600">{slot.day}</p>
                  <p className="text-sm text-gray-600">{slot.time}</p>
                  <p className={`text-xs ${getSlotStatusColor(slot.status)}`}>
                    {slot.status === 'all' ? '✅' : slot.status === 'partial' ? '⚠️' : '⚡'} {slot.availability}
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-[#0057B7] rounded border-gray-300"
                  checked={selectedSlots.includes(slot.id)}
                  onChange={() => handleSlotToggle(slot.id)}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Selected count */}
        {selectedSlots.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-700">
              {selectedSlots.length} time slot{selectedSlots.length !== 1 ? 's' : ''} selected for voting
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
          onClick={handleConfirmTime}
          className="bg-[#0057B7] hover:bg-[#0057B7]/90 text-white rounded-full w-14 h-14 shadow-lg transition-all duration-200 hover:scale-105"
          size="icon"
        >
          <Check className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default GroupTimeCoordinationScreen;
