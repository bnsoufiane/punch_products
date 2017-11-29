import {Pipe, PipeTransform} from 'angular2/core';
import {Candidate} from '../interfaces/interfaces';
import {Role} from '../interfaces/candidates/role.interface';
import * as _ from 'lodash';
import {ArrayUtils} from '../../utils/index';

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

