import { Event, AppointmentType, Teacher } from './index';

export interface Resource {
  fieldName: string;
  title: string;
  instances: Teacher[] | AppointmentType[];
  allowMultiple: boolean;
}

export interface ExtendedEvent extends Event {
  appointmentData?: AppointmentType;
}

export interface SchedulerState {
  events: ExtendedEvent[];
  currentDate: Date;
  isMobile: boolean;
  startHour: number;
  lastHour: number;
  loadingText: string | null;
  resources: Resource[];
} 