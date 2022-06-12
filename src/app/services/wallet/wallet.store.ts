import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { WalletState } from './wallet.model';

/**
 * Create initial state
 */
export function createInitialState(): WalletState {
  return {
    account: null,
    bech32: null
   };
}

/**
 * Wallet store
 *
 * @export
 * @class WalletStore
 * @extends {Store<WalletState>}
 */
@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'wallet' })
export class WalletStore extends Store<WalletState> {

  constructor() {
    super(createInitialState());
  }
}
