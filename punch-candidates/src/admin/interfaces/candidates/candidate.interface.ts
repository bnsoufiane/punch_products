import {Company} from '../candidates/company.interface';
import {Skillset} from '../candidates/skillset.interface';

export interface Candidate {
  _id: string;
  avatar: File;
  interviewVideo: string;
  fullname: string;
  location: string;
  title: string;
  roles: Array<string>;
  skillset: [Skillset];
  pastCompanies: [Company];
}
