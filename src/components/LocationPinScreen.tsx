
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MapPin, Users, Navigation, Send, X } from 'lucide-react';

const LocationPinScreen = ({ onBack }: { onBack: () => void }) => {
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [selectedPin, setSelectedPin] = useState<any>(null);
  const [sidebarChatOpen, setSidebarChatOpen] = useState(false);
  const [chatFriend, setChatFriend] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [nearbyFriends, setNearbyFriends] = useState([
    { id: 1, name: 'Sarah', avatar: '👩🏻‍💼', x: 45, y: 60, distance: '0.2 miles' },
    { id: 2, name: 'Mike', avatar: '👨🏻‍💻', x: 65, y: 40, distance: '0.1 miles' },
    { id: 3, name: 'Emma', avatar: '👩🏻‍🎓', x: 30, y: 75, distance: '0.3 miles' },
  ]);

  const [userPin, setUserPin] = useState({ x: 50, y: 50 });
  const [mapPins, setMapPins] = useState([
    { id: 1, x: 25, y: 30, type: 'study', label: 'Library Study Room' },
    { id: 2, x: 75, y: 70, type: 'food', label: 'Campus Cafe' },
    { id: 3, x: 60, y: 25, type: 'meeting', label: 'Student Union' },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Sarah', message: 'Hey! Are you at the library?', time: '2:30 PM', isMe: false },
    { id: 2, sender: 'Me', message: 'Yes, just arrived!', time: '2:32 PM', isMe: true },
  ]);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!locationEnabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setUserPin({ x, y });
    
    // Animate pin drop
    e.currentTarget.style.transform = 'scale(1.02)';
    setTimeout(() => {
      if (e.currentTarget) {
        e.currentTarget.style.transform = 'scale(1)';
      }
    }, 200);
  };

  const getPinIcon = (type: string) => {
    switch (type) {
      case 'study': return '📚';
      case 'food': return '☕';
      case 'meeting': return '🏢';
      default: return '📍';
    }
  };

  const handleViewStatus = (friend: any) => {
    console.log('Viewing status for:', friend.name);
    setSelectedPin(null);
  };

  const handleMessage = (friend: any) => {
    setChatFriend(friend);
    setSidebarChatOpen(true);
    setSelectedPin(null);
  };

  const handleInviteToMeet = (friend: any) => {
    console.log('Inviting to meet:', friend.name);
    setSelectedPin(null);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && chatFriend) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'Me',
        message: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessageText('');
    }
  };

  // Handle drag events for the popup
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setDragCurrentY(clientY);
    setIsDragging(true);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragCurrentY(clientY);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const dragDistance = dragCurrentY - dragStartY;
    
    // If dragged down more than 100px, close the popup
    if (dragDistance > 100) {
      setSelectedPin(null);
    }
    
    setIsDragging(false);
    setDragStartY(0);
    setDragCurrentY(0);
  };

  // Add event listeners for mouse/touch events
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleDragMove(e as any);
      const handleTouchMove = (e: TouchEvent) => handleDragMove(e as any);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchEnd = () => handleDragEnd();

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, dragCurrentY, dragStartY]);

  const getDragTransform = () => {
    if (!isDragging) return 'translateY(0)';
    const dragDistance = Math.max(0, dragCurrentY - dragStartY);
    return `translateY(${dragDistance}px)`;
  };

  const getDragOpacity = () => {
    if (!isDragging) return 1;
    const dragDistance = Math.max(0, dragCurrentY - dragStartY);
    return Math.max(0.3, 1 - (dragDistance / 300));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarChatOpen ? 'mr-80' : ''}`}>
        {/* Header */}
        <div className="gradient-primary p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 p-2">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-semibold">Location Smart Pin</h1>
            <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
              ⚙️
            </Button>
          </div>

          {/* Location Toggle */}
          <Card className="bg-white/10 backdrop-blur-sm border-0 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Navigation className="w-5 h-5 text-white" />
                <div>
                  <p className="font-medium text-white">Real-time Location Sharing</p>
                  <p className="text-xs text-white/70">Let friends see when you're nearby</p>
                </div>
              </div>
              <button
                onClick={() => setLocationEnabled(!locationEnabled)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  locationEnabled ? 'bg-green-400' : 'bg-white/30'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  locationEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}></div>
              </button>
            </div>
          </Card>
        </div>

        {/* Interactive Map */}
        <div className="relative -mt-4 mx-4 mb-6">
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
            <div
              className="h-80 bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 relative cursor-crosshair"
              onClick={handleMapClick}
            >
              {/* Campus buildings representation */}
              <div className="absolute top-4 left-4 w-16 h-12 bg-gray-300 rounded opacity-60"></div>
              <div className="absolute top-8 right-8 w-20 h-16 bg-gray-300 rounded opacity-60"></div>
              <div className="absolute bottom-8 left-8 w-12 h-20 bg-gray-300 rounded opacity-60"></div>
              <div className="absolute bottom-4 right-12 w-24 h-8 bg-gray-300 rounded opacity-60"></div>

              {/* Pathways */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 opacity-40 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-200 opacity-40 transform -translate-x-1/2"></div>

              {/* User's pin */}
              {locationEnabled && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 animate-bounce-subtle"
                  style={{ left: `${userPin.x}%`, top: `${userPin.y}%` }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse-gentle">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                      Your Location
                    </div>
                  </div>
                </div>
              )}

              {/* Nearby friends */}
              {locationEnabled && nearbyFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{ left: `${friend.x}%`, top: `${friend.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(friend);
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-white rounded-full border-3 border-blue-400 shadow-lg flex items-center justify-center text-lg animate-pulse-gentle">
                      {friend.avatar}
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              ))}

              {/* Location pins */}
              {mapPins.map((pin) => (
                <div
                  key={pin.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPin(pin);
                  }}
                >
                  <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-300 shadow-md flex items-center justify-center text-sm">
                    {getPinIcon(pin.type)}
                  </div>
                </div>
              ))}

              {/* Tap to pin indicator */}
              {locationEnabled && (
                <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  📍 Tap to drop pin
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Selected Pin Details */}
        {selectedPin && (
          <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-fade-in-up">
            <Card 
              className="w-full bg-white rounded-t-2xl p-6 border-0 shadow-2xl transition-all duration-200"
              style={{ 
                transform: getDragTransform(),
                opacity: getDragOpacity()
              }}
            >
              <div 
                className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
              ></div>
              
              {selectedPin.name ? (
                // Friend details
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                      {selectedPin.avatar}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedPin.name}</h3>
                      <p className="text-gray-600">{selectedPin.distance} away</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600">Available now</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <Button 
                      className="gradient-primary text-white rounded-xl py-6 px-6 flex items-center justify-center space-x-3 h-auto text-base"
                      onClick={() => handleViewStatus(selectedPin)}
                    >
                      <span className="text-xl">👀</span>
                      <span className="font-medium">View Status</span>
                    </Button>
                    <Button 
                      className="gradient-accent text-white rounded-xl py-6 px-6 flex items-center justify-center space-x-3 h-auto text-base"
                      onClick={() => handleMessage(selectedPin)}
                    >
                      <span className="text-xl">💬</span>
                      <span className="font-medium">Message</span>
                    </Button>
                    <Button 
                      className="gradient-secondary text-white rounded-xl py-6 px-6 flex items-center justify-center space-x-3 h-auto text-base"
                      onClick={() => handleInviteToMeet(selectedPin)}
                    >
                      <span className="text-xl">📍</span>
                      <span className="font-medium">Invite to Meet</span>
                    </Button>
                  </div>
                </div>
              ) : (
                // Location pin details
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getPinIcon(selectedPin.type)}</div>
                    <h3 className="text-xl font-semibold">{selectedPin.label}</h3>
                    <p className="text-gray-600">Meeting location</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="gradient-primary text-white rounded-xl py-3">
                      Share Location
                    </Button>
                    <Button variant="outline" className="border-2 rounded-xl py-3">
                      Get Directions
                    </Button>
                  </div>
                </div>
              )}
              
              <Button
                variant="ghost"
                onClick={() => setSelectedPin(null)}
                className="w-full mt-4 py-3"
              >
                Close
              </Button>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="px-6 pb-20">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white shadow-sm border-0 rounded-xl">
              <div className="text-center">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900">Nearby Groups</h3>
                <p className="text-sm text-gray-600 mt-1">3 active groups</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-white shadow-sm border-0 rounded-xl">
              <div className="text-center">
                <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center mx-auto mb-2">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900">Popular Spots</h3>
                <p className="text-sm text-gray-600 mt-1">Campus hotspots</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {sidebarChatOpen && chatFriend && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40 flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#0057B7] p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                {chatFriend.avatar}
              </div>
              <div>
                <h2 className="text-lg font-semibold">{chatFriend.name}</h2>
                <p className="text-sm text-white/70">Online</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={() => setSidebarChatOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                  msg.isMe 
                    ? 'bg-[#0057B7] text-white' 
                    : 'bg-[#D2B48C]/20 text-[#333333]'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.isMe ? 'text-white/70' : 'text-[#708090]'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 border-gray-300 focus:border-[#0057B7] rounded-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                className="w-10 h-10 rounded-full bg-[#0057B7] hover:bg-[#0057B7]/80 text-white p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPinScreen;
