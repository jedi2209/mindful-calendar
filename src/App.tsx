import React from 'react';
import Paper from '@mui/material/Paper';
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
import { get } from 'lodash';

import { useSchedulerData } from './hooks/useSchedulerData';
import { useMobileDetection } from './hooks/useMobileDetection';
import { LoadingComponent } from './components/LoadingComponent';
import { createDayScaleRowComponent } from './components/DayScaleRowComponent';
import {
  DayScaleCell,
  TimeScaleLabel,
  AppointmentComponent,
  WeekTimeTableCellComponent,
  DayTimeTableCellComponent,
  Header,
  Content,
  CommandButton,
} from './components/SchedulerComponents';
import { GROUPING, SCHEDULER_CONFIG } from './core/scheduler-constants';

import './css/App.css';

const App: React.FC = () => {
  const {
    events,
    resources,
    startHour,
    lastHour,
    loadingText,
    currentDate,
    setCurrentDate,
  } = useSchedulerData();
  
  const { isMobile } = useMobileDetection();
  
  const dayScaleRowComponent = createDayScaleRowComponent(setCurrentDate);

  if (!get(events, 'length')) {
    return <LoadingComponent loadingText={loadingText} />;
  }

  return (
    <div data-testid="scheduler-component">
      <Paper>
        <Scheduler 
          data={events} 
          locale={SCHEDULER_CONFIG.LOCALE} 
          firstDayOfWeek={SCHEDULER_CONFIG.FIRST_DAY_OF_WEEK}
        >
          <ViewState currentDate={currentDate} onCurrentDateChange={setCurrentDate} />
          <GroupingState
            grouping={GROUPING}
            groupOrientation={() => 'Vertical'}
            groupByDate={() => true}
          />
          
          {!isMobile && (
            <WeekView
              startDayHour={startHour}
              endDayHour={lastHour}
              cellDuration={SCHEDULER_CONFIG.CELL_DURATION}
              timeScaleLabelComponent={TimeScaleLabel}
              name="Week"
              timeTableCellComponent={WeekTimeTableCellComponent}
            />
          )}
          
          <DayView
            startDayHour={startHour}
            dayScaleCellComponent={DayScaleCell}
            endDayHour={lastHour}
            cellDuration={SCHEDULER_CONFIG.CELL_DURATION}
            dayScaleRowComponent={dayScaleRowComponent}
            timeTableCellComponent={DayTimeTableCellComponent}
          />
          
          <Appointments appointmentComponent={AppointmentComponent} />
          
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
          
          {!isMobile && <ViewSwitcher />}
        </Scheduler>
      </Paper>
    </div>
  );
};

export default App; 