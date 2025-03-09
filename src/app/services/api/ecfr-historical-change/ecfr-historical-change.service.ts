import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';

import { environment } from '@env/environment';
import { IEcfrHistoricalChangeService } from './ecfr-historical-change.service.interface';
import { GetHistoricalChangesResponse } from '@app/models/responses/get-historical-changes-response';

@Injectable({
    providedIn: 'root',
    useFactory: () => provideHttpClient(withFetch()),

})
export class EcfrHistoricalChangeService implements IEcfrHistoricalChangeService {
    apiUrl = `${environment.apiEndpoint}/ecfr/historical-changes`;

    constructor(private _http: HttpClient) {}
    
    getHistoricalChangesBySlug(slug: string): Observable<GetHistoricalChangesResponse> {
        return this._http.get<GetHistoricalChangesResponse>(`${this.apiUrl}/slug-${slug}`).pipe(
            catchError((error: any) => {
                console.error('Error fetching word count batch:', error);
                throw error;
            })
        );
    }
}
