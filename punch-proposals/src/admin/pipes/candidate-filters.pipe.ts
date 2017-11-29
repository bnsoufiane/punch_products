import {Pipe, PipeTransform} from 'angular2/core';
import {Candidate, Role} from '../interfaces/interfaces';
import * as _ from 'lodash';
import {ArrayUtils} from '../../utils/index';

/*
 * filters candidates collection by name, role or location
 * Usage:
 *   Candidate[] | candidateQueryFilter:query
 */
@Pipe({name: 'candidateQueryFilter'})
export class CandidateQueryFilterPipe implements PipeTransform {
  transform(candidates:Candidate[], args:any[]):Candidate[] {
    let query:string = args[0];
    if (!query) return candidates;
    return _.filter(candidates, candidate =>
        (candidate.fullname && candidate.fullname.toLowerCase().includes(query.toLowerCase())) ||
        (candidate.location && candidate.location.includes(query.toLowerCase())) ||
        ArrayUtils.any(candidate.roles, role => role.toLowerCase().includes(query.toLowerCase()))
      ) || candidates;
  }
}

/*
 * filters candidates collection by role
 * Usage:
 *   Candidate[] | candidateRoleFilter:role
 */
@Pipe({name: 'candidateRoleFilter'})
export class CandidateRoleFilterPipe implements PipeTransform {
  transform(candidates:Candidate[], args:any[]):Candidate[] {
    let role:Role = args[0];
    if (!role) return candidates;
    return _.filter(candidates, candidate =>
      ArrayUtils.any(candidate.roles, cRole => cRole === role.id));
  }
}

export const CANDIDATE_FILTER_PIPES:Array<any> = [CandidateQueryFilterPipe, CandidateRoleFilterPipe];
