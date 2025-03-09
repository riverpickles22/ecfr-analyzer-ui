import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IAgency } from '@app/models/common/agency.model';
import { GetWordCountBatchRequest } from '@app/models/requests/get_agency-response';
import { GetHistoricalChangesResponse } from '@app/models/responses/get-historical-changes-response';
import { GetLatestDateResponse } from '@app/models/responses/get-latest-date.model';
import { GetWordCountResponse } from '@app/models/responses/get-word-count-response.model';
import { EcfrAdminService } from '@app/services/api/ecfr-admin/ecfr-admin.service';
import { EcfrHistoricalChangeService } from '@app/services/api/ecfr-historical-change/ecfr-historical-change.service';
import { EcfrWordCountService } from '@app/services/api/ecfr-wordcount/ecfr-wordcount.service';
import { ECFR_ADMIN_SERVICE_TOKEN } from '@app/services/tokens/ecfr-admin.token';
import { ECFR_HISTORICAL_CHANGE_SERVICE_TOKEN } from '@app/services/tokens/ecfr-historical_change.token';
import { ECFR_WORDCOUNT_SERVICE_TOKEN } from '@app/services/tokens/ecfr-wordcount.token';
// import { Chart, registerables } from 'chart.js';

// Chart.register(...registerables);

@Component({
  selector: 'app-ecfr-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [EcfrAdminService],
  templateUrl: './ecfr-analyzer.component.html',
  styleUrls: ['./ecfr-analyzer.component.scss']
})
export class EcfrAnalyzerComponent implements OnInit {
  public agencies: IAgency[] = [];
  public isLoading = false;
  public selectedAgencySlug = '';
  public currentWordCount: number | null = null;
  public calculatingWordCount: boolean = false;

  // For historical changes chart
  public currentDate: string = '';
  public dailyChanges: any[] = [];
  public totalChanges: number = 0;
  public historicalChangesLoaded = false;
  public selectedDate: string = '';
  public selectedDateChanges: any[] = [];
  // private chart: Chart | undefined;

  constructor(
    @Inject(ECFR_ADMIN_SERVICE_TOKEN) private ecfrAdminService: EcfrAdminService,
    @Inject(ECFR_WORDCOUNT_SERVICE_TOKEN) private ecfrWordCountService: EcfrWordCountService,
    @Inject(ECFR_HISTORICAL_CHANGE_SERVICE_TOKEN) private ecfrHistoricalChangeService: EcfrHistoricalChangeService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.ecfrAdminService.getAllAgencies().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.agencies = response.agencies;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching agencies:', err);
      }
    });

    this.ecfrAdminService.getLatestECFRDataDate().subscribe({
      next: (response: GetLatestDateResponse) => {
        this.currentDate = response.latestDate;
      },
      error: (err) => {
        console.error('Error fetching latest ECFR data date:', err);
      }
    });
  }

  /**
   * Called when the user selects an agency from the dropdown.
   */
  public onAgencySelected(slug: string): void {
    this.calculatingWordCount = true;
    const agency = this.findAgencyBySlug(this.agencies, slug);
    if (!agency) {
      return;
    }

    // Reset chart and historical data
    this.historicalChangesLoaded = false;
    this.dailyChanges = [];
    this.totalChanges = 0;
    this.selectedDate = '';
    this.selectedDateChanges = [];

    const wordCountRequestBody: GetWordCountBatchRequest = {
      date: this.currentDate, // or use new Date().toISOString().slice(0, 10)
      titleChapters: agency.titleChapters
    };

    this.ecfrWordCountService.getWordCountBatch(wordCountRequestBody).subscribe({
      next: (res: GetWordCountResponse) => {
        this.currentWordCount = res.wordCount;
        this.calculatingWordCount = false;
      },
      error: (err) => {
        console.error('Error fetching word count:', err);
        this.calculatingWordCount = false;
      }
    });

    // Get the historical daily change count.
    this.ecfrHistoricalChangeService.getHistoricalChangesBySlug(slug).subscribe({
      next: (res: GetHistoricalChangesResponse) => {
        // Assume the response contains "dailyChanges" (an array of {date, count})
        // and "totalChanges".
        this.dailyChanges = res.dailyChanges;
        this.totalChanges = res.totalChanges;
        this.historicalChangesLoaded = true;
        // this.renderChart();
      },
      error: (err) => {
        console.error('Error fetching historical daily change count:', err);
      }
    });
  }

  /**
   * Renders the bar chart using Chart.js.
   */
  // private renderChart(): void {
  //   // Destroy any existing chart instance
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }
  //   const ctx = document.getElementById('dailyChangesChart') as HTMLCanvasElement;
  //   this.chart = new Chart(ctx, {
  //     type: 'bar',
  //     data: {
  //       labels: this.dailyChanges.map(dc => dc.date),
  //       datasets: [{
  //         label: 'Daily Changes',
  //         data: this.dailyChanges.map(dc => dc.count),
  //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //         borderColor: 'rgba(75, 192, 192, 1)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       onClick: (event: any, elements: any[]) => {
  //         if (elements.length > 0) {
  //           const index = elements[0].index;
  //           const selectedDate = this.dailyChanges[index].date;
  //           this.onDateSelected(selectedDate);
  //         }
  //       },
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   });
  // }

  /**
   * Called when the user clicks on a bar in the chart.
   * It calls an API to fetch the list of changes for the selected date.
   */
  public onDateSelected(date: string): void {
    this.selectedDate = date;
    // Call your API to fetch changes for the given date.
    // For example, assume getChangesForDate returns an Observable<any[]>:
    // this.ecfrHistoricalChangeService.getChangesForDate(date).subscribe({
    //   next: (changes: any[]) => {
    //     this.selectedDateChanges = changes;
    //   },
    //   error: (err) => {
    //     console.error("Error fetching changes for date", date, err);
    //   }
    // });
  }

  /**
   * Recursively searches for an agency or child agency matching the slug.
   */
  private findAgencyBySlug(agencies: IAgency[], slug: string): IAgency | null {
    for (const agency of agencies) {
      if (agency.slug === slug) {
        return agency;
      }
      if (agency.children && agency.children.length > 0) {
        const found = this.findAgencyBySlug(agency.children, slug);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}
