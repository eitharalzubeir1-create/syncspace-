import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Navigation, MapPin, Users, Building as BuildingIcon, Info } from 'lucide-react';
import { supabase, supabaseConfigured } from '@/lib/supabaseClient';

interface Building {
  id: string;
  name: string;
  code: string;
  floors: number;
  x: number;
  y: number;
  color: string;
  description: string;
}

interface Room {
  id: string;
  number: string;
  building_code: string;
  floor: number;
  name?: string;
  capacity?: number;
}

interface CampusLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  description: string;
}

interface FriendLocation {
  id: number | string;
  name: string;
  avatar: string;
  building: string;
  floor: number;
  room: string;
  x: number;
  y: number;
  status: string;
  lastSeen: string;
}

interface CampusMapScreenProps {
  onBack: () => void;
}

const CampusMapScreen: React.FC<CampusMapScreenProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mapMode, setMapMode] = useState<'overview' | 'building'>('overview');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [campusBuildings, setCampusBuildings] = useState<Building[]>([]);
  const [campusRooms, setCampusRooms] = useState<Room[]>([]);
  const [campusLocations, setCampusLocations] = useState<CampusLocation[]>([]);
  const [sampleFriendLocations, setSampleFriendLocations] = useState<FriendLocation[]>([]);

  useEffect(() => {
    if (!supabaseConfigured) {
      console.warn('Supabase is not configured. Skipping campus data fetch.');
      return;
    }
    const fetchData = async () => {
      try {
        const [buildingsRes, roomsRes, locationsRes, friendsRes] = await Promise.all([
          supabase.from('campus_buildings').select('*'),
          supabase.from('campus_rooms').select('*'),
          supabase.from('campus_locations').select('*'),
          supabase.from('friend_locations').select('*'),
        ]);

        if (buildingsRes.error) console.error('Error fetching buildings:', buildingsRes.error);
        if (roomsRes.error) console.error('Error fetching rooms:', roomsRes.error);
        if (locationsRes.error) console.error('Error fetching locations:', locationsRes.error);
        if (friendsRes.error) console.error('Error fetching friends:', friendsRes.error);

        setCampusBuildings(buildingsRes.data || []);
        setCampusRooms(roomsRes.data || []);
        setCampusLocations(locationsRes.data || []);
        setSampleFriendLocations(friendsRes.data || []);
      } catch (err) {
        console.error('Failed to load campus data:', err);
      }
    };

    fetchData();
  }, [supabaseConfigured]);

  // Filter search results based on query
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = [
        ...campusBuildings.filter(b => 
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.code.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(b => ({ ...b, type: 'building' })),
        ...campusRooms.filter(r => 
          r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.name?.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(r => ({ ...r, type: 'room' })),
        ...campusLocations.filter(l => 
          l.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(l => ({ ...l, type: 'location' }))
      ];
      setSearchResults(results.slice(0, 8)); // Limit to 8 results
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchQuery]);

  const handleSearchSelect = (item: any) => {
    if (item.type === 'building') {
      setSelectedBuilding(item);
      setMapMode('building');
    } else if (item.type === 'room') {
      const building = campusBuildings.find(b => b.code === item.building_code);
      if (building) {
        setSelectedBuilding(building);
        setMapMode('building');
        setSelectedItem(item);
      }
    } else {
      setSelectedItem(item);
    }
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleBuildingClick = (building: Building) => {
    setSelectedBuilding(building);
    setMapMode('building');
  };

  const handleFriendClick = (friend: any) => {
    setSelectedItem(friend);
  };

  const getDirections = (destination: any) => {
    // In a real app, this would integrate with navigation services
    console.log('Getting directions to:', destination);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 p-2">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-semibold">UDST Campus Map</h1>
            <p className="text-sm text-white/80">
              {mapMode === 'overview' ? 'Campus Overview' : `${selectedBuilding?.name}`}
            </p>
          </div>
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 p-2"
            onClick={() => setLocationEnabled(!locationEnabled)}
          >
            <Navigation className={`w-6 h-6 ${locationEnabled ? 'text-green-300' : 'text-white/50'}`} />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search rooms, buildings, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl"
            />
          </div>

          {/* Search Results Dropdown */}
          {showSearch && searchResults.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border-0 shadow-xl rounded-xl max-h-80 overflow-y-auto">
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSearchSelect(result)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-lg">
                      {result.type === 'building' ? '🏢' : 
                       result.type === 'room' ? '🚪' : 
                       result.icon || '📍'}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {result.type === 'room' ? result.number : result.name || result.code}
                      </p>
                      <p className="text-xs text-gray-600">
                        {result.type === 'building' ? `${result.floors} floors` :
                         result.type === 'room' ? `Floor ${result.floor}, ${result.building_code}` :
                         result.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Mode Toggle */}
        {mapMode === 'building' && (
          <Button
            variant="ghost"
            onClick={() => { setMapMode('overview'); setSelectedBuilding(null); }}
            className="mt-3 text-white hover:bg-white/20 text-sm"
          >
            ← Back to Campus Overview
          </Button>
        )}
      </div>

      {/* Interactive Map */}
      <div className="relative -mt-4 mx-4 mb-6">
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
          {mapMode === 'overview' ? (
            // Campus Overview Mode
            <div className="relative h-96 bg-gradient-to-br from-gray-100 to-gray-200">
              {/* Campus Map Background - Using the uploaded TMU map as reference */}
              <div className="absolute inset-0 bg-white">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">UDST Campus Interactive Map</p>
                  </div>
                </div>
              </div>
              
              {/* Building Overlays */}
              {campusBuildings.map((building) => (
                <div
                  key={building.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{ left: `${building.x}%`, top: `${building.y}%` }}
                  onClick={() => handleBuildingClick(building)}
                >
                  <div 
                    className="w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold animate-pulse-gentle"
                    style={{ backgroundColor: building.color }}
                  >
                    {building.code.slice(0, 3)}
                  </div>
                </div>
              ))}

              {/* Friend Locations */}
              {locationEnabled && sampleFriendLocations.map((friend) => (
                <div
                  key={friend.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 hover:scale-110 z-50"
                  style={{ left: `${friend.x}%`, top: `${friend.y}%` }}
                  onClick={() => handleFriendClick(friend)}
                >
                  <div className="relative">
                    {/* Friend Pin - Made smaller and pin-like */}
                    <div className="relative">
                      <div className="w-8 h-8 text-primary fill-primary drop-shadow-lg">
                        <svg viewBox="0 0 24 24" className="w-full h-full">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/>
                        </svg>
                      </div>
                      
                      {/* Avatar inside pin */}
                      <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs shadow-sm">
                        <span>{friend.avatar}</span>
                      </div>
                      
                      {/* Status indicator */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white shadow-sm ${
                        friend.status.toLowerCase() === 'available' ? 'bg-green-500' :
                        friend.status.toLowerCase().includes('class') || friend.status.toLowerCase().includes('meeting') || friend.status.toLowerCase().includes('studio') ? 'bg-red-500' :
                        friend.status.toLowerCase() === 'studying' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                    </div>
                    
                    {/* Hover tooltip */}
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-all duration-200 pointer-events-none">
                      <div className="bg-card text-foreground text-xs px-2 py-1 rounded-lg shadow-lg border whitespace-nowrap">
                        {friend.name}
                        <div className="text-xs text-muted-foreground capitalize">{friend.status}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Campus Services */}
              {campusLocations.map((location) => (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110"
                  style={{ left: `${location.x}%`, top: `${location.y}%` }}
                  onClick={() => setSelectedItem(location)}
                >
                  <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-300 shadow-md flex items-center justify-center text-xs">
                    {location.icon}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Building Floor Plan Mode
            <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 relative">
              <div className="absolute inset-4 border-2 border-gray-300 rounded-lg bg-white/50">
                <div className="p-4 h-full">
                  <h3 className="text-lg font-semibold mb-4">{selectedBuilding?.name}</h3>
                  <div className="grid grid-cols-3 gap-4 h-3/4">
                    {/* Sample room layout */}
                    {campusRooms
                      .filter(room => room.building_code === selectedBuilding?.code)
                      .slice(0, 6)
                      .map((room, index) => (
                      <div
                        key={room.id}
                        className="bg-white border-2 border-gray-200 rounded-lg p-2 cursor-pointer hover:bg-blue-50 transition-colors"
                        onClick={() => setSelectedItem(room)}
                      >
                        <div className="text-xs font-semibold">{room.number}</div>
                        <div className="text-xs text-gray-600">{room.name}</div>
                        <div className="text-xs text-gray-500">Floor {room.floor}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Tap rooms for details • Floor plan is simplified for demo
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center bg-white shadow-sm border-0 rounded-xl">
            <BuildingIcon className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">{campusBuildings.length}</div>
            <div className="text-xs text-gray-600">Buildings</div>
          </Card>
          <Card className="p-3 text-center bg-white shadow-sm border-0 rounded-xl">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">{sampleFriendLocations.length}</div>
            <div className="text-xs text-gray-600">Friends Online</div>
          </Card>
          <Card className="p-3 text-center bg-white shadow-sm border-0 rounded-xl">
            <MapPin className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-semibold text-gray-900">{campusLocations.length}</div>
            <div className="text-xs text-gray-600">Services</div>
          </Card>
        </div>
      </div>

      {/* Selected Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50 animate-fade-in-up">
          <Card className="w-full bg-white rounded-t-2xl p-6 border-0 shadow-2xl">
            {selectedItem.avatar ? (
              // Friend Details
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                    {selectedItem.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                    <p className="text-gray-600">{selectedItem.building} - Floor {selectedItem.floor}</p>
                    <p className="text-sm text-gray-500">{selectedItem.room}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-600">{selectedItem.status}</span>
                      <span className="text-xs text-gray-400">• {selectedItem.lastSeen}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="gradient-primary text-white rounded-xl">
                    Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl"
                    onClick={() => getDirections(selectedItem)}
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            ) : selectedItem.number ? (
              // Room Details
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedItem.number}</h3>
                  <p className="text-gray-600">{selectedItem.name}</p>
                  <p className="text-sm text-gray-500">
                    Floor {selectedItem.floor} • {selectedItem.building_code} Building
                  </p>
                  {selectedItem.capacity && (
                    <p className="text-sm text-gray-500">Capacity: {selectedItem.capacity} people</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="gradient-primary text-white rounded-xl"
                    onClick={() => getDirections(selectedItem)}
                  >
                    Get Directions
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    Share Location
                  </Button>
                </div>
              </div>
            ) : (
              // Location/Service Details
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">{selectedItem.icon}</div>
                  <h3 className="text-xl font-semibold">{selectedItem.name}</h3>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    className="gradient-primary text-white rounded-xl"
                    onClick={() => getDirections(selectedItem)}
                  >
                    Get Directions
                  </Button>
                  <Button variant="outline" className="rounded-xl">
                    More Info
                  </Button>
                </div>
              </div>
            )}
            
            <Button
              variant="ghost"
              onClick={() => setSelectedItem(null)}
              className="w-full mt-4 py-3"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CampusMapScreen;