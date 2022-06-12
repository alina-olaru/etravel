import { Account } from '@elrondnetwork/erdjs/out';
/**
 * Wallet state
 *
 * @export
 * @interface WalletState
 */
export interface WalletState {
  account: Account | null;
  bech32: string | null;
 }
