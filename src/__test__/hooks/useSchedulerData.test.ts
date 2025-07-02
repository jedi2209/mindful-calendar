import { renderHook, waitFor } from '@testing-library/react';
import { useSchedulerData } from '../../hooks/useSchedulerData';
import * as Events from '../../Events';
import { enableMockMode, disableMockMode } from '../../mock/mock-utils';

// Mock the Events module
jest.mock('../../Events');
const mockEvents = Events as jest.Mocked<typeof Events>;

// Mock console.info to avoid noise in tests
const originalConsoleInfo = console.info;

beforeAll(() => {
  console.info = jest.fn();
});

afterAll(() => {
  console.info = originalConsoleInfo;
});

describe('useSchedulerData', () => {
  beforeEach(() => {
    enableMockMode();
    jest.clearAllMocks();
    
    // Set up default mocks
    mockEvents.getEvents.mockResolvedValue([
      {
        id: 1,
        title: 'Test Event',
        startDate: new Date('2024-01-15T10:00:00'),
        endDate: new Date('2024-01-15T11:00:00'),
        location: 'Main Room',
        appointmentType: 1,
        teachers: [1],
        originalData: {} as any,
      }
    ]);
    
    mockEvents.getAppointmentTypes.mockResolvedValue([
      {
        id: 1,
        name: 'Yoga',
        text: 'Yoga',
        color: '#FF0000',
        img: '',
        link: '',
      }
    ]);
    
    mockEvents.getTeachers.mockResolvedValue([
      {
        id: 1,
        name: 'John Doe',
        text: 'John Doe',
        img: '',
        link: '',
        color: '#00FF00',
      }
    ]);
  });

  afterEach(() => {
    disableMockMode();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useSchedulerData());
    
    expect(result.current.events).toEqual([]);
    expect(result.current.resources).toEqual([]);
    expect(result.current.loadingText).toBe('loading events...');
    expect(result.current.currentDate).toBeInstanceOf(Date);
  });

  test('should load events and set loading states correctly', async () => {
    const { result } = renderHook(() => useSchedulerData());
    
    // Initially loading
    expect(result.current.loadingText).toBe('loading events...');
    
    // Wait for events to load
    await waitFor(() => {
      expect(result.current.events.length).toBeGreaterThan(0);
    });
    
    // Loading should be complete
    expect(result.current.loadingText).toBeNull();
    expect(mockEvents.getEvents).toHaveBeenCalled();
    expect(mockEvents.getAppointmentTypes).toHaveBeenCalled();
    expect(mockEvents.getTeachers).toHaveBeenCalled();
  });

  test('should set resources correctly', async () => {
    const { result } = renderHook(() => useSchedulerData());
    
    await waitFor(() => {
      expect(result.current.resources.length).toBeGreaterThan(0);
    });
    
    expect(result.current.resources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fieldName: 'appointmentType',
          title: 'Appointment Type',
        }),
        expect.objectContaining({
          fieldName: 'teachers',
          title: 'Teachers',
        }),
      ])
    );
  });

}); 