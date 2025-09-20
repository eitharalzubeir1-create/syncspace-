
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Navigation } from 'lucide-react';

const FindPeopleScreen = ({ onBack }: { onBack: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const suggestedUsers = [
    {
      name: 'Alex Morgan',
      role: 'Product Designer',
      connections: '3 mutual connections',
      avatar: '👩🏻‍💼',
      following: false
    },
    {
      name: 'Jamie Chen',
      role: 'Software Engineer',
      connections: '5 mutual connections',
      avatar: '👨🏻‍💻',
      following: false
    },
    {
      name: 'Taylor Wilson',
      role: 'Project Manager',
      connections: '2 mutual connections',
      avatar: '👩🏻‍🎓',
      following: false
    },
    {
      name: 'Jordan Smith',
      role: 'Marketing Specialist',
      connections: '7 mutual connections',
      avatar: '👨🏻‍🎨',
      following: true
    },
    {
      name: 'Riley Johnson',
      role: 'UX Researcher',
      connections: '4 mutual connections',
      avatar: '👩🏻‍🔬',
      following: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="lg"
            className="rounded-xl p-3 min-w-[48px] h-12 hover:bg-gray-100 transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-xl font-semibold">Find People</h1>
          <Button variant="ghost" className="p-2">
            ⚙️
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3">
            <span className="text-gray-400 mr-3">🔍</span>
            <input
              type="text"
              placeholder="Search for users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-gray-700 flex-1"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 ml-2"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Users */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Suggested Users</h2>
          <Button variant="ghost" className="text-purple-600 font-medium">
            See All
          </Button>
        </div>

        <div className="space-y-4">
          {suggestedUsers.map((user, index) => (
            <Card key={index} className="p-4 bg-white shadow-sm border-0 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.role}</p>
                    <p className="text-xs text-purple-600 mt-1">• {user.connections}</p>
                  </div>
                </div>
                
                <Button
                  className={`rounded-xl px-6 py-2 font-medium transition-all duration-200 ${
                    user.following
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'gradient-primary text-white hover:opacity-90'
                  }`}
                >
                  {user.following ? 'Following' : 'Follow'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl">📱</span>
                </div>
                <h4 className="font-medium text-gray-900">Import Contacts</h4>
                <p className="text-sm text-gray-600 mt-1">Find friends from your contacts</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-white shadow-sm border-0 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center mx-auto mb-2">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900">Nearby Users</h4>
                <p className="text-sm text-gray-600 mt-1">Discover people around you</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindPeopleScreen;
