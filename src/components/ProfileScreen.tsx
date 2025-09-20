
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileImageUpload from './ProfileImageUpload';
import { supabase } from '@/integrations/supabase/client';

const ProfileScreen = () => {
  const [showSchedule, setShowSchedule] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');
  const { user, signOut, getProfile } = useAuth();

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Fetch user profile data including avatar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data?.avatar_url) {
        setProfileImageUrl(data.avatar_url);
      }
    };

    fetchProfile();
  }, [user]);

  // Handle theme changes
  const handleThemeChange = (isDark: boolean) => {
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleImageUpdate = (url: string) => {
    setProfileImageUrl(url);
  };

  const testBackendAPI = async () => {
    console.log('Testing backend API...');
    const result = await getProfile();
    console.log('Backend API result:', result);
    alert(`Backend API result: ${JSON.stringify(result, null, 2)}`);
  };

  const profileStats = [
    { label: 'Following', count: 56 },
    { label: 'Followers', count: 52 }
  ];

  const menuItems = [
    { icon: '🔒', label: 'Change Password', hasChevron: true },
    { icon: '📅', label: 'Show my schedule', toggle: showSchedule, onToggle: setShowSchedule },
    { icon: '🔔', label: 'Notifications', toggle: notifications, onToggle: setNotifications },
    { icon: '🎓', label: 'Tutorial', hasChevron: true },
    { icon: 'ℹ️', label: 'Terms and conditions', hasChevron: true }
  ];

  // Extract user info
  const userEmail = user?.email || '';
  const displayName = user?.user_metadata?.full_name || userEmail.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
      {/* Header with Mountain Background */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 overflow-hidden">
        {/* Mountain silhouette effect */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-800/30 to-transparent"></div>
        
        {/* Profile Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end space-x-4">
            <ProfileImageUpload 
              currentImageUrl={profileImageUrl}
              onImageUpdate={handleImageUpdate}
            />
            <div className="text-white pb-2">
              <h1 className="text-2xl font-bold">{displayName}</h1>
              <p className="text-white/80">{userEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {profileStats.map((stat, index) => (
            <Card key={index} className="p-4 bg-white dark:bg-gray-800 shadow-sm border-0 rounded-xl text-center transition-colors duration-300">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Card key={index} className="p-4 bg-white dark:bg-gray-800 shadow-sm border-0 rounded-xl transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                </div>
                
                {item.hasChevron && (
                  <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
                
                {item.toggle !== undefined && (
                  <button
                    onClick={() => item.onToggle && item.onToggle(!item.toggle)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      item.toggle ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      item.toggle ? 'translate-x-6' : 'translate-x-0'
                    }`}></div>
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Theme Toggle */}
        <div className="mt-6">
          <Card className="p-4 bg-white dark:bg-gray-800 shadow-sm border-0 rounded-xl transition-colors duration-300">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleThemeChange(false)}
                className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
                  !darkMode ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <span>☀️</span>
                <span className="font-medium">Light Mode</span>
              </button>
              <button
                onClick={() => handleThemeChange(true)}
                className={`p-3 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 ${
                  darkMode ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <span>🌙</span>
                <span className="font-medium">Dark Mode</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Test Backend API */}
        <div className="mt-6">
          <Button 
            onClick={testBackendAPI}
            variant="outline" 
            className="w-full border-2 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-xl py-3 transition-colors duration-300"
          >
            Test Backend API
          </Button>
        </div>

        {/* Log Out */}
        <div className="mt-6">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl py-3 transition-colors duration-300"
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
