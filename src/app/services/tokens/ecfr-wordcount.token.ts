import { InjectionToken } from '@angular/core';
import { IEcfrWordCountService } from '@app/services/api/ecfr-wordcount/ecfr-wordcount.service.interface';

export const ECFR_WORDCOUNT_SERVICE_TOKEN = new InjectionToken<IEcfrWordCountService>('IEcfrWordCountService');
