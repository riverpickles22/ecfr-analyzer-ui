import { AbstractControl, ValidatorFn } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export function validDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const date: NgbDateStruct | null = control.value;
    if (date === null) {
      return null; // Null value is allowed
    }
    if (date && isValidDate(date)) {
      return null; // Valid date
    }
    return { 'invalidDate': { value: control.value } }; // Invalid date
  };
}

function isValidDate(date: NgbDateStruct): boolean {
  const { year, month, day } = date;
  if (!year || !month || !day) {
    return false;
  }
  const jsDate = new Date(year, month - 1, day);
  return jsDate.getFullYear() === year && jsDate.getMonth() === month - 1 && jsDate.getDate() === day;
}