// import { HealthRecordDetails } from "@app/models/health-record-details.model";
import { Observable } from "rxjs";
import { GetWordCountBatchRequest } from "@app/models/requests/get_agency-response";
import { GetWordCountResponse } from "@app/models/responses/get-word-count-response";

export interface IEcfrWordCountService {
  
  getWordCountBatch(data: GetWordCountBatchRequest):Observable<GetWordCountResponse>;
}