import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { persistState } from '@datorama/akita';

const storage = persistState({
  preStorageUpdate(storeName: any, state: any) {
    if (storeName === 'wallet') {
      return {
        bech32: state.bech32,
      };
    }

    return state;
  },
});

const providers = [{ provide: 'persistStorage', useValue: storage}];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
