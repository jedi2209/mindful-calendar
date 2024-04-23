import {get} from 'lodash';
import moment from 'moment';

import {colors} from './const';

const apiCall = async (url) => {
  // const host = 'XXXX';
  const host = 'https://XXXX'
  return fetch(host + url, {
    method: 'GET',
    redirect: 'follow',
  })
  .then(async response => {
    const json = await response.json();
    console.info('response local', json);
    return json;
  })
  .catch(error => console.error(error));
};

const getEvents = async() => {
  const classes = await apiCall('/availability/classes');
  if (get(classes, 'length') > 0) {
    let eventsTmp = [];
    let tmp = {};
    classes.map((el, indx) => {
      const date = moment(get(el, 'time'));
      tmp[get(el, 'appointmentTypeID')] = el;
      eventsTmp.push({
        id: indx,
        // name: get(el, 'name'),
        title: get(el, 'name'),
        description: get(el, 'description'),
        start: date.toDate(),
        end: date.add(get(el, 'duration', 60), 'minutes').toDate(),
        originalData: el,
      });
    });
    return eventsTmp;
  }
}

const teachers = {
  8874199: 'https://mindful-studio.com/timetable/anna',
  9175210: 'https://mindful-studio.com/timetable/sara',
  9684621: 'https://mindful-studio.com/timetable/olgastas-belovidov',
};

const getTeachers = async () => {
  const calendars = await apiCall('/calendars');
  console.info('calendars', calendars);
  if (get(calendars, 'length') > 0) {
    let calendarsTmp = [];
    calendars.map(el => {
      calendarsTmp.push({
        id: get(el, 'id'),
        name: get(el, 'name'),
        text: get(el, 'name'),
        img: get(el, 'image'),
        link: teachers[get(el, 'id')],
        color: colors[get(el, 'id')],
      });
    });
    return calendarsTmp;
  }
}

const getAppointmentTypes = async () => {
  const types = await apiCall('/appointment-types');
  if (get(types, 'length') > 0) {
    let typesTmp = [];
    types.map(el => {
      typesTmp.push({
        id: get(el, 'id'),
        name: get(el, 'name'),
        text: get(el, 'name'),
        color: get(el, 'color'),
      });
    });
    return typesTmp;
  }
}

const getEventsSecond = async () => {
  const classes = await apiCall('/availability/classes');
  if (get(classes, 'length') > 0) {
    let eventsTmp = [];
    let tmp = {};
    classes.map((el, indx) => {
      const date = moment(get(el, 'time'));
      let dayTime = 2;
      if (date.hour() < 14) {
        dayTime = 1;
      }
      tmp[get(el, 'appointmentTypeID')] = el;
      eventsTmp.push({
        id: indx,
        title: get(el, 'name'),
        startDate: date.toDate(),
        endDate: date.add(get(el, 'duration', 60), 'minutes').toDate(),
        location: 'Main',
        // dayTime,
        appointmentType: get(el, 'appointmentTypeID'),
        teachers: [get(el, 'calendarID')],
        originalData: el,
      });
    });
    return eventsTmp;
  }
}

export {getTeachers, getEvents, getAppointmentTypes, getEventsSecond};