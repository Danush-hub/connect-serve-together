
// Mock event service for demonstration

export interface Event {
  id: string;
  title: string;
  description: string;
  organizationId: string;
  organizationName: string;
  date: string;
  location: string;
  imageUrl: string;
  category: string;
  volunteersNeeded: number;
  volunteersRegistered: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

// Mock events database
const mockEvents: Event[] = [
  {
    id: 'event-1',
    title: 'Beach Cleanup Drive',
    description: 'Join us for a day of cleaning the shoreline and protecting marine life. Gloves and bags will be provided.',
    organizationId: 'org-1',
    organizationName: 'EcoFriends',
    date: '2025-05-15T09:00:00',
    location: 'Sunset Beach, CA',
    imageUrl: 'https://images.unsplash.com/photo-1618477462146-817de7cfe8c9?q=80&w=1000',
    category: 'environment',
    volunteersNeeded: 50,
    volunteersRegistered: ['user-1', 'user-2'],
    status: 'upcoming',
  },
  {
    id: 'event-2',
    title: 'Food Bank Assistant',
    description: 'Help us sort donations and prepare food packages for distribution to families in need.',
    organizationId: 'org-2',
    organizationName: 'Community Helpers',
    date: '2025-05-20T14:00:00',
    location: 'Downtown Community Center',
    imageUrl: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?q=80&w=1000',
    category: 'community',
    volunteersNeeded: 20,
    volunteersRegistered: ['user-3'],
    status: 'upcoming',
  },
  {
    id: 'event-3',
    title: 'Tech Workshop for Seniors',
    description: 'Teach basic technology skills to seniors in our community. Help them connect with family online.',
    organizationId: 'org-3',
    organizationName: 'Silver Tech',
    date: '2025-05-22T10:00:00',
    location: 'Senior Living Community',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?q=80&w=1000',
    category: 'education',
    volunteersNeeded: 10,
    volunteersRegistered: ['user-1', 'user-4'],
    status: 'upcoming',
  },
  {
    id: 'event-4',
    title: 'Park Restoration Project',
    description: 'Help us plant trees and restore the natural habitat in our city park.',
    organizationId: 'org-1',
    organizationName: 'EcoFriends',
    date: '2025-06-01T08:00:00',
    location: 'Central Park',
    imageUrl: 'https://images.unsplash.com/photo-1561370658-326595df2e83?q=80&w=1000',
    category: 'environment',
    volunteersNeeded: 30,
    volunteersRegistered: [],
    status: 'upcoming',
  },
  {
    id: 'event-5',
    title: 'After-School Tutoring',
    description: 'Provide academic support to elementary school students in math and reading.',
    organizationId: 'org-4',
    organizationName: 'Education For All',
    date: '2025-06-05T15:30:00',
    location: 'Lincoln Elementary School',
    imageUrl: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?q=80&w=1000',
    category: 'education',
    volunteersNeeded: 15,
    volunteersRegistered: ['user-2'],
    status: 'upcoming',
  },
];

// Get all events
export const getAllEvents = () => {
  return Promise.resolve([...mockEvents]);
};

// Get events by organization
export const getEventsByOrganization = (organizationId: string) => {
  const filteredEvents = mockEvents.filter(event => event.organizationId === organizationId);
  return Promise.resolve([...filteredEvents]);
};

// Get events that a volunteer is registered for
export const getVolunteerEvents = (volunteerId: string) => {
  const filteredEvents = mockEvents.filter(
    event => event.volunteersRegistered.includes(volunteerId)
  );
  return Promise.resolve([...filteredEvents]);
};

// Create a new event
export const createEvent = (eventData: Omit<Event, 'id' | 'volunteersRegistered' | 'status'>) => {
  const newEvent: Event = {
    ...eventData,
    id: `event-${Date.now()}`,
    volunteersRegistered: [],
    status: 'upcoming'
  };
  
  // In a real app, this would be an API call to save the event
  mockEvents.push(newEvent);
  return Promise.resolve(newEvent);
};

// Register for an event
export const registerForEvent = (eventId: string, volunteerId: string) => {
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) {
    return Promise.reject(new Error('Event not found'));
  }
  
  if (event.volunteersRegistered.includes(volunteerId)) {
    return Promise.reject(new Error('Already registered for this event'));
  }
  
  event.volunteersRegistered.push(volunteerId);
  return Promise.resolve(event);
};

// Unregister from an event
export const unregisterFromEvent = (eventId: string, volunteerId: string) => {
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) {
    return Promise.reject(new Error('Event not found'));
  }
  
  event.volunteersRegistered = event.volunteersRegistered.filter(id => id !== volunteerId);
  return Promise.resolve(event);
};

// Get event by ID
export const getEventById = (eventId: string) => {
  const event = mockEvents.find(e => e.id === eventId);
  if (!event) {
    return Promise.reject(new Error('Event not found'));
  }
  return Promise.resolve({...event});
};
