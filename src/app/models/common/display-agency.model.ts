import { ITitleChapter } from "./titlechapter.model";

export interface IDisplayAgency {
    label: string;                 // e.g. "- Agricultural Marketing Service"
    slug: string;                  // e.g. "agricultural-marketing-service"
    titleChapters: ITitleChapter[];
}