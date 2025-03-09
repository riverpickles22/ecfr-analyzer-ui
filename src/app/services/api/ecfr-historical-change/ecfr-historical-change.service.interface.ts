// import { HealthRecordDetails } from "@app/models/health-record-details.model";
import { GetHistoricalChangesResponse } from "@app/models/responses/get-historical-changes-response";
import { Observable } from "rxjs";

export interface IEcfrHistoricalChangeService {
  
  getHistoricalChangesBySlug(slug:String):Observable<GetHistoricalChangesResponse>;
}