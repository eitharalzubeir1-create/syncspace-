// University of Doha for Science and Technology (UDST) Campus Data
export interface Building {
  id: string;
  name: string;
  code: string;
  floors: number;
  x: number; // Position on campus map (percentage)
  y: number;
  color: string;
  description: string;
  floors_info?: { [key: number]: string[] };
}

export interface Room {
  id: string;
  number: string;
  building_code: string;
  floor: number;
  name?: string;
  type: 'classroom' | 'lab' | 'office' | 'study' | 'common' | 'service';
  capacity?: number;
}

export interface CampusLocation {
  id: string;
  name: string;
  type: 'building' | 'service' | 'dining' | 'recreation' | 'parking';
  x: number;
  y: number;
  icon: string;
  description: string;
}

// UDST Buildings data based on the campus map
export const campusBuildings: Building[] = [
  // Main Academic Buildings
  { id: '01', name: 'Auditorium & Lecture Theatres', code: '01', floors: 2, x: 20, y: 75, color: '#3b82f6', description: 'Main auditorium and lecture halls' },
  { id: '02', name: 'VIP Lounge', code: '02', floors: 1, x: 15, y: 85, color: '#8b5cf6', description: 'VIP guest facilities' },
  { id: '03', name: 'Administrative Affairs', code: '03', floors: 2, x: 25, y: 85, color: '#6366f1', description: 'University administration' },
  { id: '04', name: 'U-Hub', code: '04', floors: 1, x: 35, y: 85, color: '#a855f7', description: 'Student hub and services' },
  { id: '05', name: 'College of General Education', code: '05', floors: 3, x: 45, y: 75, color: '#8b5cf6', description: 'General education programs' },
  { id: '06', name: 'Student Services Center', code: '06', floors: 2, x: 15, y: 65, color: '#22c55e', description: 'Student counselling and campus clinic' },
  { id: '07', name: 'Faculty Offices', code: '07', floors: 3, x: 35, y: 65, color: '#3b82f6', description: 'Faculty administrative offices' },
  { id: '08', name: 'Engineering & Technology Building A', code: '08', floors: 4, x: 55, y: 65, color: '#f97316', description: 'College of Engineering & Technology' },
  { id: '09', name: 'Engineering & Technology Building B', code: '09', floors: 4, x: 25, y: 55, color: '#f97316', description: 'College of Engineering & Technology' },
  { id: '10', name: 'College of Computing & IT', code: '10', floors: 5, x: 15, y: 45, color: '#eab308', description: 'Computing and Information Technology' },
  { id: '11', name: 'Faculty Offices Block', code: '11', floors: 3, x: 25, y: 45, color: '#06b6d4', description: 'Additional faculty offices' },
  { id: '12', name: 'College of Business', code: '12', floors: 4, x: 35, y: 45, color: '#06b6d4', description: 'Business programs and MBA' },
  { id: '13', name: 'Mixed Cafeteria', code: '13', floors: 2, x: 45, y: 45, color: '#84cc16', description: 'Main dining facilities' },
  { id: '14', name: 'Student Central Services', code: '14', floors: 2, x: 55, y: 45, color: '#8b4513', description: 'Student registration and services' },
  { id: '16', name: 'Club Hub', code: '16', floors: 2, x: 65, y: 45, color: '#3b82f6', description: 'Student clubs and activities' },
  { id: '17', name: 'Sports & Wellness (Female)', code: '17', floors: 2, x: 45, y: 35, color: '#84cc16', description: 'Female sports facilities' },
  { id: '18', name: 'Sports & Wellness (Male)', code: '18', floors: 2, x: 55, y: 35, color: '#8b4513', description: 'Male sports facilities' },
  { id: '19', name: 'College of Health Sciences A', code: '19', floors: 4, x: 15, y: 35, color: '#84cc16', description: 'Health sciences programs' },
  { id: '20', name: 'College of Health Sciences B', code: '20', floors: 4, x: 25, y: 35, color: '#84cc16', description: 'Health sciences programs' },
  { id: '22', name: 'Multipurpose Sports Hall', code: '22', floors: 2, x: 35, y: 35, color: '#8b4513', description: 'Indoor sports complex' },
  { id: '33', name: 'Professional Skills Center', code: '33', floors: 2, x: 15, y: 25, color: '#f97316', description: 'Professional development center' },
  
  // Sports Facilities
  { id: 'e5', name: 'Tennis Court', code: 'E5', floors: 1, x: 75, y: 55, color: '#22c55e', description: 'Tennis court facility' },
  { id: 'e6', name: 'Sports Field', code: 'E6', floors: 1, x: 75, y: 45, color: '#22c55e', description: 'Multi-purpose sports field' },
  { id: 'e17', name: 'Running Track/Football', code: 'E17', floors: 1, x: 65, y: 25, color: '#22c55e', description: 'Athletics track and football field' },
  { id: 'e18', name: 'Cricket Field', code: 'E18', floors: 1, x: 75, y: 15, color: '#22c55e', description: 'Cricket playing field' },
  { id: 'e19', name: 'Practice Cages', code: 'E19', floors: 1, x: 55, y: 15, color: '#22c55e', description: 'Sports practice facilities' },
  { id: 'e20', name: 'Paddle Courts', code: 'E20', floors: 1, x: 45, y: 15, color: '#22c55e', description: 'Paddle tennis courts' },
  { id: 'e21', name: 'Beach Volleyball Court', code: 'E21', floors: 1, x: 85, y: 15, color: '#22c55e', description: 'Beach volleyball facility' }
];

