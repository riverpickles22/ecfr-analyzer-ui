// routes.ts
import { Route } from '@angular/router';
//Main Panel Routes
import { MainComponent } from './main/main.component';

import { EcfrAnalyzerComponent } from './main/ecfr-analyzer/ecfr-analyzer.component';

export const MAIN_ROUTES: Route[] = [
  { path: '', redirectTo: 'ecfr-analyzer', pathMatch:'full' },
  { path: 'ecfr-analyzer', component: EcfrAnalyzerComponent },
 
];
