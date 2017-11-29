import {provide, enableProdMode} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, APP_BASE_HREF} from 'angular2/router';
import {AppComponent} from './components/app/app.component';
import {SERVICE_PROVIDERS} from './services/services';

import 'rxjs/Rx';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  SERVICE_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '<%= APP_BASE %>' })
]);
