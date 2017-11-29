export interface Company {
  logo: File;
  name: string;
  url: string;
  candidateTitle: string;
  workStartMonth: number;
  workStartYear: number;
  workEndMonth: number;
  workEndYear: number;
  workDescription: string;
  workSamples: [File];
}
