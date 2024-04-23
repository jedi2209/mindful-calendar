import React, {cloneElement, useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ViewState, GroupingState,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  DayView,
  WeekView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  Toolbar,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';

import moment from 'moment';
import 'moment-timezone';
import {get} from 'lodash';

import {getTeachers, getAppointmentTypes, getEventsSecond} from './Events';

import './css/App.css';
import { useWindowDimensions, checkObjectKey } from './core/utils';

moment.tz.setDefault('Europe/Madrid')
moment.locale('en-GB', {
	week: {
		dow: 1 //Monday is the first day of the week.
	}
});
let today = moment();
if (today.day() === 0) {
  today = today.add(1, 'days');
}

let resources = [];

const grouping = [{
  // resourceName: 'dayTime',
  // resourceName: 'teachers',
  resourceName: 'appointmentType',
}];

const classes = {
  dayScaleCell: `mindful-dayScaleCell`,
};
const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)({
  [`&.${classes.dayScaleCell}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});
const formatDayScaleDate = (date, options) => {
  const momentDate = moment(date);
  const { weekday } = options;
  return momentDate.format(weekday ? 'dddd' : 'D');
};
const formatTimeScaleDate = date => moment(date).format('HH:mm');
const DayScaleCell = ((
  { formatDate, ...restProps },
) => (
  <StyledWeekViewDayScaleCell
    {...restProps}
    formatDate={formatDayScaleDate}
    className={classes.dayScaleCell}
    onDoubleClick={undefined}
  />
));
const TimeScaleLabel = (
  { formatDate, ...restProps },
) => <WeekView.TimeScaleLabel {...restProps} formatDate={formatTimeScaleDate} />;

const appointmentComponent = props => {
  return (
    <Appointments.Appointment {...props} onDoubleClick={undefined} />
  );
}

const weekTimeTableCellComponent = props => {
  return (
    <WeekView.TimeTableCell {...props} onDoubleClick={undefined} />
  );
}

const dayTimeTableCellComponent = props => {
  return (
    <DayView.TimeTableCell {...props} onDoubleClick={undefined} />
  );
}

const App = props => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(today.toDate());
  const {width} = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);

  if (width <= 800) {
    if (!isMobile) {
      setIsMobile(true);
    }
  } else {
    if (isMobile) {
      setIsMobile(false);
    }
  }

  const eventsLoading = async() => {
    const events = await getEventsSecond();
    const teachersInited = checkObjectKey(resources, 'teachers');
    const appointmentTypesInited = checkObjectKey(resources, 'appointmentType');
    
    if (!get(appointmentTypesInited, 'length')) {
      const appointmentTypes = await getAppointmentTypes();
      resources.push({
        fieldName: 'appointmentType',
        title: 'Appointment Type',
        instances: appointmentTypes,
        allowMultiple: false,
      });
    }
    if (!get(teachersInited, 'length')) {
      const teachers = await getTeachers();
      resources.push({
        fieldName: 'teachers',
        title: 'Teachers',
        instances: teachers,
        allowMultiple: true,
      });
    }
    const nearestDateNext = moment(get(events, '0.startDate')).isAfter(moment(), 'days');
    console.info('nearestDateNext', nearestDateNext);
    setEvents(events);
    if (nearestDateNext) {
      setCurrentDate(moment(get(events, '0.startDate')).toDate());
    }
  }

  const dayScaleRowComponent = ({children}) => {
    let res = [];
    const propsDef = get(children, '0.props');
    let todayDate = null;
    todayDate = moment(propsDef.startDate.toDateString());
    if (todayDate.isAfter()) { // выбран день позже сегодняшнего
      let daysAgo = todayDate.diff(moment(), 'days') + 1;
      let daysAfter = 3;
      if (daysAgo >= 2) {
        daysAgo = 2;
        daysAfter = 2;
      }
      for (let index = daysAgo; index >= 1; --index) {
        const dateNew = todayDate.clone().subtract(index, 'days');
        res.push(cloneElement(children[0],
          {
            key: index,
            today: false,
            startDate: dateNew.toDate(),
            endDate: dateNew.toDate(),
            onClick: () => setCurrentDate(dateNew.toDate())
          }
        ));
      }
      res.push(cloneElement(children[0],
        {
          today: true,
        }
      ));
      for (let index = 1; index <= daysAfter; index++) {
        const dateNew = todayDate.clone().add(index, 'days');
        res.push(cloneElement(children[0],
          {
            key: index,
            today: false,
            startDate: dateNew.toDate(),
            endDate: dateNew.toDate(),
            onClick: () => setCurrentDate(dateNew.toDate())
          }
        ));
      }
    }
     else if (todayDate.isSame(moment(), 'day')) { // выбран текущий день
      res.push(cloneElement(children[0],
        {
          today: true,
        }
      ));
      for (let index = 1; index <= 4; index++) {
        const dateNew = todayDate.clone().add(index, 'days');
        res.push(cloneElement(children[0],
          {
            key: index,
            today: false,
            startDate: dateNew.toDate(),
            endDate: dateNew.toDate(),
            onClick: () => setCurrentDate(dateNew.toDate())
          }
        ));
      }
    }
    return res;
  }
  
  useEffect(() => {
    if (!get(events, 'length')) {
      eventsLoading();
    }
  }, [events]);

  if (!get(events, 'length')) {
    return <div className='loader' data-testid='loader'><CircularProgress style={{margin: 'auto'}}/></div>;
  }

  return (
    <div data-testid="scheduler-component">
      <Paper>
        <Scheduler data={events} locale={'en-GB'} firstDayOfWeek={1}>
          <ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
          <GroupingState
            grouping={grouping}
            groupOrientation={() => 'Vertical'}
            groupedByDate={true}
          />
          {!isMobile ? (
            <WeekView
              startDayHour={9}
              endDayHour={21}
              cellDuration={60}
              timeScaleLabelComponent={TimeScaleLabel}
              name="Week"
              timeTableCellComponent={weekTimeTableCellComponent}
            />
          ) : null}
          <DayView
            startDayHour={9}
            dayScaleCellComponent={DayScaleCell}
            endDayHour={21}
            cellDuration={60}
            dayScaleRowComponent={dayScaleRowComponent}
            timeTableCellComponent={dayTimeTableCellComponent}
          />
          <Appointments appointmentComponent={appointmentComponent} />
          <Resources
            data={resources}
            mainResourceName="appointmentType"
          />
          <AppointmentTooltip showCloseButton />
          <AppointmentForm readOnly={true} />

          <Toolbar />
          {!isMobile ? (<ViewSwitcher />) : null}
        </Scheduler>
      </Paper>
    </div>
  );
};

export default App;