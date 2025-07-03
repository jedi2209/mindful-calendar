import { get } from 'lodash';
import moment from 'moment';
import { apiCall } from './core/api';
import { getCache, setCache } from './core/cache';
import { colors } from './core/const';
import { 
  ApiClass, 
  ApiCalendar, 
  ApiAppointmentType, 
  Teacher, 
  AppointmentType, 
  Event, 
  EventOld,
  TeacherLinks 
} from './types';

/**
 * Object containing links to teacher timetables.
 */
const teacherLinks: TeacherLinks = {
  8874199: 'https://mindful-studio.com/timetable/anna',
  9175210: 'https://mindful-studio.com/timetable/sara',
  9684621: 'https://mindful-studio.com/timetable/olgastas-belovidov',
};

/**
 * Retrieves events from the API and transforms them into a standardized format.
 * @returns An array of events.
 */
const getEventsOld = async (): Promise<EventOld[]> => {
  const classes = await apiCall<ApiClass[]>('/availability/classes');
  if (get(classes, 'length', 0) > 0) {
    let eventsTmp: EventOld[] = [];
    classes.forEach((el, indx) => {
      const date = moment(get(el, 'time'));
      eventsTmp.push({
        id: indx,
        title: get(el, 'name', ''),
        description: get(el, 'description', ''),
        start: date.toDate(),
        end: date.add(get(el, 'duration', 60), 'minutes').toDate(),
        originalData: el,
      });
    });
    return eventsTmp;
  }
  return [];
};

/**
 * Retrieves the list of teachers from the API.
 * @returns The list of teachers.
 */
const getTeachers = async (): Promise<Teacher[]> => {
  const CACHE_KEY = 'teachersCache';
  const cachedEvents = getCache<Teacher[]>(CACHE_KEY);
  if (cachedEvents) {
    return cachedEvents;
  }

  const calendars = await apiCall<ApiCalendar[]>('/calendars');
  console.info('calendars', calendars);
  if (get(calendars, 'length', 0) > 0) {
    let calendarsTmp: Teacher[] = [];
    calendars.forEach(el => {
      const id = get(el, 'id');
      calendarsTmp.push({
        id: id,
        name: get(el, 'name', ''),
        text: get(el, 'name', ''),
        img: get(el, 'image'),
        link: teacherLinks[id],
        color: colors[id],
      });
    });

    // Update cache
    if (process.env.NODE_ENV === 'production') {
      setCache(CACHE_KEY, calendarsTmp);
    }

    return calendarsTmp;
  }
  return [];
};

/**
 * Retrieves the appointment types from the API.
 * @returns The array of appointment types.
 */
const getAppointmentTypes = async (): Promise<AppointmentType[]> => {
  const types = await apiCall<ApiAppointmentType[]>('/appointment-types');
  if (get(types, 'length', 0) > 0) {
    let typesTmp: AppointmentType[] = [];
    types.forEach(el => {
      typesTmp.push({
        id: get(el, 'id'),
        name: get(el, 'name', ''),
        text: get(el, 'name', ''),
        color: get(el, 'color', ''),
        img: get(el, 'image'),
        link: get(el, 'schedulingUrl'),
      });
    });
    return typesTmp;
  }
  return [];
};

/**
 * Retrieves events from the API and transforms them into a standardized format.
 * @returns An array of events in the standardized format.
 */
const getEvents = async (): Promise<Event[]> => {
  const CACHE_KEY = 'eventsCache';
  const cachedEvents = getCache<Event[]>(CACHE_KEY);
  if (cachedEvents) {
    return cachedEvents;
  }

  const classes = await apiCall<ApiClass[]>('/availability/classes');
  console.info('classes', classes);
  if (get(classes, 'length', 0) > 0) {
    let eventsTmp: Event[] = [];
    classes.forEach((el, indx) => {
      const date = moment(get(el, 'time'));
      eventsTmp.push({
        id: indx,
        title: get(el, 'name', ''),
        startDate: date.toDate(),
        endDate: date.add(get(el, 'duration', 60), 'minutes').toDate(),
        location: 'Main Room',
        appointmentType: get(el, 'appointmentTypeID'),
        teachers: [get(el, 'calendarID')],
        originalData: el,
      });
    });

    // Update cache
    if (process.env.NODE_ENV !== 'development') {
      setCache(CACHE_KEY, eventsTmp);
    }

    return eventsTmp;
  }

  return [];
};

export { getTeachers, getEventsOld, getAppointmentTypes, getEvents }; 