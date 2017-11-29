import {Pipe, PipeTransform} from 'angular2/core';
import {Proposal} from '../interfaces/proposals/proposal.interface';
import * as _ from 'lodash';

/*
 * filters proposals collection by title, subtitle or company
 * Usage:
 *   Proposal[] | proposalQueryFilter:query
 */
@Pipe({name: 'proposalQueryFilter'})
export class ProposalQueryFilterPipe implements PipeTransform {
  transform(proposals:Proposal[], args:any[]):Proposal[] {
    let query:string = args[0];
    if (!query) return proposals;
    return _.filter(proposals, proposal =>
        (proposal.name && proposal.name.toLowerCase().includes(query.toLowerCase()))
      ) || proposals;
  }
}
