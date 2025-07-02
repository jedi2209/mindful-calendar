import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Info from '@mui/icons-material/Info';
import {
  WeekView,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import moment from 'moment';
import { CLASSES } from '../core/scheduler-constants';

export const StyledWeekViewDayScaleCell = styled(WeekView.DayScaleCell)({
  [`&.${CLASSES.dayScaleCell}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export const StyledAppointmentTooltipHeader = styled(AppointmentTooltip.Header)(() => ({
  [`&.${CLASSES.header}`]: {
    height: '260px',
  },
}));

export const StyledAppointmentTooltipCommandButton = styled(AppointmentTooltip.CommandButton)(() => ({
  [`&.${CLASSES.commandButton}`]: {
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
}));

export const StyledGrid = styled(Grid)(() => ({
  [`&.${CLASSES.textCenter}`]: {
    textAlign: 'center',
  },
}));

export const StyledInfo = styled(Info)(({ theme: { palette } }) => ({
  [`&.${CLASSES.icon}`]: {
    color: palette.action.active,
  },
}));

// Форматтеры дат
export const formatDayScaleDate = (date: any, options: any) => {
  const momentDate = moment(date);
  const { weekday } = options;
  return momentDate.format(weekday ? 'dddd' : 'D');
};

export const formatTimeScaleDate = (date: any) => moment(date).format('HH:mm'); 