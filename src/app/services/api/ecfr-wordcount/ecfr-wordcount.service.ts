import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';

import { environment } from '@env/environment';
import { IEcfrWordCountService } from './ecfr-wordcount.service.interface';
import { GetWordCountBatchRequest } from '@app/models/requests/get_agency-response';
import { GetWordCountResponse } from '@app/models/responses/get-word-count-response.model';

@Injectable({
    providedIn: 'root',
    useFactory: () => provideHttpClient(withFetch()),

})
export class EcfrWordCountService implements IEcfrWordCountService {
    apiUrl = `${environment.apiEndpoint}/wordcount`;

    constructor(private _http: HttpClient) {}
    
    getWordCountBatch(data: GetWordCountBatchRequest): Observable<GetWordCountResponse> {
        return this._http.post<GetWordCountResponse>(`${this.apiUrl}/batch`, data).pipe(
            catchError(error => {
                console.error('Error fetching word count batch:', error);
                throw error;
            })
        );
    }
}
