import React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import {
  WeekView,
  DayView,
  Appointments,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { get } from 'lodash';
import {
  StyledWeekViewDayScaleCell,
  StyledAppointmentTooltipHeader,
  StyledAppointmentTooltipCommandButton,
  StyledGrid,
  StyledInfo,
  formatDayScaleDate,
  formatTimeScaleDate,
} from './SchedulerStyledComponents';
import { CLASSES } from '../core/scheduler-constants';

export const DayScaleCell = (props: any) => (
  <StyledWeekViewDayScaleCell
    {...props}
    formatDate={formatDayScaleDate}
    className={CLASSES.dayScaleCell}
    onDoubleClick={undefined}
  />
);

export const TimeScaleLabel = (props: any) => 
  <WeekView.TimeScaleLabel {...props} formatDate={formatTimeScaleDate} />;

export const AppointmentComponent = (props: any) => {
  return (
    <Appointments.Appointment {...props} />
  );
};

export const WeekTimeTableCellComponent = (props: any) => {
  return (
    <WeekView.TimeTableCell {...props} onDoubleClick={undefined} />
  );
};

export const DayTimeTableCellComponent = (props: any) => {
  return (
    <DayView.TimeTableCell {...props} onDoubleClick={undefined} />
  );
};

export const Header = (props: any) => {
  const { appointmentData } = props;
  const img = get(appointmentData, 'appointmentData.img');
  return (
    <StyledAppointmentTooltipHeader
      {...props}
      className={CLASSES.header}
      style={img ? {
        background: `url(${img}) 50% 50% / cover no-repeat`,
      } : undefined}
    />
  );
};

export const Content = (props: any) => {
  const { appointmentData } = props;
  const descriptionData = get(appointmentData, 'originalData.description', '').split("\r\n");
  return (
    <AppointmentTooltip.Content {...props}>
      <Grid container alignItems="center">
        <Grid item xs={2} />
        <Grid item xs={10}>
          <a href={get(appointmentData, 'appointmentData.link')} target='_blank' rel='noreferrer'>
            <Button
              component="label"
              size="large"
              variant="contained"
              startIcon={<ShoppingBasketIcon />}
            >
              Sign UP
            </Button>
          </a>
        </Grid>
      </Grid>
      <Grid container alignItems="center">
        <StyledGrid item xs={2} className={CLASSES.textCenter}>
          <StyledInfo className={CLASSES.icon} />
        </StyledGrid>
        <Grid item xs={10}>
          {descriptionData.map((el: string, index: number) => <p key={index}>{el}</p>)}
        </Grid>
      </Grid>
    </AppointmentTooltip.Content>
  );
};

export const CommandButton = (props: any) => (
  <StyledAppointmentTooltipCommandButton {...props} className={CLASSES.commandButton} />
); 