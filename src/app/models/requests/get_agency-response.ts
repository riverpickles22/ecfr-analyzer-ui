import { IAgency } from "../common/agency.model";
import { ITitleChapter } from "../common/titlechapter.model";

export interface GetWordCountBatchRequest {
  date: string;
  titleChapters: ITitleChapter[];
}