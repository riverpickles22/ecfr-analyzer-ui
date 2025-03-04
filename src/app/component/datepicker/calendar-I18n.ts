import { TranslationWidth } from '@angular/common';
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

const I18N_VALUES = {
  weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
};

@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  getWeekdayLabel(weekday: number, width?: TranslationWidth | undefined): string {
    // Return short name for now, you can customize as needed
    return I18N_VALUES.weekdays[weekday % 7];
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES.weekdays[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES.months[month - 1];
  }

  getMonthFullName(month: number): string {
    return I18N_VALUES.months[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.year}-${date.month}-${date.day}`;
  }
}
