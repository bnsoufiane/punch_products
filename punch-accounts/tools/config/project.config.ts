import {join} from 'path';
import {SeedConfig} from './seed.config';
import {InjectableDependency} from './seed.config.interfaces';
import * as _ from 'lodash';

export class ProjectConfig extends SeedConfig {
  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  DEV_API_BASE         = 'http://localhost:3000';
  PROD_API_BASE        = 'http://punch-staffing.appspot.com';
  API_DIR              = '../staffing-api';
  API_CLIENT_DIR       = `${this.API_DIR}/public`;
  PRODUCTS             =  {
    DEV_DATA: 'http://localhost:5556',
    DEV_CANDIDATES: 'http://localhost:5557',
    DEV_PROPOSALS: 'http://localhost:5558',
    PROD_DATA: 'http://data.punch-agency.com',
    PROD_CANDIDATES: 'http://candidates.punch-agency.com',
    PROD_PROPOSALS: 'http://proposals.punch-agency.com'
  };
  /**
   * Add any new fonts library here. It will be copied into local fonts directory
   * @type {string[]}
   */
  EXTERNAL_FONTS_SRC   = [
    'node_modules/bootstrap/dist/fonts/**',
    'node_modules/font-awesome/fonts/**',
  ];



  constructor() {
    super();
    this.APP_TITLE = 'Punch Internal';
    _.extend(this.SYSTEM_BUILDER_CONFIG, {
      map: {
      lodash: 'lodash',
      moment: 'moment',
      'ng2-bootstrap': 'ng2-bootstrap',
      'ng2-select': 'ng2-select',
      'ng2-pagination': 'ng2-pagination'
    }});
    let additional_deps: InjectableDependency[] = [
      {src: 'bootstrap/dist/css/bootstrap.css', inject: true},
      {src: 'font-awesome/css/font-awesome.css', inject: true},
      {src: 'ng2-select/components/css/ng2-select.css', inject: true}
    ];

    const seedDependencies = this.NPM_DEPENDENCIES;

    this.NPM_DEPENDENCIES = seedDependencies.concat(additional_deps);
  }
}
