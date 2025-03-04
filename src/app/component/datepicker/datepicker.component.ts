import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbDatepickerModule, NgbDateParserFormatter, NgbDatepickerConfig, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SvgIconComponent } from '@app/shared/svg-icon/svg-icon.component';
import { CustomDateFormatterService } from './calendar-date-formatter.service';
import { CustomDatepickerI18n } from './calendar-I18n';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, SvgIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    },
    { provide: NgbDateParserFormatter, useClass: CustomDateFormatterService },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {
  @Output() dateSelected = new EventEmitter<Date | string | null>();

  date: NgbDateStruct | null = null;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  onChange: (date: NgbDateStruct | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor(private calendar: NgbCalendar, private config: NgbDatepickerConfig) {}

  ngOnInit(): void {
    this.initializeDatepickerConfig();
  }

  private initializeDatepickerConfig(): void {
    const today = new Date();
    this.minDate = { year: 1908, month: 1, day: 1 };
    this.maxDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    this.config.minDate = this.minDate;
    this.config.maxDate = this.maxDate;
    this.config.outsideDays = 'collapsed';
    this.config.navigation = 'select';
  }

  onDateSelect(): void {
    if (!this.date) {
      this.emitDate(null);
    } else if (typeof this.date === 'string') {
      this.handleStringDate(this.date);
    } else if (this.isValidNgbDateStruct(this.date)) {
      if (this.isWithinRange(this.date)) {
        this.emitDate(new Date(this.date.year, this.date.month - 1, this.date.day));
      } else {
        this.emitDate("Date out of range");
      }
    } else {
      this.emitDate("Invalid Date");
    }
  }

  private handleStringDate(dateString: string): void {
    const dateParts = dateString.split('-').map(part => parseInt(part, 10));
    if (dateParts.length === 3) {
      const [month, day, year] = dateParts;
      const dateStruct = { year, month, day };
      if (this.isValidDateFormat(dateStruct) && this.isWithinRange(dateStruct)) {
        this.emitDate(new Date(year, month - 1, day));
      } else {
        this.emitDate("Date out of range or Invalid Date");
      }
    } else {
      this.emitDate("Invalid Date");
    }
  }

  private isValidNgbDateStruct(date: NgbDateStruct): boolean {
    return !!(date && date.year && date.month && date.day);
  }

  private isValidDateFormat(date: { year: number, month: number, day: number }): boolean {
    const { year, month, day } = date;
    const parsedDate = new Date(year, month - 1, day);
    return (
      parsedDate.getFullYear() === year &&
      parsedDate.getMonth() + 1 === month &&
      parsedDate.getDate() === day &&
      year > 0 && month > 0 && month <= 12 && day > 0 && day <= 31
    );
  }

  private isWithinRange(date: NgbDateStruct): boolean {
    const dateObj = new Date(date.year, date.month - 1, date.day);
    const minDateObj = new Date(this.minDate.year, this.minDate.month - 1, this.minDate.day);
    const maxDateObj = new Date(this.maxDate.year, this.maxDate.month - 1, this.maxDate.day);
    return dateObj >= minDateObj && dateObj <= maxDateObj;
  }

  private emitDate(date: Date | string | null): void {
    if (date instanceof Date && !isNaN(date.getTime())) {
      this.dateSelected.emit(date);
      this.onChange(this.date);
    } else {
      this.dateSelected.emit(date);
    }
  }

  clear(): void {
    this.date = null;
    this.emitDate(null);
  }

  writeValue(value: NgbDateStruct | null): void {
    this.date = value;
  }

  registerOnChange(fn: (date: NgbDateStruct | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Implement if needed
  }
}
