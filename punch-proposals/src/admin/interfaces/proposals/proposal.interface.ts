import {BreakdownTable} from './breakdown-table.interface';
import {Insert} from './insert.interface';

export interface Proposal {
  _id: string;
  name: string;
  subhead: string;
  overview: string;
  overview_inactive: boolean;
  scope_of_work: string;
  scope_of_work_inactive: boolean;
  inserts: [Insert];
  inserts_inactive: boolean;
  breakdown: {
    title: string,
    summary: string,
    tables: BreakdownTable[]
  };
  breakdown_inactive: boolean;
  timeline: {
    title: string,
    summary: string,
    tables: BreakdownTable[]
  };
  timeline_inactive: boolean;
  steps: {
    title: string,
    summary: string,
    list: {header:string, paragraph:string}[]
  };
  steps_inactive: boolean;
  candidate_ids: [string];
  candidate_ids_inactive: boolean;
  portfolio_ids: [number];
  portfolio_ids_inactive: boolean;
}
