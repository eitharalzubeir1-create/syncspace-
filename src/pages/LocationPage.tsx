
import React from 'react';
import MapNavigationScreen from '@/components/MapNavigationScreen';
import BottomNavigation from '@/components/BottomNavigation';

const LocationPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <MapNavigationScreen onBack={() => window.history.back()} />
      <BottomNavigation />
    </div>
  );
};

export default LocationPage;
