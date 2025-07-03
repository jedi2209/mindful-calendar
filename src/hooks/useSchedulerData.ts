import { useState, useCallback, useEffect, useRef } from 'react';
import moment from 'moment';
import { get } from 'lodash';
import { getTeachers, getAppointmentTypes, getEvents } from '../Events';
import { AppointmentType } from '../types';
import { ExtendedEvent, Resource } from '../types/scheduler';
import { checkObjectKey } from '../core/utils';
import { SCHEDULER_CONFIG } from '../core/scheduler-constants';

export const useSchedulerData = () => {
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [startHour, setStartHour] = useState<number>(SCHEDULER_CONFIG.DEFAULT_START_HOUR);
  const [lastHour, setLastHour] = useState<number>(SCHEDULER_CONFIG.DEFAULT_END_HOUR);
  const [loadingText, setLoadingText] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(moment().toDate());
  
  // Track loading state to prevent multiple concurrent API calls
  const isLoadingRef = useRef<boolean>(false);
  const hasLoadedRef = useRef<boolean>(false);

  const eventsLoading = useCallback(async (): Promise<void> => {
    // Prevent multiple concurrent API calls
    if (isLoadingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    setLoadingText('loading events...');
    
    try {
      const fetchedEvents = await getEvents();
      
      let currentResources: Resource[] = [];
      let appointmentTypesTmp: AppointmentType[] | null = null;
      
      setLoadingText('loading appointments...');
      appointmentTypesTmp = await getAppointmentTypes();
      currentResources.push({
        fieldName: 'appointmentType',
        title: 'Appointment Type',
        instances: appointmentTypesTmp,
        allowMultiple: false,
      });
      
      setLoadingText('loading teachers...');
      const teachers = await getTeachers();
      currentResources.push({
        fieldName: 'teachers',
        title: 'Teachers',
        instances: teachers,
        allowMultiple: true,
      });
      
      setResources(currentResources);
      
      const nearestDateNext = moment(get(fetchedEvents, '0.startDate')).isAfter(moment(), 'days');
      
      if (fetchedEvents && appointmentTypesTmp) {
        let hourFirst = startHour;
        let hourLast = lastHour;
        
        const extendedEvents: ExtendedEvent[] = fetchedEvents.map((el) => {
          const eventStartHour = parseInt(moment(el.startDate).format('H'));
          if (eventStartHour < hourFirst) {
            hourFirst = eventStartHour;
          }
          if (eventStartHour > hourLast) {
            hourLast = eventStartHour;
          }
          const appointmentDataTmp = appointmentTypesTmp!.find(es => es.id === el.appointmentType);
          return {
            ...el,
            appointmentData: appointmentDataTmp,
          };
        });
        
        // Only update hours if they actually changed
        if (hourFirst !== startHour) {
          setStartHour(hourFirst);
        }
        if (hourLast !== lastHour) {
          setLastHour(hourLast);
        }
        
        setEvents(extendedEvents);
        setLoadingText(null);
        hasLoadedRef.current = true;
      }
      
      if (nearestDateNext) {
        setCurrentDate(moment(get(fetchedEvents, '0.startDate')).toDate());
      }
    } catch (error) {
      console.error('Error loading scheduler data:', error);
      setLoadingText(null);
    } finally {
      isLoadingRef.current = false;
    }
  }, []); // Remove all dependencies to prevent re-creation

  useEffect(() => {
    // Only load if we haven't loaded yet and not currently loading
    if (!hasLoadedRef.current && !isLoadingRef.current) {
      eventsLoading();
    }
  }, []); // Empty dependency array - only run once on mount

  return {
    events,
    resources,
    startHour,
    lastHour,
    loadingText,
    currentDate,
    setCurrentDate,
  };
}; 