export interface IForm {
  studentId: String;
  track: String;
  lastEvaluated: Date;
  trainersAssigned: String[];
  rating: object[];
}

export interface Ifilter {
  page?: number;
  itemsPerPage?: number;
  track?: string;
  overallAverage?: number;
  trainer?: string;
}
