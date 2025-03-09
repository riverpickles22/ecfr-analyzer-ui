import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(annotationPlugin);
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
  public isChartLoading = false;

  public selectedDate: string = '';
  public selectedDateChanges: any[] = [];
  private chart: Chart | undefined;

  // Presidential term start dates
  private presidentialTerms = {
    'Obama': '2009-01-20',
    'Trump': '2017-01-20',
    'Biden': '2021-01-20',
    'Trump 2': '2025-01-20' // Placeholder if he wins again
  };

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
    if (!slug) {
      console.warn("No agency selected.");
      return;
    }
    
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

    this.isChartLoading = true;
    this.ecfrHistoricalChangeService.getHistoricalChangesBySlug(slug).subscribe({
      next: (res: GetHistoricalChangesResponse) => {
        if (!res.dailyChanges || res.dailyChanges.length === 0) {
          console.warn("No historical changes found.");
          this.isChartLoading = false;
          return;
        }
        
        this.dailyChanges = res.dailyChanges;
        this.totalChanges = res.totalChanges;
        this.historicalChangesLoaded = true;
        this.isChartLoading = false;
        
        this.renderChart();
      },
      error: (err) => {
        console.error('Error fetching historical daily change count:', err);
        this.isChartLoading = false;
      }
    });
    
  }

  /**
   * Renders the bar chart using Chart.js.
   */
  private renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
  
    setTimeout(() => {
      const canvas = document.getElementById('dailyChangesChart') as HTMLCanvasElement;
      if (!canvas) {
        console.error("Chart canvas not found!");
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error("Canvas context is not available!");
        return;
      }
  
      // Presidential annotations
      const annotations: any[] = [];
      Object.entries(this.presidentialTerms).forEach(([president, date]) => {
        const index = this.dailyChanges.findIndex(dc => dc.date === date);
        if (index !== -1) {
          annotations.push({
            type: 'line',
            mode: 'vertical',
            scaleID: 'x',
            value: index,
            borderColor: 'red',
            borderWidth: 2,
            label: {
              display: true,
              content: president,
              position: 'top',
              backgroundColor: '#fff',
              color: 'red',
              font: { size: 12 }
            }
          });
        }
      });
  
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.dailyChanges.map((dc, index) =>
            index % Math.ceil(this.dailyChanges.length / 10) === 0 ? new Date(dc.date).toLocaleDateString() : ''
          ),
          datasets: [{
            label: 'Daily Changes',
            data: this.dailyChanges.map(dc => dc.count),
            backgroundColor: 'rgba(30, 144, 255, 0.8)',
            borderColor: 'rgba(30, 144, 255, 1)',
            borderWidth: 1,
            barThickness: 12,
            hoverBorderWidth: 0,
            barPercentage: 0.8,
            categoryPercentage: 0.9
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: { font: { size: 12 } },
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(200, 200, 200, 0.3)' },
              ticks: { font: { size: 12 } }
            }
          },
          plugins: {
            legend: { labels: { font: { size: 14 } } },
            tooltip: { mode: 'index', intersect: false },
            annotation: { annotations }
          }
        }
      });
    }, 0);
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
