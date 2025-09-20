
import React, { useState } from 'react';
import GroupsScreen from '@/components/GroupsScreen';
import BottomNavigation from '@/components/BottomNavigation';

const GroupsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="pb-20">
        <GroupsScreen />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default GroupsPage;
