import React, {cloneElement, useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Info from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';
import {
  ViewState, GroupingState,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  DateNavigator,
  TodayButton,
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

const PREFIX = 'mindful';

const classes = {
  dayScaleCell: `${PREFIX}-dayScaleCell`,
  icon: `${PREFIX}-icon`,
  textCenter: `${PREFIX}-textCenter`,
  firstRoom: `${PREFIX}-firstRoom`,
  secondRoom: `${PREFIX}-secondRoom`,
  thirdRoom: `${PREFIX}-thirdRoom`,
  header: `${PREFIX}-header`,
  commandButton: `${PREFIX}-commandButton`,
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

const StyledAppointmentTooltipHeader = styled(AppointmentTooltip.Header)(() => ({
  [`&.${classes.header}`]: {
    height: '260px',
  },
}));

const StyledAppointmentTooltipCommandButton = styled(AppointmentTooltip.CommandButton)(() => ({
  [`&.${classes.commandButton}`]: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
}));

const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.textCenter}`]: {
    textAlign: 'center',
  },
}));

const StyledInfo = styled(Info)(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));


const Header = (({
  children, appointmentData, ...restProps
}) => {
  const img = get(appointmentData, 'appointmentData.img');
  return (
  <StyledAppointmentTooltipHeader
    {...restProps}
    className={classes.header}
    style={img ? {
      background: `url(${img}) 50% 50% / cover no-repeat`,
    } : null}
    appointmentData={appointmentData}>
  </StyledAppointmentTooltipHeader>
)});

const Content = (({
  children, appointmentData, ...restProps
}) => {
  const descriptionData = get(appointmentData, 'originalData.description', '').split("\r\n");
  return (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
      <Grid container alignItems="center">
        <Grid item xs={2} />
        <Grid item xs={10}>
          <a href={get(appointmentData, 'appointmentData.link')} target='_blank'>
            <Button
              component="label"
              size="large"
              role={undefined}
              variant="contained"
              startIcon={<ShoppingBasketIcon />}>
              Sign UP
            </Button>
          </a>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <StyledGrid item xs={2} className={classes.textCenter}>
          <StyledInfo className={classes.icon} />
        </StyledGrid>
        <Grid item xs={10}>
          {descriptionData.map(el => <p>{el}</p>)}
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  )
});

const CommandButton = (({
  ...restProps
}) => (
  <StyledAppointmentTooltipCommandButton {...restProps} className={classes.commandButton} />
));

const App = props => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(today.toDate());
  const {width} = useWindowDimensions();
  const [isMobile, setIsMobile] = useState(false);
  const [startHour, setStartHour] = useState(9);
  const [lastHour, setLastHour] = useState(21);

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
    let events = await getEventsSecond();
    const teachersInited = checkObjectKey(resources, 'teachers');
    const appointmentTypesInited = checkObjectKey(resources, 'appointmentType');
    let appointmentTypesTmp = null;
    
    if (!get(appointmentTypesInited, 'length')) {
      appointmentTypesTmp = await getAppointmentTypes();
      resources.push({
        fieldName: 'appointmentType',
        title: 'Appointment Type',
        instances: appointmentTypesTmp,
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
    if (events && appointmentTypesTmp) {
      let hourFirst = startHour;
      let hourLast = lastHour;
      events.map((el, indx) => {
        const eventStartHour = parseInt(moment(el.startDate).format('H'));
        if (eventStartHour < hourFirst) {
          hourFirst = eventStartHour;
        }
        if (eventStartHour > hourLast) {
          hourLast = eventStartHour;
        }
        const appointmentDataTmp = appointmentTypesTmp.find(es => es.id === el.appointmentType);
        events[indx].appointmentData = appointmentDataTmp;
      });
      if (hourFirst !== startHour) {
        setStartHour(hourFirst);
      }
      if (hourLast !== lastHour) {
        setLastHour(hourLast);
      }
      setEvents(events);
    }
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
              startDayHour={startHour}
              endDayHour={lastHour}
              cellDuration={30}
              timeScaleLabelComponent={TimeScaleLabel}
              name="Week"
              timeTableCellComponent={weekTimeTableCellComponent}
            />
          ) : null}
          <DayView
            startDayHour={startHour}
            dayScaleCellComponent={DayScaleCell}
            endDayHour={lastHour}
            cellDuration={30}
            dayScaleRowComponent={dayScaleRowComponent}
            timeTableCellComponent={dayTimeTableCellComponent}
          />
          <Appointments appointmentComponent={appointmentComponent} />
          <Resources
            data={resources}
            mainResourceName="appointmentType"
          />
          <AppointmentTooltip
            headerComponent={Header}
            contentComponent={Content}
            commandButtonComponent={CommandButton}
            showCloseButton
          />
          <AppointmentForm readOnly={true} />

          <Toolbar />
          <DateNavigator />
          <TodayButton />
          {!isMobile ? (<ViewSwitcher />) : null}
        </Scheduler>
      </Paper>
    </div>
  );
};

export default App;