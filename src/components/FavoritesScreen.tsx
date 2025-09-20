
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart } from 'lucide-react';

interface FavoritesScreenProps {
  onBack?: () => void;
}

const FavoritesScreen = ({ onBack }: FavoritesScreenProps) => {
  const favoriteContacts = [
    { name: 'Sarah Johnson', status: 'Available till 3:00 PM', avatar: '👩🏻‍💼', available: true },
    { name: 'Alex Thompson', status: 'Available all day', avatar: '👨🏻‍🎨', available: true },
    { name: 'Emma Davis', status: 'Free till 5:00 PM', avatar: '👩🏻‍🎤', available: true },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-[#0057B7] p-6 text-white">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="lg" 
            className="text-white hover:bg-white/20 rounded-xl p-3 min-w-[48px] h-12"
            onClick={onBack}
          >
            <ArrowLeft className="w-7 h-7" />
          </Button>
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-[#D2B48C]" />
            <h1 className="text-xl font-semibold">Favorite Contacts</h1>
          </div>
        </div>
      </div>

      {/* Favorites List */}
      <div className="px-6 pt-6 space-y-4">
        {favoriteContacts.length > 0 ? (
          favoriteContacts.map((contact, index) => (
            <Card key={index} className="p-4 bg-white shadow-sm border border-[#A9A9A9]/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#D2B48C]/20 rounded-full flex items-center justify-center text-xl">
                    {contact.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-[#333333]">{contact.name}</h3>
                      <Heart className="w-4 h-4 text-[#0057B7] fill-current" />
                    </div>
                    <p className={`text-sm ${contact.available ? 'text-green-600' : 'text-orange-600'}`}>
                      {contact.status}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="w-10 h-10 rounded-full bg-[#D2B48C]/20 hover:bg-[#D2B48C]/40">
                    <span className="text-[#0057B7]">💬</span>
                  </Button>
                  <Button size="sm" className="w-10 h-10 rounded-full bg-[#0057B7] hover:bg-[#0057B7]/80 text-white">
                    📞
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 bg-white shadow-sm border border-[#A9A9A9]/30 rounded-xl text-center">
            <Heart className="w-16 h-16 text-[#A9A9A9] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#708090] mb-2">No Favorite Contacts</h3>
            <p className="text-[#708090]">Add contacts to your favorites to see them here.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;
