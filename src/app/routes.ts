// routes.ts
import { Route } from '@angular/router';
import { EcfrAnalyzerComponent } from './main/ecfr-analyzer/ecfr-analyzer.component';

export const MAIN_ROUTES: Route[] = [
  { path: '', component: EcfrAnalyzerComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
