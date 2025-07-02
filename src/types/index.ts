// Core types
export interface WindowDimensions {
  width: number;
  height: number;
}

// API related types
export interface ApiClass {
  time: string;
  name: string;
  description: string;
  duration: number;
  appointmentTypeID: number;
  calendarID: number;
}

export interface ApiCalendar {
  id: number;
  name: string;
  image?: string;
}

export interface ApiAppointmentType {
  id: number;
  name: string;
  color: string;
  image?: string;
  schedulingUrl?: string;
}

// Application data types
export interface Teacher {
  id: number;
  name: string;
  text: string;
  img?: string;
  link?: string;
  color?: string;
}

export interface AppointmentType {
  id: number;
  name: string;
  text: string;
  color: string;
  img?: string;
  link?: string;
}

export interface Event {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  location: string;
  appointmentType: number;
  teachers: number[];
  originalData: ApiClass;
}

export interface EventOld {
  id: number;
  title: string;
  description: string;
  start: Date;
  end: Date;
  originalData: ApiClass;
}

// Cache types
export interface CacheData<T> {
  data: T;
  timestamp: number;
}

// Component props types
export interface AppProps {}

// Material-UI styled component types
export interface StyledProps {
  className?: string;
}

// Constants
export type ColorMap = Record<number, string>;

// Teacher links type
export type TeacherLinks = Record<number, string>; 