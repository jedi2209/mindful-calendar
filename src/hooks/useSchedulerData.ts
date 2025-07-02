import { useState, useCallback, useEffect } from 'react';
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

  const eventsLoading = useCallback(async (): Promise<void> => {
    setLoadingText('loading events...');
    const fetchedEvents = await getEvents();
    
    let currentResources = [...resources];
    const teachersInited = checkObjectKey(currentResources, 'teachers');
    const appointmentTypesInited = checkObjectKey(currentResources, 'appointmentType');
    let appointmentTypesTmp: AppointmentType[] | null = null;
    
    if (!get(appointmentTypesInited, 'length')) {
      setLoadingText('loading appointments...');
      appointmentTypesTmp = await getAppointmentTypes();
      currentResources.push({
        fieldName: 'appointmentType',
        title: 'Appointment Type',
        instances: appointmentTypesTmp,
        allowMultiple: false,
      });
    }
    
    if (!get(teachersInited, 'length')) {
      setLoadingText('loading teachers...');
      const teachers = await getTeachers();
      currentResources.push({
        fieldName: 'teachers',
        title: 'Teachers',
        instances: teachers,
        allowMultiple: true,
      });
    }
    
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
      
      if (hourFirst !== startHour) {
        setStartHour(hourFirst);
      }
      if (hourLast !== lastHour) {
        setLastHour(hourLast);
      }
      
      setEvents(extendedEvents);
      setLoadingText(null);
    }
    
    if (nearestDateNext) {
      setCurrentDate(moment(get(fetchedEvents, '0.startDate')).toDate());
    }
  }, [startHour, lastHour, resources]);

  useEffect(() => {
    if (!get(events, 'length')) {
      eventsLoading();
    }
  }, [events, eventsLoading]);

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