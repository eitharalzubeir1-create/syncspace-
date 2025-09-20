
import React, { useState } from 'react';
import ProfileScreen from '@/components/ProfileScreen';
import BottomNavigation from '@/components/BottomNavigation';

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="pb-20">
        <ProfileScreen />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
