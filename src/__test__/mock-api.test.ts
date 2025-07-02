import { apiCall } from '../core/api';
import { mockApiResponses, mockClasses, mockCalendars, mockAppointmentTypes } from '../mock/mock-data';
import { enableMockMode, disableMockMode, isMockMode } from '../mock/mock-utils';
import { ApiClass, ApiCalendar, ApiAppointmentType } from '../types';

// Mock console.info to avoid noise in tests
const originalConsoleInfo = console.info;

beforeAll(() => {
  console.info = jest.fn();
});

afterAll(() => {
  console.info = originalConsoleInfo;
});

describe('Mock API functionality', () => {
  beforeEach(() => {
    // Reset mock mode state
    (window as any).__MOCK_MODE__ = undefined;
  });

  test('should return mock classes data', async () => {
    enableMockMode();
    
    const classes = await apiCall<ApiClass[]>('/availability/classes');
    
    expect(Array.isArray(classes)).toBe(true);
    expect(classes.length).toBeGreaterThan(0);
    
    // Check if returned data matches expected structure
    classes.forEach((classItem: ApiClass) => {
      expect(classItem).toHaveProperty('time');
      expect(classItem).toHaveProperty('name');
      expect(classItem).toHaveProperty('description');
      expect(classItem).toHaveProperty('duration');
      expect(classItem).toHaveProperty('appointmentTypeID');
      expect(classItem).toHaveProperty('calendarID');
      expect(typeof classItem.time).toBe('string');
      expect(typeof classItem.name).toBe('string');
      expect(typeof classItem.duration).toBe('number');
    });
  });

  test('should return mock calendars data', async () => {
    enableMockMode();
    
    const calendars = await apiCall<ApiCalendar[]>('/calendars');
    
    expect(Array.isArray(calendars)).toBe(true);
    expect(calendars.length).toBe(3);
    
    calendars.forEach((calendar: ApiCalendar) => {
      expect(calendar).toHaveProperty('id');
      expect(calendar).toHaveProperty('name');
      expect(typeof calendar.id).toBe('number');
      expect(typeof calendar.name).toBe('string');
    });
  });

  test('should return mock appointment types data', async () => {
    enableMockMode();
    
    const appointmentTypes = await apiCall<ApiAppointmentType[]>('/appointment-types');
    
    expect(Array.isArray(appointmentTypes)).toBe(true);
    expect(appointmentTypes.length).toBe(3);
    
    appointmentTypes.forEach((type: ApiAppointmentType) => {
      expect(type).toHaveProperty('id');
      expect(type).toHaveProperty('name');
      expect(type).toHaveProperty('color');
      expect(typeof type.id).toBe('number');
      expect(typeof type.name).toBe('string');
      expect(typeof type.color).toBe('string');
    });
  });

  test('should throw error for unknown endpoint in mock mode', async () => {
    enableMockMode();
    
    await expect(apiCall('/unknown-endpoint')).rejects.toThrow(
      'Mock data not available for endpoint: /unknown-endpoint'
    );
  });

  test('should respect development mode for mock enablement', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    
    // Test development mode
    process.env.NODE_ENV = 'development';
    expect(isMockMode()).toBe(true);
    
    // Test production mode
    process.env.NODE_ENV = 'production';
    expect(isMockMode()).toBe(false);
    
    // Restore original environment
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('should simulate network delay in mock mode', async () => {
    enableMockMode();
    
    const startTime = Date.now();
    await apiCall<ApiClass[]>('/availability/classes');
    const endTime = Date.now();
    
    const duration = endTime - startTime;
    // Should take at least 300ms due to simulated delay
    expect(duration).toBeGreaterThanOrEqual(250); // Allow some margin for test execution
  });

  test('mock data should be consistent and valid', () => {
    // Check that classes reference valid calendar IDs
    const calendarIds = mockCalendars.map((cal: ApiCalendar) => cal.id);
    mockClasses.forEach((classItem: ApiClass) => {
      expect(calendarIds).toContain(classItem.calendarID);
    });
    
    // Check that classes reference valid appointment type IDs  
    const appointmentTypeIds = mockAppointmentTypes.map((type: ApiAppointmentType) => type.id);
    mockClasses.forEach((classItem: ApiClass) => {
      expect(appointmentTypeIds).toContain(classItem.appointmentTypeID);
    });
    
    // Check that times are valid ISO strings
    mockClasses.forEach((classItem: ApiClass) => {
      expect(() => new Date(classItem.time)).not.toThrow();
      expect(new Date(classItem.time).toISOString()).toBe(classItem.time);
    });
  });
}); 