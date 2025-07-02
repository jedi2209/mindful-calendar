import { ApiClass, ApiCalendar, ApiAppointmentType } from '../types';

/**
 * Generate mock classes for the next 7 days
 */
const generateMockClasses = (): ApiClass[] => {
  const classes: ApiClass[] = [];
  const today = new Date();
  
  // Predefined class templates
  const classTemplates = [
    {
      name: 'Morning Meditation',
      description: 'Start your day with mindfulness and inner peace',
      duration: 60,
      appointmentTypeID: 1,
      calendarID: 8874199,
      preferredTimes: ['09:00', '08:30', '09:30'],
    },
    {
      name: 'Hatha Yoga for Beginners',
      description: 'Gentle practice for learning basic poses',
      duration: 90,
      appointmentTypeID: 2,
      calendarID: 9175210,
      preferredTimes: ['10:30', '11:00', '16:00'],
    },
    {
      name: 'Vinyasa Flow',
      description: 'Dynamic practice with focus on breath',
      duration: 75,
      appointmentTypeID: 2,
      calendarID: 9684621,
      preferredTimes: ['14:00', '17:30', '19:00'],
    },
    {
      name: 'Evening Meditation',
      description: 'Relaxation and preparation for sleep',
      duration: 45,
      appointmentTypeID: 1,
      calendarID: 8874199,
      preferredTimes: ['18:00', '19:30', '20:00'],
    },
    {
      name: 'Pranayama - Breathing Practice',
      description: 'Master breathing techniques for body and mind harmony',
      duration: 60,
      appointmentTypeID: 3,
      calendarID: 9175210,
      preferredTimes: ['08:00', '12:00', '15:30'],
    },
    {
      name: 'Power Yoga',
      description: 'Strengthening practice for building power and endurance',
      duration: 90,
      appointmentTypeID: 2,
      calendarID: 9684621,
      preferredTimes: ['10:00', '18:30'],
    },
    {
      name: 'Yoga Nidra',
      description: 'Deep relaxation and restoration practice',
      duration: 60,
      appointmentTypeID: 1,
      calendarID: 8874199,
      preferredTimes: ['13:00', '20:30'],
    },
    {
      name: 'Yin Yoga',
      description: 'Meditative practice with long-held poses',
      duration: 75,
      appointmentTypeID: 2,
      calendarID: 9175210,
      preferredTimes: ['16:30', '19:00'],
    },
  ];

  // Generate classes for the next 7 days
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + dayOffset);
    
    // Different schedule for weekends
    const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
    const classesPerDay = isWeekend ? 3 : 4; // Fewer classes on weekends
    
    // Select random classes for this day
    const shuffledTemplates = [...classTemplates].sort(() => Math.random() - 0.5);
    const selectedTemplates = shuffledTemplates.slice(0, classesPerDay);
    
    selectedTemplates.forEach((template, index) => {
      const timeSlot = template.preferredTimes[index % template.preferredTimes.length];
      const classDateTime = new Date(currentDate);
      const [hours, minutes] = timeSlot.split(':').map(Number);
      classDateTime.setHours(hours, minutes, 0, 0);
      
      classes.push({
        ...template,
        time: classDateTime.toISOString(),
      });
    });
  }
  
  return classes.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};

/**
 * Mock data for /availability/classes endpoint
 */
export const mockClasses: ApiClass[] = generateMockClasses();

/**
 * Mock data for /calendars endpoint
 */
export const mockCalendars: ApiCalendar[] = [
  {
    id: 8874199,
    name: 'Anna',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 9175210,
    name: 'Sarah',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 9684621,
    name: 'Olga Stas-Belovidova',
    image: 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?w=400&h=400&fit=crop&crop=face',
  },
];

/**
 * Mock data for /appointment-types endpoint
 */
export const mockAppointmentTypes: ApiAppointmentType[] = [
  {
    id: 1,
    name: 'Meditation',
    color: '#4A90E2',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    schedulingUrl: 'https://mindful-studio.com/book/meditation',
  },
  {
    id: 2,
    name: 'Yoga',
    color: '#7ED321',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
    schedulingUrl: 'https://mindful-studio.com/book/yoga',
  },
  {
    id: 3,
    name: 'Breathing Practices',
    color: '#F5A623',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    schedulingUrl: 'https://mindful-studio.com/book/breathing',
  },
];

/**
 * Mock API responses mapping
 */
export const mockApiResponses = {
  '/availability/classes': mockClasses,
  '/calendars': mockCalendars,
  '/appointment-types': mockAppointmentTypes,
}; 