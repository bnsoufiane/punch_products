import * as _ from 'lodash';
import {Pipe, PipeTransform} from 'angular2/core';
import {Role} from '../interfaces/candidates/role.interface';


/*
 * Transforms the role id into role text
 * Takes an array of roles, filters by id and return text
 * Default to given role id if something goes wrong
 * Usage:
 *   roleId | roleText: roles
 */
@Pipe({name: 'roleText'})
export class RoleTextPipe implements PipeTransform {
  transform(roleId:string, args:any[]):string {
    if (!args[0] || !Array.isArray(args[0])) return roleId;
    let roles:Role[] = args[0];
    let result = _.find(roles, role => role.id === roleId);
    return result ? result.text : roleId;
  }
}
