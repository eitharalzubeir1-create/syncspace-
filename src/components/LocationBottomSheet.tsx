import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Phone, Navigation, Share, MapPin, Clock, Users } from 'lucide-react';

interface LocationBottomSheetProps {
  item: any;
  onClose: () => void;
  onGetDirections: () => void;
  onMessage?: () => void;
  onCall?: () => void;
}

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  item,
  onClose,
  onGetDirections,
  onMessage,
  onCall
}) => {
  const isFriend = item.avatar;
  const isRoom = item.number;
  const isLocation = !isFriend && !isRoom;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 animate-fade-in">
      <div className="w-full bg-white rounded-t-3xl shadow-2xl animate-slide-in-right">
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div className="p-6 pb-8">
          {isFriend ? (
            // Friend Details with Life360-style design
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl text-white shadow-lg">
                  {item.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 font-medium">{item.building} Building</p>
                  <p className="text-sm text-gray-500">{item.room} • Floor {item.floor}</p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-green-600 font-medium">{item.status}</span>
                    </div>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{item.lastSeen}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <Button 
                  variant="outline" 
                  className="flex-col h-16 space-y-1 rounded-2xl border-gray-200 hover:bg-blue-50"
                  onClick={onMessage}
                >
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-xs text-gray-700">Message</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-col h-16 space-y-1 rounded-2xl border-gray-200 hover:bg-green-50"
                  onClick={onCall}
                >
                  <Phone className="w-5 h-5 text-green-600" />
                  <span className="text-xs text-gray-700">Call</span>
                </Button>
                <Button 
                  className="flex-col h-16 space-y-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onGetDirections}
                >
                  <Navigation className="w-5 h-5" />
                  <span className="text-xs">Directions</span>
                </Button>
              </div>
            </div>
          ) : isRoom ? (
            // Room Details with modern design
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-white text-2xl">🚪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.number}</h3>
                <p className="text-gray-600 font-medium">{item.name}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>Floor {item.floor}</span>
                  </div>
                  <span>•</span>
                  <span>{item.building_code} Building</span>
                  {item.capacity && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{item.capacity} people</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Room Type Badge */}
              <div className="flex justify-center">
                <Badge 
                  variant="secondary" 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} Room
                </Badge>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onGetDirections}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Directions
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 rounded-2xl border-gray-200 hover:bg-gray-50"
                >
                  <Share className="w-5 h-5 mr-2" />
                  Share Location
                </Button>
              </div>
            </div>
          ) : (
            // Location/Service Details
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <span className="text-white text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              {/* Service Type Badge */}
              <div className="flex justify-center">
                <Badge 
                  variant="secondary" 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full"
                >
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Badge>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={onGetDirections}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Get Directions
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 rounded-2xl border-gray-200 hover:bg-gray-50"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  More Info
                </Button>
              </div>
            </div>
          )}
          
          {/* Close Button */}
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full mt-6 py-3 text-gray-600 hover:bg-gray-50 rounded-2xl"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationBottomSheet;