import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthScreen from '@/components/AuthScreen';
import HomeScreen from '@/components/HomeScreen';
import LocationPinScreen from '@/components/LocationPinScreen';
import FindPeopleScreen from '@/components/FindPeopleScreen';
import NotificationsScreen from '@/components/NotificationsScreen';
import ScheduleScreen from '@/components/ScheduleScreen';
import FavoritesScreen from '@/components/FavoritesScreen';
import MessagesScreen from '@/components/MessagesScreen';
import BottomNavigation from '@/components/BottomNavigation';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Remove the guest mode clearing logic to allow guest functionality

  useEffect(() => {
    // Only redirect if loading is complete and user is not authenticated and not in guest mode
    if (!loading) {
      const isGuestMode = localStorage.getItem('guest_mode') === 'true';
      
      if (!user && !isGuestMode) {
        navigate('/auth');
      }
    }
  }, [user, loading, navigate]);

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen);
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated or in guest mode
  const isGuestMode = localStorage.getItem('guest_mode') === 'true';
  
  // Only render null if we're sure the user should be redirected (after loading is complete)
  if (!user && !isGuestMode) {
    return null;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'location-pin':
        return <LocationPinScreen onBack={() => setCurrentScreen('home')} />;
      case 'find-people':
        return <FindPeopleScreen onBack={() => setCurrentScreen('home')} />;
      case 'notifications':
        return <NotificationsScreen onBack={() => setCurrentScreen('home')} />;
      case 'schedule':
        return <ScheduleScreen onBack={() => setCurrentScreen('home')} />;
      case 'favorites':
        return <FavoritesScreen onBack={() => setCurrentScreen('home')} />;
      case 'messages':
        return <MessagesScreen onBack={() => setCurrentScreen('home')} />;
      case 'groups':
        // Navigate to groups page via react router
        window.location.href = '/groups';
        return null;
      default:
        return <HomeScreen onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Screen Content */}
      <div className="pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Floating Action Button for Location Pin */}
      {currentScreen === 'home' && (
        <button
          onClick={() => navigateToScreen('location-pin')}
          className="fixed bottom-24 right-6 w-14 h-14 bg-[#0057B7] dark:bg-blue-700 rounded-full shadow-xl flex items-center justify-center text-white z-40 hover:scale-110 transition-all duration-200"
        >
          <span className="text-xl">📍</span>
        </button>
      )}
    </div>
  );
};

export default Index;
