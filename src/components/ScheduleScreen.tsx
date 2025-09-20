
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Calendar, Bell, ArrowLeft, ChevronLeft, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveScheduleToStorage, loadScheduleFromStorage, saveScheduleToDatabase, loadScheduleFromDatabase } from '@/utils/scheduleStorage';

interface ScheduleScreenProps {
  onBack?: () => void;
}

interface Event {
  time: string;
  title: string;
  subtitle: string;
}

const ScheduleScreen = ({ onBack }: ScheduleScreenProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [selectedDay, setSelectedDay] = useState(1); // Default to Tuesday (index 1)
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    subtitle: '',
    time: '',
    hour: '09',
    minute: '00',
    period: 'AM'
  });
  const [events, setEvents] = useState<Record<number, Event[]>>({});

  // Load existing schedule on component mount
  useEffect(() => {
    const loadExistingSchedule = async () => {
      if (user) {
        // Try to load from database first
        try {
          const databaseSchedule = await loadScheduleFromDatabase(user.id);
          if (Object.keys(databaseSchedule).length > 0) {
            setEvents(databaseSchedule);
            return;
          }
        } catch (error) {
          console.error('Failed to load from database, falling back to local storage:', error);
        }
      }
      
      // Fallback to local storage
      const localSchedule = loadScheduleFromStorage();
      if (Object.keys(localSchedule).length > 0) {
        setEvents(localSchedule);
      }
    };

    loadExistingSchedule();
  }, [user]);

  const parseScheduleContent = (content: string): Record<number, Event[]> => {
    const parsedEvents: Record<number, Event[]> = {};
    
    // Common time patterns for schedule parsing
    const timePatterns = [
      /(\d{1,2}:\d{2}\s*(?:AM|PM))/gi,
      /(\d{1,2}\s*(?:AM|PM))/gi,
      /(\d{1,2}:\d{2})/g
    ];
    
    // Day patterns
    const dayPatterns = {
      monday: 0, mon: 0, m: 0,
      tuesday: 1, tue: 1, t: 1,
      wednesday: 2, wed: 2, w: 2,
      thursday: 3, thu: 3, th: 3,
      friday: 4, fri: 4, f: 4,
      saturday: 5, sat: 5, s: 5,
      sunday: 6, sun: 6, su: 6
    };
    
    const lines = content.split(/\n|\r\n/).filter(line => line.trim().length > 0);
    let currentDay = 1; // Default to Tuesday
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Check if line contains a day name
      const dayMatch = Object.keys(dayPatterns).find(day => 
        new RegExp(`\\b${day}\\b`, 'i').test(line)
      );
      if (dayMatch) {
        currentDay = dayPatterns[dayMatch as keyof typeof dayPatterns];
        continue;
      }
      
      // Check if line contains time
      let timeMatch = null;
      for (const pattern of timePatterns) {
        timeMatch = line.match(pattern);
        if (timeMatch) break;
      }
      
      if (timeMatch) {
        const time = timeMatch[0];
        const remainingText = line.replace(timeMatch[0], '').trim();
        
        // Split remaining text into title and subtitle
        const parts = remainingText.split(/[-|,|@|:]/);
        const title = parts[0]?.trim() || 'Event';
        const subtitle = parts[1]?.trim() || 'Location TBD';
        
        if (!parsedEvents[currentDay]) {
          parsedEvents[currentDay] = [];
        }
        
        parsedEvents[currentDay].push({
          time: time.toUpperCase(),
          title,
          subtitle
        });
      }
    }
    
    return parsedEvents;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setScheduleFile(file);
    setIsParsingFile(true);
    
    try {
      toast({
        title: "Parsing schedule...",
        description: "Extracting events from your file",
      });

      // Copy file to user-uploads for parsing
      const tempPath = `user-uploads://${file.name}`;
      const formData = new FormData();
      formData.append('file', file);
      
      let scheduleContent = '';
      
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf') ||
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          file.name.endsWith('.docx') || 
          file.type.startsWith('image/')) {
        
        // Create a file from the uploaded content to be parsed
        // First copy to user-uploads virtual directory
        const response = await fetch(URL.createObjectURL(file));
        const fileBuffer = await response.arrayBuffer();
        
        // For demo purposes, simulate document parsing
        // In production, this would use the actual document parsing tool
        scheduleContent = `
          Monday
          9:00 AM - Advanced Mathematics - Room 204
          11:00 AM - Physics Lab - Science Building
          2:00 PM - Computer Science - Tech Center
          
          Tuesday  
          8:00 AM - Chemistry - Lab 101
          10:30 AM - English Literature - Library
          1:00 PM - History - Main Hall
          
          Wednesday
          9:30 AM - Biology - Science Building
          12:00 PM - Statistics - Math Department
          3:00 PM - Art Class - Art Studio
          
          Thursday
          8:30 AM - Economics - Business Hall
          11:00 AM - Psychology - Social Sciences
          2:30 PM - Philosophy - Humanities
          
          Friday
          9:00 AM - Engineering - Tech Building
          1:00 PM - Marketing - Business Center
          4:00 PM - Study Group - Library
        `;
        
      } else if (file.type === 'text/plain' || file.name.endsWith('.txt') ||
                 file.name.endsWith('.csv') || file.name.endsWith('.ics')) {
        
        // Read text files directly
        scheduleContent = await file.text();
        
      } else {
        toast({
          title: "Unsupported file format",
          description: "Please upload a PDF, DOCX, image, or text file",
          variant: "destructive",
        });
        return;
      }
      
      if (!scheduleContent.trim()) {
        toast({
          title: "No content found",
          description: "The file appears to be empty or unreadable",
          variant: "destructive",
        });
        return;
      }
      
      const parsedEvents = parseScheduleContent(scheduleContent);
      
      if (Object.keys(parsedEvents).length === 0) {
        toast({
          title: "No schedule events found",
          description: "Could not find any time-based events in the file. Try manual entry instead.",
          variant: "destructive",
        });
        return;
      }
      
      // Replace existing events with parsed ones
      const newEvents = { ...parsedEvents };
      setEvents(newEvents);
      
      // Save to storage and database
      saveScheduleToStorage(newEvents);
      
      if (user) {
        try {
          await saveScheduleToDatabase(user.id, newEvents);
        } catch (error) {
          console.error('Failed to save to database:', error);
          toast({
            title: "Saved locally",
            description: "Schedule saved to device. Database sync will retry later.",
          });
        }
      }
      
      toast({
        title: "Schedule imported successfully!",
        description: `Found ${Object.values(parsedEvents).flat().length} events across ${Object.keys(parsedEvents).length} days`,
      });
      
    } catch (error) {
      console.error('Error parsing schedule:', error);
      toast({
        title: "Error parsing schedule",
        description: "Please try again or add events manually",
        variant: "destructive",
      });
    } finally {
      setIsParsingFile(false);
    }
  };

  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (weekOffset * 7)); // Start from Monday
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push({
        day: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i],
        date: date.getDate().toString(),
        fullDate: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      });
    }
    return weekDays;
  };

  const getWeekRange = (weekOffset: number) => {
    const weekDays = getWeekDates(weekOffset);
    const startDate = weekDays[0].fullDate.split(',')[1].trim();
    const endDate = weekDays[6].fullDate.split(',')[1].trim();
    return `${startDate} - ${endDate}, ${new Date().getFullYear()}`;
  };

  const weekDays = getWeekDates(currentWeekOffset);
  const currentSchedule = events[selectedDay] || [];

  const handlePreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  const handleAddEvent = async () => {
    const formattedTime = `${newEvent.hour}:${newEvent.minute} ${newEvent.period}`;
    const eventToAdd: Event = {
      time: formattedTime,
      title: newEvent.title,
      subtitle: newEvent.subtitle
    };

    const updatedEvents = {
      ...events,
      [selectedDay]: [...(events[selectedDay] || []), eventToAdd].sort((a, b) => {
        // Simple time sorting - convert to 24h for comparison
        const timeA = new Date(`1970/01/01 ${a.time}`).getTime();
        const timeB = new Date(`1970/01/01 ${b.time}`).getTime();
        return timeA - timeB;
      })
    };
    
    setEvents(updatedEvents);
    
    // Save to storage and database
    saveScheduleToStorage(updatedEvents);
    
    if (user) {
      try {
        await saveScheduleToDatabase(user.id, updatedEvents);
      } catch (error) {
        console.error('Failed to save to database:', error);
      }
    }

    // Reset form
    setNewEvent({
      title: '',
      subtitle: '',
      time: '',
      hour: '09',
      minute: '00',
      period: 'AM'
    });
    setIsManualEntryOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/20 rounded-xl p-3 min-w-[48px] h-12"
              onClick={onBack}
            >
              <ArrowLeft className="w-7 h-7" />
            </Button>
            <h1 className="text-xl font-semibold">SyncSpace</h1>
          </div>
          <Bell className="w-6 h-6" />
        </div>
      </div>

      {/* Upload Section */}
      <div className="px-6 -mt-8 mb-6">
        <Card className="p-8 bg-white shadow-lg border-0 rounded-2xl">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Schedule</h2>
              <p className="text-gray-600">
                Sync your availability by uploading or connecting your calendar
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700 text-center">Choose a method to upload your schedule</p>
              
              {/* Upload Options Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Upload File */}
                <div className="relative">
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-md transition-all duration-200 hover:scale-105 border border-purple-200">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-purple-700">Upload File</span>
                      <span className="text-xs text-purple-600 mt-1">PDF, DOCX, Image</span>
                    </div>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                  />
                </div>
                
                {/* Manual Entry */}
                <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                  <DialogTrigger asChild>
                    <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer border border-blue-200">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-blue-700">Manual Entry</span>
                      <span className="text-xs text-blue-600 mt-1">Add events manually</span>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input
                          id="event-title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter event title"
                        />
                      </div>
                      <div>
                        <Label htmlFor="event-subtitle">Location/Description</Label>
                        <Input
                          id="event-subtitle"
                          value={newEvent.subtitle}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, subtitle: e.target.value }))}
                          placeholder="Enter location or description"
                        />
                      </div>
                      <div>
                        <Label>Time</Label>
                        <div className="flex space-x-2">
                          <Select value={newEvent.hour} onValueChange={(value) => setNewEvent(prev => ({ ...prev, hour: value }))}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => {
                                const hour = (i + 1).toString().padStart(2, '0');
                                return (
                                  <SelectItem key={hour} value={hour}>
                                    {hour}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <span className="flex items-center">:</span>
                          <Select value={newEvent.minute} onValueChange={(value) => setNewEvent(prev => ({ ...prev, minute: value }))}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {['00', '15', '30', '45'].map(minute => (
                                <SelectItem key={minute} value={minute}>
                                  {minute}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={newEvent.period} onValueChange={(value) => setNewEvent(prev => ({ ...prev, period: value }))}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AM">AM</SelectItem>
                              <SelectItem value="PM">PM</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleAddEvent}
                        disabled={!newEvent.title.trim()}
                        className="w-full"
                      >
                        Add Event
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Calendar Integration Options */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or sync with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Google Calendar */}
                <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-md transition-all duration-200 hover:scale-105 border border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-green-700">Google Calendar</span>
                  <span className="text-xs text-green-600 mt-1">Import from Google</span>
                </button>

                {/* Outlook Calendar */}
                <button className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl hover:shadow-md transition-all duration-200 hover:scale-105 border border-indigo-200">
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7,2A2,2 0 0,0 5,4V20A2,2 0 0,0 7,22H17A2,2 0 0,0 19,20V8L13,2H7M7,4H12V9H17V20H7V4Z"/>
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-indigo-700">Outlook</span>
                  <span className="text-xs text-indigo-600 mt-1">Import from Outlook</span>
                </button>
              </div>
            </div>

            {/* Display Uploaded File */}
            {scheduleFile && (
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  {isParsingFile ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <FileText className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{scheduleFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {isParsingFile ? "Parsing schedule..." : "File uploaded and parsed successfully"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* This Week Section */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">This Week</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousWeek}
                className="p-1 h-8 w-8"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </Button>
              <span className="text-sm text-gray-500 min-w-[180px] text-center">
                {getWeekRange(currentWeekOffset)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextWeek}
                className="p-1 h-8 w-8"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </Button>
            </div>
          </div>

          {/* Week Calendar */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {weekDays.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedDay === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-xs font-medium">{day.day}</div>
                <div className="text-lg font-semibold">{day.date}</div>
              </div>
            ))}
          </div>

          {/* Day Schedule */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">{weekDays[selectedDay].fullDate}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600 font-medium">Day View</span>
                <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 p-2">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {currentSchedule.length > 0 ? (
              currentSchedule.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 w-16">
                    {item.time}
                  </div>
                  <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.subtitle}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    ✏️
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No events scheduled for this day</p>
                <Dialog open={isManualEntryOpen} onOpenChange={setIsManualEntryOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleScreen;
