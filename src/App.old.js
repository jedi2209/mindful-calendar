import React, { Fragment, useEffect, useState, useMemo, useCallback} from 'react';
import {
  Calendar,
  Views,
  momentLocalizer,
} from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";

import moment from 'moment';
import 'moment-timezone';
import {get} from 'lodash';
import {getEvents} from './Events';
import {colors, teachers} from './const';

moment.tz.setDefault('Europe/Madrid')
moment.locale('en-GB', {
	week: {
		dow: 1 //Monday is the first day of the week.
	}
});
const mLocalizer = momentLocalizer(moment);
const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: '#f7f7f7',
    },
});
const Event = ({ event }) => {
  return (
    <div>
      <strong style={{fontSize: 14,}}>{event.title}</strong>
      <div style={{fontSize: 12,marginTop: 10,}}>with <a href={teachers[event?.originalData?.calendarID]} target='_blank'>{event?.originalData?.calendar}</a></div>
      {/* <div style={{fontSize: 12,marginTop: 10,}}>{event.description && event.description}</div> */}
    </div>
  )
};

function App({
  localizer = mLocalizer,
  ...props
}) {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    const eventsLoading = async() => {
      const events = await getEvents();
      setEvents(events);
    }
    eventsLoading();
  }, []);

  const eventPropGetter = useCallback(
    (event, start, end, isSelected) => ({
      style: {
        backgroundColor: colors[get(event, 'originalData.appointmentTypeID')],
        color: '#011',
      },
      ...(moment(start).hour() < 12 && {
        className: 'powderBlue',
      }),
    }),
    []
  );

  const { components, defaultDate, min, max, views } = useMemo(
    () => {
      let today = moment();
      if (today.day() === 0) {
        today = today.add(1, 'days');
      }
      return ({
        components: {
          timeSlotWrapper: ColoredDateCellWrapper,
          event: Event,
        },
        defaultDate: today,
        min: today.hour(8).minute(0).second(0).toDate(),
        max: today.hour(22).minute(0).second(0).toDate(),
        // views: Object.keys(Views).map((k) => Views[k]),
        views: {
          week: true,
          // day: true,
        },
      });
    },
    []
  );

  const formats = useMemo(() => ({
    dateFormat: 'dd',
  
    // dayFormat: (date, culture, localizer) =>
    //   localizer.format(date, 'DDD', culture),
  
    // dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
    //   localizer.format(start, { date: 'short' }, culture) + ' — ' +
    //   localizer.format(end, { date: 'short' }, culture)
    }),
  []);

  if (!get(events, 'length')) {
    return;
  }

  return (
    <Fragment>
      <div className="height600" {...props}>
        <Calendar
          components={components}
          defaultDate={defaultDate}
          defaultView={Views.WEEK}
          events={events}
          localizer={localizer}
          min={min}
          max={max}
          dayLayoutAlgorithm={'no-overlap'}
          step={15}
          views={views}
          eventPropGetter={eventPropGetter}
          formats={formats}
          showMultiDayTimes
        />
      </div>
    </Fragment>
  );
}

export default App;