// Common room types for UDST
export const roomTypes = {
  classroom: { icon: '🎓', color: '#3b82f6' },
  lab: { icon: '🔬', color: '#8b5cf6' },
  office: { icon: '🏢', color: '#6b7280' },
  study: { icon: '📚', color: '#059669' },
  common: { icon: '☕', color: '#f59e0b' },
  service: { icon: '🔧', color: '#ef4444' }
};

// Sample room data for major buildings
export const campusRooms: Room[] = [
  // College of Engineering & Technology
  { id: '08-101', number: '08-101', building_code: '08', floor: 1, name: 'Engineering Lab 1', type: 'lab', capacity: 35 },
  { id: '08-205', number: '08-205', building_code: '08', floor: 2, name: 'Lecture Hall A', type: 'classroom', capacity: 100 },
  { id: '09-103', number: '09-103', building_code: '09', floor: 1, name: 'Design Studio', type: 'lab', capacity: 25 },
  
  // College of Computing & IT
  { id: '10-101', number: '10-101', building_code: '10', floor: 1, name: 'Computer Lab 1', type: 'lab', capacity: 40 },
  { id: '10-301', number: '10-301', building_code: '10', floor: 3, name: 'Server Room', type: 'lab', capacity: 10 },
  { id: '10-205', number: '10-205', building_code: '10', floor: 2, name: 'Programming Lab', type: 'lab', capacity: 30 },
  
  // College of Business
  { id: '12-150', number: '12-150', building_code: '12', floor: 1, name: 'Business Lecture Hall', type: 'classroom', capacity: 120 },
  { id: '12-220', number: '12-220', building_code: '12', floor: 2, name: 'Seminar Room', type: 'classroom', capacity: 40 },
  
  // Auditorium & Lecture Theatres
  { id: '01-main', number: '01-MAIN', building_code: '01', floor: 1, name: 'Main Auditorium', type: 'classroom', capacity: 500 },
  { id: '01-102', number: '01-102', building_code: '01', floor: 1, name: 'Lecture Theatre 1', type: 'classroom', capacity: 200 },
  
  // College of Health Sciences
  { id: '19-101', number: '19-101', building_code: '19', floor: 1, name: 'Anatomy Lab', type: 'lab', capacity: 30 },
  { id: '20-201', number: '20-201', building_code: '20', floor: 2, name: 'Nursing Skills Lab', type: 'lab', capacity: 25 }
];

// Popular campus locations and services
export const campusLocations: CampusLocation[] = [
  { id: 'coffee-shop', name: 'Coffee Shop', type: 'dining', x: 85, y: 85, icon: '☕', description: 'Campus coffee and snacks' },
  { id: 'mixed-cafeteria', name: 'Mixed Cafeteria', type: 'dining', x: 45, y: 45, icon: '🍽️', description: 'Main dining hall with various options' },
  { id: 'campus-clinic', name: 'Campus Clinic', type: 'service', x: 15, y: 65, icon: '🏥', description: 'Student health services' },
  { id: 'bookstore', name: 'Campus Store', type: 'service', x: 55, y: 45, icon: '📚', description: 'Textbooks and UDST merchandise' },
  { id: 'parking-c1', name: 'C1-C12 Parking', type: 'parking', x: 85, y: 70, icon: '🅿️', description: 'Main campus parking area' },
  { id: 'student-services', name: 'Student Central Services', type: 'service', x: 55, y: 45, icon: '🏢', description: 'Student registration and administrative services' },
  { id: 'club-hub', name: 'Club Hub', type: 'recreation', x: 65, y: 45, icon: '🎯', description: 'Student clubs and activities center' }
];

// Street names for navigation context (UDST Campus)
export const campusStreets = [
  'UDST Main Entrance', 'Academic Boulevard', 'Sports Complex Road', 'Residential Area',
  'Administrative Wing', 'Engineering Quarter', 'Health Sciences Avenue', 'Business District'
];

// Sample friend locations for demo
export const sampleFriendLocations = [
  { id: 1, name: 'Ahmed Al-Rashid', avatar: '👨🏽‍💻', building: '10', floor: 2, room: '10-205', x: 15, y: 45, status: 'In Lab', lastSeen: '3 min ago' },
  { id: 2, name: 'Fatima Hassan', avatar: '👩🏻‍🎓', building: '12', floor: 1, room: '12-150', x: 35, y: 45, status: 'In Class', lastSeen: '1 min ago' },
  { id: 3, name: 'Omar Khalil', avatar: '👨🏻‍🏫', building: '08', floor: 2, room: '08-205', x: 55, y: 65, status: 'In Lecture', lastSeen: '5 min ago' },
  { id: 4, name: 'Layla Mansour', avatar: '👩🏽‍💼', building: '19', floor: 1, room: '19-101', x: 15, y: 35, status: 'Available', lastSeen: 'Just now' },
  { id: 5, name: 'Youssef Ali', avatar: '👨🏻‍🎨', building: '01', floor: 1, room: '01-102', x: 20, y: 75, status: 'In Meeting', lastSeen: '8 min ago' }
];