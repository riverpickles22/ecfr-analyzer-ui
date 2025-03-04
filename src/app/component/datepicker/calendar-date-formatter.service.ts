import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '-';

	fromModel(value: string | null): NgbDateStruct | null {
		if (value) {
			const date = value.split(this.DELIMITER);
			return {
				month: parseInt(date[1], 10),
                day: parseInt(date[0], 10),
				year: parseInt(date[2], 10),
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		return date ? date.month + this.DELIMITER + date.day  + this.DELIMITER + date.year : null;
	}
}


@Injectable()
export class CustomDateFormatterService extends NgbDateParserFormatter {

  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('-');
      if (dateParts.length === 3) {
        const month = +dateParts[0];
        const day = +dateParts[1];
        const year = +dateParts[2];

        // Check if the date parts represent a valid date
        if (this.isValidDate(month, day, year)) {
          return { month, day, year };
        }
      }
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    return date ? `${this.pad(date.month)}-${this.pad(date.day)}-${date.year}` : '';
  }

  private pad(number: number | null): string {
    return number !== null ? (number < 10 ? `0${number}` : `${number}`) : '';
  }

  private isValidDate(month: number, day: number, year: number): boolean {
    const date = new Date(year, month - 1, day); // JavaScript Date months are 0-based
    return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
  }
}
