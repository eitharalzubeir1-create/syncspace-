
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Search } from 'lucide-react';

interface MessagesScreenProps {
  onBack?: () => void;
}

const MessagesScreen = ({ onBack }: MessagesScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: '👩🏻‍💼',
      lastMessage: 'Hey! Are you free to study later?',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Alex Thompson',
      avatar: '👨🏻‍🎨',
      lastMessage: 'Thanks for the notes!',
      timestamp: '1h ago',
      unread: 0,
      online: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: '👩🏻‍🎓',
      lastMessage: 'See you tomorrow at the library',
      timestamp: '3h ago',
      unread: 1,
      online: false
    }
  ];

  const messages = [
    { id: 1, sender: 'Sarah Johnson', message: 'Hey! Are you free to study later?', time: '2:30 PM', isMe: false },
    { id: 2, sender: 'Me', message: 'Sure! What time works for you?', time: '2:32 PM', isMe: true },
    { id: 3, sender: 'Sarah Johnson', message: 'How about 4 PM at the library?', time: '2:33 PM', isMe: false }
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-white">
        {/* Chat Header */}
        <div className="bg-[#0057B7] p-4 text-white">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 p-2"
              onClick={() => setSelectedChat(null)}
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
                {selectedChat.avatar}
              </div>
              <div>
                <h1 className="text-lg font-semibold">{selectedChat.name}</h1>
                <p className="text-sm text-white/70">{selectedChat.online ? 'Online' : 'Last seen 1h ago'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 pb-20">
          {messages.map((msg) => (
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#A9A9A9]/30 p-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 border-[#A9A9A9] focus:border-[#0057B7] rounded-full"
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
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-[#0057B7] p-6 text-white">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-white/20 p-2"
            onClick={onBack}
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold">Messages</h1>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#708090] w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#A9A9A9] focus:border-[#0057B7] rounded-xl"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-4 space-y-2">
        {conversations.map((conversation) => (
          <Card 
            key={conversation.id} 
            className="p-4 bg-white shadow-sm border border-[#A9A9A9]/30 rounded-xl cursor-pointer hover:bg-[#D2B48C]/10 transition-colors"
            onClick={() => setSelectedChat(conversation)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-[#D2B48C]/20 rounded-full flex items-center justify-center text-xl">
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#333333]">{conversation.name}</h3>
                  <p className="text-sm text-[#708090] truncate">{conversation.lastMessage}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <span className="text-xs text-[#708090]">{conversation.timestamp}</span>
                {conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-[#0057B7] rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{conversation.unread}</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MessagesScreen;
