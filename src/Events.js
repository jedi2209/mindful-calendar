import {get} from 'lodash';
import moment from 'moment';

import {colors} from './core/const';

/**
 * Object containing links to teacher timetables.
 * @type {Object.<number, string>}
 */
const teacherLinks = {
  8874199: 'https://mindful-studio.com/timetable/anna',
  9175210: 'https://mindful-studio.com/timetable/sara',
  9684621: 'https://mindful-studio.com/timetable/olgastas-belovidov',
};

/**
 * Makes an API call to the specified URL.
 * @param {string} url - The URL to make the API call to.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the API call.
 */
const apiCall = async (url) => {
  // const host = 'XXXX';
  const host = 'https://api.mindful-studio.com/v1'
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

/**
 * Retrieves events from the API and transforms them into a standardized format.
 * @returns {Array} An array of events.
 */
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

/**
 * Retrieves the list of teachers from the API.
 * @returns {Promise<Array>} The list of teachers.
 */
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
        link: teacherLinks[get(el, 'id')],
        color: colors[get(el, 'id')],
      });
    });
    return calendarsTmp;
  }
}

/**
 * Retrieves the appointment types from the API.
 * @returns {Promise<Array<Object>>} The array of appointment types.
 */
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

/**
 * Retrieves events from the API and transforms them into a standardized format.
 * @returns {Array} An array of events in the standardized format.
 */
const getEventsSecond = async () => {
  const classes = await apiCall('/availability/classes');
  if (get(classes, 'length') > 0) {
    let eventsTmp = [];
    let tmp = {};
    classes.map((el, indx) => {
      const date = moment(get(el, 'time'));
      // let dayTime = 2;
      // if (date.hour() < 14) {
      //   dayTime = 1;
      // }
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