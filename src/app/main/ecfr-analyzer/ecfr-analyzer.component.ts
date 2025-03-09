import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

// --- Chart.js & Plugins ---
import { Chart, registerables, ScatterDataPoint } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(...registerables);
Chart.register(annotationPlugin);

import 'chartjs-adapter-date-fns';

// --- Models & Services ---
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
  public calculatingWordCount = false;

  // For historical changes chart
  public currentDate = '';
  public dailyChanges: Array<{ date: string; count: number }> = [];
  public totalChanges = 0;
  public historicalChangesLoaded = false;
  public isChartLoading = false;

  // For showing details for a selected date (if needed)
  public selectedDate = '';
  public selectedDateChanges: any[] = [];

  /**
   * Declare our chart with a type that accepts ScatterDataPoint[]
   * so that each data point is of the form { x: number; y: number }.
   */
  private chart: Chart<'bar', ScatterDataPoint[], unknown> | undefined;

  /**
   * Presidential term start dates (for annotation lines).
   * These will be converted to numeric timestamps.
   */
  private presidentialTerms = {
    'Trump 1': '2017-01-20',
    'Biden': '2021-01-20',
    'Trump 2': '2025-01-20'
  };

  constructor(
    @Inject(ECFR_ADMIN_SERVICE_TOKEN) private ecfrAdminService: EcfrAdminService,
    @Inject(ECFR_WORDCOUNT_SERVICE_TOKEN) private ecfrWordCountService: EcfrWordCountService,
    @Inject(ECFR_HISTORICAL_CHANGE_SERVICE_TOKEN) private ecfrHistoricalChangeService: EcfrHistoricalChangeService
  ) {}

  ngOnInit(): void {
    // Fetch agencies
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

    // Fetch latest data date
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
   * Called when the user selects an agency.
   */
  public onAgencySelected(slug: string): void {
    if (!slug) {
      console.warn('No agency selected.');
      return;
    }
    this.calculatingWordCount = true;
    const agency = this.findAgencyBySlug(this.agencies, slug);
    if (!agency) {
      console.warn(`Agency slug "${slug}" not found.`);
      return;
    }

    // Reset historical/chart data
    this.historicalChangesLoaded = false;
    this.dailyChanges = [];
    this.totalChanges = 0;
    this.selectedDate = '';
    this.selectedDateChanges = [];

    // Fetch word count
    const wordCountRequestBody: GetWordCountBatchRequest = {
      date: this.currentDate,
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

    // Fetch historical changes
    this.isChartLoading = true;
    this.ecfrHistoricalChangeService.getHistoricalChangesBySlug(slug).subscribe({
      next: (res: GetHistoricalChangesResponse) => {
        if (!res.dailyChanges || res.dailyChanges.length === 0) {
          console.warn('No historical changes found.');
          this.isChartLoading = false;
          return;
        }
        // Note: If your API returns "count" (and not "changeCount"), use "count".
        this.dailyChanges = res.dailyChanges.map(change => ({
          date: change.date,
          count: change.count  // Make sure this matches your API response!
        }));
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
   * Renders the bar chart using a time scale.
   * Converts each date string into a numeric timestamp.
   */
  private renderChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = undefined;
    }
    setTimeout(() => {
      const canvas = document.getElementById('dailyChangesChart') as HTMLCanvasElement;
      if (!canvas) {
        console.error('Chart canvas not found!');
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Canvas context is not available!');
        return;
      }
  
      // Convert dailyChanges to { x: number, y: number } format.
      const chartData: ScatterDataPoint[] = this.dailyChanges.map(dc => ({
        x: new Date(dc.date).getTime(),
        y: dc.count
      }));
  
      // Compute overall min and max timestamps so annotations are visible.
      const dataTimestamps = this.dailyChanges.map(dc => new Date(dc.date).getTime());
      const presidentialTimestamps = Object.values(this.presidentialTerms).map(dateStr => new Date(dateStr).getTime());
      const overallMin = Math.min(...dataTimestamps, ...presidentialTimestamps);
      const overallMax = Math.max(...dataTimestamps, ...presidentialTimestamps);
  
      const annotations: Record<string, any> = {};
      Object.entries(this.presidentialTerms).forEach(([president, dateStr]) => {
        const timestamp = new Date(dateStr).getTime();
        annotations[president] = {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x',
          value: timestamp,
          borderColor: 'red',
          borderWidth: 2,
          drawTime: 'afterDatasetsDraw', 
          z: 9999,
          label: {
            enabled: true,
            display: true,
            content: president,
            position: 'center',
            xAdjust: 10,
            yAdjust: 0,
            color: 'red',
            backgroundColor: '#fff',
            font: { size: 12 }
          }
        };
      });
  
      this.chart = new Chart<'bar', ScatterDataPoint[], unknown>(ctx, {
        type: 'bar',
        data: {
          datasets: [
            {
              label: 'Daily Agency Regulatory Changes',
              data: chartData,
              backgroundColor: 'rgba(30, 144, 255, 0.8)',
              borderColor: 'rgba(30, 144, 255, 1)',
              borderWidth: 1,
              barThickness: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: true
          },
          hover: {
            mode: 'index',
            intersect: true
          },
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'month',
                displayFormats: {
                  month: 'MMM yyyy'
                }
              },
              ticks: {
                maxTicksLimit: 10,
                autoSkip: true,
                maxRotation: 0,
                minRotation: 0
              },
              min: overallMin,
              max: overallMax
            },
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            tooltip: {
              // No "sticky" settings
              enabled: true,
              // Optionally show only if value > 0
              filter: item => item.parsed.y > 0,
              callbacks: {
                title: items => {
                  const ts = items[0].parsed.x;
                  return new Date(ts).toLocaleDateString();
                },
                label: item => `Changes: ${item.parsed.y}`
              }
            },
            annotation: {
              common: {
                drawTime: 'afterDatasetsDraw'
              },
              annotations
            }
          }
        }
      });
    }, 0);
  }  

  /**
   * Recursively finds an agency (or child agency) by its slug.
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
