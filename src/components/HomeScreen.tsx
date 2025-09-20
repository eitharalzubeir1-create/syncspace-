import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Users, Search, Calendar, Heart, MessageCircle, Phone } from 'lucide-react';
interface HomeScreenProps {
  onNavigate?: (screen: string) => void;
}
const HomeScreen = ({
  onNavigate
}: HomeScreenProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const availableFriends = [{
    name: 'Sarah Johnson',
    status: 'Available till 3:00 PM',
    avatar: '👩🏻‍💼',
    available: true
  }, {
    name: 'Michael Chen',
    status: 'Busy till 2:00 PM',
    avatar: '👨🏻‍💻',
    available: false
  }, {
    name: 'Emily Rodriguez',
    status: 'In class till 6:00 AM',
    avatar: '👩🏻‍🎓',
    available: false
  }, {
    name: 'Alex Thompson',
    status: 'Available all day',
    avatar: '👨🏻‍🎨',
    available: true
  }];
  return <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🌅</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => onNavigate?.('notifications')}>
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        {/* Availability Toggle */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div>
              <h3 className="font-medium text-gray-900">Show as Available</h3>
              <p className="text-sm text-gray-600">
                {isAvailable ? 'Friends can see you\'re available to meet' : 'You appear busy to friends'}
              </p>
            </div>
          </div>
          <Switch 
            checked={isAvailable} 
            onCheckedChange={setIsAvailable}
          />
        </div>
      </div>

      {/* Upload Schedule Section */}
      <div className="px-6 py-6">
        <Card className="p-6 bg-white shadow-sm border-0 rounded-xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Upload Your Schedule</h2>
              <p className="text-sm text-gray-600 mt-1">
                Import your calendar or manually add your availability
              </p>
            </div>
            <Button 
              onClick={() => onNavigate?.('schedule')} 
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-6 py-3"
            >
              Upload Schedule
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => onNavigate?.('find-people')}>
              <Search className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => onNavigate?.('schedule')}>
              <Calendar className="w-5 h-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200" onClick={() => onNavigate?.('favorites')}>
              <Heart className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 bg-white shadow-sm border-0 rounded-xl hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate?.('groups')}>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create Group</h3>
                <p className="text-xs text-gray-600">Start coordinating</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white shadow-sm border-0 rounded-xl hover:scale-105 transition-transform cursor-pointer" onClick={() => onNavigate?.('find-people')}>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Find Users</h3>
                <p className="text-xs text-gray-600">Discover friends</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Available Friends */}
      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Available Friends</h2>
          <span className="text-sm text-gray-600">
            {availableFriends.filter(f => f.available).length} available
          </span>
        </div>
        
        <div className="space-y-3">
          {availableFriends.map((friend, index) => (
            <Card key={index} className="p-4 bg-white shadow-sm border-0 rounded-xl hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                      {friend.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      friend.available ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                    <p className={`text-sm ${friend.available ? 'text-green-600' : 'text-orange-600'}`}>
                      {friend.status}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200" 
                    onClick={() => onNavigate?.('messages')}
                  >
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>;
};
export default HomeScreen;