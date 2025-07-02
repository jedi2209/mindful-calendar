import React, { cloneElement } from 'react';
import moment from 'moment';
import { get } from 'lodash';

export const createDayScaleRowComponent = (setCurrentDate: (date: Date) => void) => {
  return ({ children }: any) => {
    const res: any[] = [];
    const propsDef = get(children, '0.props');
    let todayDate = moment(propsDef.startDate.toDateString());
    
    if (todayDate.isAfter()) { // выбран день позже сегодняшнего
      let daysAgo = todayDate.diff(moment(), 'days') + 1;
      let daysAfter = 3;
      if (daysAgo >= 2) {
        daysAgo = 2;
        daysAfter = 2;
      }
      for (let index = daysAgo; index >= 1; --index) {
        const dateNew = todayDate.clone().subtract(index, 'days');
        res.push(cloneElement(children[0], {
          key: index,
          today: false,
          startDate: dateNew.toDate(),
          endDate: dateNew.toDate(),
          onClick: () => setCurrentDate(dateNew.toDate())
        }));
      }
      res.push(cloneElement(children[0], { today: true }));
      for (let index = 1; index <= daysAfter; index++) {
        const dateNew = todayDate.clone().add(index, 'days');
        res.push(cloneElement(children[0], {
          key: index,
          today: false,
          startDate: dateNew.toDate(),
          endDate: dateNew.toDate(),
          onClick: () => setCurrentDate(dateNew.toDate())
        }));
      }
    } else if (todayDate.isSame(moment(), 'day')) { // выбран текущий день
      res.push(cloneElement(children[0], { today: true }));
      for (let index = 1; index <= 4; index++) {
        const dateNew = todayDate.clone().add(index, 'days');
        res.push(cloneElement(children[0], {
          key: index,
          today: false,
          startDate: dateNew.toDate(),
          endDate: dateNew.toDate(),
          onClick: () => setCurrentDate(dateNew.toDate())
        }));
      }
    }
    return <>{res}</>;
  };
}; 