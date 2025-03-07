import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IAgency } from '@app/models/common/agency.model';
import { GetWordCountBatchRequest } from '@app/models/requests/get_agency-response';
import { GetWordCountResponse } from '@app/models/responses/get-word-count-response';
import { EcfrAdminService } from '@app/services/api/ecfr-admin/ecfr-admin.service';
import { EcfrWordCountService } from '@app/services/api/ecfr-wordcount/ecfr-wordcount.service';

import { ECFR_ADMIN_SERVICE_TOKEN } from '@app/services/tokens/ecfr-admin.token';
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

  constructor(
    @Inject(ECFR_ADMIN_SERVICE_TOKEN) private ecfrAdminService: EcfrAdminService,
    @Inject(ECFR_WORDCOUNT_SERVICE_TOKEN) private ecfrWordCountService: EcfrWordCountService
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
  }

  /**
   * Called when the user selects an agency from the dropdown.
   * It looks up the agency by slug and then calls the API.
   */
  public onAgencySelected(slug: string): void {
    this.calculatingWordCount = true;
    const agency = this.findAgencyBySlug(this.agencies, slug);
    if (!agency) {
      return;
    }

    const requestBody: GetWordCountBatchRequest = {
      date: '2025-03-04',//new Date().toISOString().slice(0, 10),
      titleChapters: agency.titleChapters
    };

    this.ecfrWordCountService.getWordCountBatch(requestBody).subscribe({
      next: (res: GetWordCountResponse) => {
        this.currentWordCount = res.wordCount;
        this.calculatingWordCount = false;
      },
      error: (err) => {
        console.error('Error fetching word count:', err);
        this.calculatingWordCount = false;
      }
    });
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
