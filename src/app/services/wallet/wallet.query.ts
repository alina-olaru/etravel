import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { WalletState } from './wallet.model';
import { WalletStore } from './wallet.store';

/**
 * Wallet query
 *
 * @export
 * @class WalletQuery
 * @extends {Query<WalletState>}
 */
@Injectable({ providedIn: 'root' })
export class WalletQuery extends Query<WalletState> {

  account$ = this.select(state => state.account);
  bech32$ = this.select(state => state.bech32);

  constructor(protected override store: WalletStore) {
    super(store);
  }
}
