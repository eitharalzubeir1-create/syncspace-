import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Navigation, MapPin, Users, Layers, Plus, MessageCircle, Phone, Globe, Mountain, Satellite, Map as MapIcon } from 'lucide-react';
import { campusBuildings, campusRooms, campusLocations, sampleFriendLocations, type Building } from '@/data/campusData';
import DirectionFlowScreen from './DirectionFlowScreen';
import FriendMarker from './FriendMarker';
import LocationBottomSheet from './LocationBottomSheet';

interface MapNavigationScreenProps {
  onBack: () => void;
}

const MapNavigationScreen: React.FC<MapNavigationScreenProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mapMode, setMapMode] = useState<'overview' | 'building'>('overview');
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [directionsTo, setDirectionsTo] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(['friends', 'buildings', 'services']);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [userLocation, setUserLocation] = useState({ x: 50, y: 50 });
  const [mapStyle, setMapStyle] = useState<'roadmap' | 'terrain' | 'satellite' | 'hybrid'>('roadmap');
  const [showMapStyles, setShowMapStyles] = useState(false);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[] | null>(null);

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
      setSearchResults(results.slice(0, 8));
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

  const getDirections = (destination: any) => {
    // Generate blue path from user to destination
    const pathPoints = [
      userLocation,
      { x: userLocation.x + 10, y: userLocation.y + 5 },
      { x: destination.x - 10, y: destination.y - 5 },
      { x: destination.x, y: destination.y }
    ];
    setCurrentPath(pathPoints);
    setDirectionsTo(destination);
    setShowDirections(true);
    setSelectedItem(null);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filterChips = [
    { id: 'friends', label: 'Friends', icon: Users, color: 'bg-primary/10 text-primary border-primary/20' },
    { id: 'buildings', label: 'Buildings', icon: MapPin, color: 'bg-secondary/10 text-secondary border-secondary/20' },
    { id: 'services', label: 'Services', icon: Layers, color: 'bg-accent/10 text-accent border-accent/20' }
  ];

  const mapStyleOptions = [
    { id: 'roadmap', label: 'Roadmap', icon: MapIcon, bgClass: 'map-roadmap' },
    { id: 'terrain', label: 'Terrain', icon: Mountain, bgClass: 'map-terrain' },
    { id: 'satellite', label: 'Satellite', icon: Satellite, bgClass: 'map-satellite' },
    { id: 'hybrid', label: 'Hybrid', icon: Globe, bgClass: 'map-hybrid' }
  ];

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'terrain': return 'gradient-map-terrain';
      case 'satellite': return 'gradient-map-satellite';
      case 'hybrid': return 'map-hybrid';
      default: return 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
    }
  };

  if (showDirections && directionsTo) {
    return (
      <DirectionFlowScreen
        destination={directionsTo}
        userLocation={userLocation}
        pathPoints={currentPath}
        onBack={() => {
          setShowDirections(false);
          setCurrentPath(null);
        }}
        onComplete={() => {
          setShowDirections(false);
          setDirectionsTo(null);
          setCurrentPath(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating Action Buttons */}
      <div className="fixed top-16 right-4 z-40 flex flex-col space-y-3">
        <div className="relative">
          <Button
            size="icon"
            className="w-12 h-12 rounded-full glass-effect hover:bg-white/20 text-foreground shadow-lg"
            onClick={() => setShowMapStyles(!showMapStyles)}
          >
            <Layers className="w-5 h-5" />
          </Button>
          
          {/* Map Style Selector */}
          {showMapStyles && (
            <Card className="absolute top-14 right-0 w-40 z-50 glass-effect border-white/20 animate-fade-in-up">
              <div className="p-2 space-y-1">
                {mapStyleOptions.map((style) => {
                  const Icon = style.icon;
                  return (
                    <Button
                      key={style.id}
                      variant="ghost"
                      size="sm"
                      className={`w-full justify-start h-10 ${mapStyle === style.id ? 'bg-primary/10 text-primary' : 'hover:bg-white/10'}`}
                      onClick={() => {
                        setMapStyle(style.id as any);
                        setShowMapStyles(false);
                      }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {style.label}
                    </Button>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
        
        <Button
          size="icon"
          className="w-12 h-12 rounded-full glass-effect hover:bg-white/20 text-foreground shadow-lg"
          onClick={() => setMapMode(mapMode === 'overview' ? 'building' : 'overview')}
        >
          <MapPin className="w-5 h-5" />
        </Button>
        
        <Button
          size="icon"
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Header with Modern Glassmorphism */}
      <div className="fixed top-0 left-0 right-0 z-30 glass-effect backdrop-blur-xl bg-background/90 border-b border-border/20">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="p-2 hover:bg-muted/50 rounded-full">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </Button>
            <div className="text-center">
              <h1 className="text-lg font-semibold text-foreground">Campus Map</h1>
              <p className="text-xs text-muted-foreground">
                {mapMode === 'overview' ? 'University of Doha for Science and Technology' : selectedBuilding?.name}
              </p>
            </div>
            <Button 
              variant="ghost" 
              className="p-2 hover:bg-muted/50 rounded-full"
              onClick={() => {/* Center on user location */}}
            >
              <Navigation className="w-6 h-6 text-primary" />
            </Button>
          </div>

          {/* Modern Search Bar */}
          <div className="relative mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search anywhere on campus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/60 border-border/30 rounded-full h-11 placeholder:text-muted-foreground focus:bg-card focus:border-primary/50 transition-all"
              />
            </div>

            {/* Enhanced Search Results */}
            {showSearch && searchResults.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-2 z-50 glass-effect backdrop-blur-xl border-border/20 shadow-xl rounded-2xl max-h-80 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className="p-4 hover:bg-muted/30 cursor-pointer border-b border-border/10 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl transition-all animate-slide-in"
                    onClick={() => handleSearchSelect(result)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-lg text-white shadow-md">
                        {result.type === 'building' ? '🏢' : 
                         result.type === 'room' ? '🚪' : 
                         result.icon || '📍'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">
                          {result.type === 'room' ? result.number : result.name || result.code}
                        </p>
                        <p className="text-xs text-muted-foreground">
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

          {/* Modern Filter Chips */}
          <div className="flex space-x-2 overflow-x-auto">
            {filterChips.map((chip) => {
              const Icon = chip.icon;
              const isActive = activeFilters.includes(chip.id);
              return (
                <Badge
                  key={chip.id}
                  variant={isActive ? "default" : "outline"}
                  className={`px-3 py-2 rounded-full cursor-pointer transition-all whitespace-nowrap animate-bounce-subtle ${
                    isActive ? chip.color : 'bg-card/60 text-muted-foreground border-border/30 hover:bg-muted/30'
                  }`}
                  onClick={() => toggleFilter(chip.id)}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  <span className="text-xs font-medium">{chip.label}</span>
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Interactive Map with Blue Path */}
      <div className="pt-36 pb-6 px-4">
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-card">
          {mapMode === 'overview' ? (
            // Campus Overview with Modern Style
            <div className={`relative h-[500px] ${getMapBackground()}`}>
              {/* Blue Navigation Path */}
              {currentPath && (
                <svg className="absolute inset-0 w-full h-full z-15 pointer-events-none">
                  <path
                    d={`M ${currentPath.map(p => `${p.x * 5} ${p.y * 5}`).join(' L ')}`}
                    stroke="hsl(var(--primary))"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray="8 4"
                    className="path-animated path-glow"
                  />
                </svg>
              )}
              
              {/* User Location */}
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-primary rounded-full border-2 border-background shadow-lg animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-primary/30 rounded-full animate-ping"></div>
                </div>
              </div>
              
              {/* Building Markers */}
              {activeFilters.includes('buildings') && campusBuildings.map((building) => (
                <div
                  key={building.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 z-10 animate-fade-in-up"
                  style={{ left: `${building.x}%`, top: `${building.y}%` }}
                  onClick={() => {
                    setSelectedBuilding(building);
                    setMapMode('building');
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-2xl border-2 border-background shadow-xl flex items-center justify-center text-white text-xs font-bold backdrop-blur-sm"
                    style={{ backgroundColor: building.color }}
                  >
                    {building.code.slice(0, 2)}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-background/90 text-foreground text-xs px-2 py-1 rounded-full whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
                    {building.name}
                  </div>
                </div>
              ))}

              {/* Friend Markers */}
              {activeFilters.includes('friends') && sampleFriendLocations.map((friend) => (
                <FriendMarker
                  key={friend.id}
                  friend={friend}
                  onClick={() => setSelectedItem(friend)}
                />
              ))}

              {/* Service Markers */}
              {activeFilters.includes('services') && campusLocations.map((location) => (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 z-10 animate-fade-in-up"
                  style={{ left: `${location.x}%`, top: `${location.y}%` }}
                  onClick={() => setSelectedItem(location)}
                >
                  <div className="w-10 h-10 bg-accent rounded-2xl border-2 border-background shadow-lg flex items-center justify-center text-sm backdrop-blur-sm">
                    {location.icon}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Building Floor Plan with Modern Design
            <div className={`h-[500px] ${getMapBackground()} relative`}>
              <div className="absolute inset-6 border-2 border-border/20 rounded-3xl glass-effect backdrop-blur-sm">
                <div className="p-6 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">{selectedBuilding?.name}</h3>
                    <Button
                      variant="ghost"
                      onClick={() => { setMapMode('overview'); setSelectedBuilding(null); setCurrentPath(null); }}
                      className="text-sm text-muted-foreground hover:bg-muted/50 rounded-full px-3 py-1"
                    >
                      Back to Campus
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4 h-3/4">
                    {campusRooms
                      .filter(room => room.building_code === selectedBuilding?.code)
                      .slice(0, 6)
                      .map((room) => (
                      <div
                        key={room.id}
                        className="glass-effect border-2 border-border/10 rounded-2xl p-3 cursor-pointer hover:bg-primary/5 transition-all shadow-sm hover:shadow-lg animate-fade-in-up"
                        onClick={() => setSelectedItem(room)}
                      >
                        <div className="text-sm font-semibold text-foreground">{room.number}</div>
                        <div className="text-xs text-muted-foreground mt-1">{room.name}</div>
                        <div className="text-xs text-muted-foreground">Floor {room.floor}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Sheet for Selected Items */}
      {selectedItem && (
        <LocationBottomSheet
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onGetDirections={() => getDirections(selectedItem)}
          onMessage={() => {/* Handle message */}}
          onCall={() => {/* Handle call */}}
        />
      )}
    </div>
  );
};

export default MapNavigationScreen;