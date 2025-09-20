import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FriendMarkerProps {
  friend: {
    id: number;
    name: string;
    avatar: string;
    building: string;
    floor: number;
    room: string;
    x: number;
    y: number;
    status: string;
    lastSeen: string;
  };
  onClick: () => void;
}

const FriendMarker: React.FC<FriendMarkerProps> = ({ friend, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available': return 'bg-green-500';
      case 'in class': return 'bg-red-500';
      case 'studying': return 'bg-yellow-500';
      case 'in studio': return 'bg-red-500';
      case 'in meeting': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300 hover:scale-110 z-50"
      style={{ left: `${friend.x}%`, top: `${friend.y}%` }}
      onClick={onClick}
    >
      <div className="relative">
        {/* Friend Pin - Made smaller and pin-like */}
        <div className="relative">
          <MapPin className="w-8 h-8 text-primary fill-primary drop-shadow-lg" />
          
          {/* Avatar inside pin */}
          <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-white flex items-center justify-center text-xs shadow-sm">
            <span>{friend.avatar}</span>
          </div>
          
          {/* Status indicator */}
          <div className={`absolute -top-1 -right-1 w-3 h-3 ${getStatusColor(friend.status)} rounded-full border border-white shadow-sm`}></div>
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
  );
};

export default FriendMarker;