import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { EcfrAdminService } from '@app/services/api/ecfr-admin/ecfr-admin.service';
import { ECFR_ADMIN_SERVICE_TOKEN } from '@app/services/tokens/ecfr-admin.token';

@Component({
  selector: 'app-ecfr-analyzer',
  standalone: true,
  imports: [CommonModule],
  providers: [EcfrAdminService],
  templateUrl: './ecfr-analyzer.component.html',
  styleUrl: './ecfr-analyzer.component.scss'
})
export class EcfrAnalyzerComponent implements OnInit{

  // constructor(@Inject(ECFR_ADMIN_SERVICE_TOKEN) private ecfrAdminService: EcfrAdminService) {}

  constructor() {}
  ngOnInit() {
    console.log('ngOnInit');
  //   this.ecfrAdminService.getAllAgencies().subscribe({
  //     next: (agencies) => {
  //       console.log('Agencies received:', agencies);
  //     },
  //     error: (error) => {
  //       console.error('Error fetching agencies:', error);
  //     }
  //   });
  }
}