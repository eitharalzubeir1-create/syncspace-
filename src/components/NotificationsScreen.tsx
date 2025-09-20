
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

const NotificationsScreen = ({ onBack }: { onBack: () => void }) => {
  const notifications = [
    {
      type: 'friend_request',
      icon: '👥',
      title: 'Friend Request',
      message: 'John Smith has requested to be friends.',
      user: 'Haily Brown',
      handle: '@brownisthenewblack',
      time: '2 hours ago',
      color: 'bg-purple-100'
    },
    {
      type: 'friend_request',
      icon: '👥',
      title: 'Friend Request',
      message: 'John Smith has requested to be friends.',
      user: 'John Smith',
      handle: '@johnsmithly',
      time: '2 hours ago',
      color: 'bg-purple-100'
    },
    {
      type: 'comment',
      icon: '💬',
      title: 'New Comment!',
      message: 'You are so awesome! Keep it up!',
      time: '2 hours ago',
      color: 'bg-pink-100'
    },
    {
      type: 'like',
      icon: '💜',
      title: 'New Like!',
      message: 'You have a new like from John Smith.',
      time: '2 hours ago',
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white p-6 border-b">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="lg"
            className="rounded-xl p-3 min-w-[48px] h-12 hover:bg-gray-100 transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <h1 className="text-xl font-semibold">Notifications</h1>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-6 py-6 space-y-4">
        {notifications.map((notification, index) => (
          <Card key={index} className="p-4 bg-white shadow-sm border-0 rounded-xl">
            <div className="flex items-start space-x-4">
              <div className={`w-10 h-10 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-lg">{notification.icon}</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                    
                    {notification.user && (
                      <div className="mt-2">
                        <p className="font-medium text-gray-900">{notification.user}</p>
                        <p className="text-sm text-purple-600">{notification.handle}</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  
                  {notification.type === 'friend_request' && (
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" className="gradient-primary text-white rounded-lg px-4">
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-lg px-4">
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="px-6 py-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-gray-400">🔔</span>
        </div>
        <p className="text-gray-500">You're all caught up!</p>
        <p className="text-sm text-gray-400 mt-1">No more notifications to show</p>
      </div>
    </div>
  );
};

export default NotificationsScreen;
