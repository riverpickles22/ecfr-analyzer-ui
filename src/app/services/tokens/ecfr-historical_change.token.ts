import { InjectionToken } from '@angular/core';
import { IEcfrHistoricalChangeService } from '../api/ecfr-historical-change/ecfr-historical-change.service.interface';

export const ECFR_HISTORICAL_CHANGE_SERVICE_TOKEN = new InjectionToken<IEcfrHistoricalChangeService>('IEcfrHistoricalChangeService');