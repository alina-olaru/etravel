import { Injectable } from '@angular/core';
import { ExtensionProvider } from '@elrondnetwork/erdjs-extension-provider/out';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { environment } from 'src/environments/environment';
import { WalletStore } from './wallet.store';
import { WalletQuery } from './wallet.query';
import { Account, Address, ESDTNFTTransferPayloadBuilder, ITransactionOnNetwork, TokenPayment, Transaction, TransactionPayload, TransactionWatcher } from '@elrondnetwork/erdjs/out';
import { LoadingService } from '../loading.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {


  provider:ExtensionProvider;
  account?: Account | null;
  networkProvider = new ProxyNetworkProvider(
    environment.blockhainNetworkProvider
  );

  constructor(private walletStore: WalletStore, private walletQuery: WalletQuery, private loadingService: LoadingService) {
    this.provider = ExtensionProvider.getInstance();
  }

  async connect() {
    await this.provider.init();
    let walletAddress = await this.provider.login();
    console.log(walletAddress);
    let addressOfWallet = new Address(walletAddress);
    console.log(addressOfWallet);
    this.account = new Account(addressOfWallet);
    let accountOnNetwork = await this.networkProvider.getAccount(
      addressOfWallet
    );

    this.account.update(accountOnNetwork);
    this.walletStore.update({
      account:  this.account,
      bech32: this.account.address.bech32()
    });
  }

  async setAccount(bech32: string) {
    await this.provider.init();
    this.provider.setAddress(bech32);
    this.account = new Account(new Address(bech32));
    let accountOnNetwork = await this.networkProvider.getAccount(
      this.account.address
    );

    this.account.update(accountOnNetwork);
    this.walletStore.update({
      account:  this.account,
    });
  }

  async logOutAccount() {
    var response = await this.provider.logout();
    if(response) {
      this.walletStore.update({
        account: null,
        bech32: null
      });
      this.account = null;

    }
  }

  async sendEgld(toAddress: string, amount: number) : Promise<ITransactionOnNetwork> {
    return new Promise((resolve, reject) => {
      if(this.account) {
        let tp = TokenPayment.egldFromAmount(amount);
        let tx = new Transaction({
          gasLimit: 700000,
          receiver: new Address(toAddress),
          value: tp,
          chainID: "D"
        });
        tx.setNonce(this.account.getNonceThenIncrement());
        this.provider
          .signTransaction(tx)
          .finally(() => {})
          .then(async (signedTx: any) => {
            let txHash = await this.networkProvider.sendTransaction(signedTx);
            let watcher = new TransactionWatcher(this.networkProvider);
            this.loadingService.show();
            let transactionOnNetwork: ITransactionOnNetwork = await watcher.awaitCompleted(tx);
            resolve(transactionOnNetwork);
          });
      } else {
        reject("No account");
      }
    })
  }

  async sendNft(toAddress: string, nftNonce: number) : Promise<ITransactionOnNetwork> {
    return new Promise((resolve, reject) => {
      if(this.account) {
        let payment = TokenPayment.nonFungible(environment.tokenIdentifier, nftNonce);
        let payload = new ESDTNFTTransferPayloadBuilder()
            .setPayment(payment)
            .setDestination(new Address(toAddress))
            .build();

        let tx = new Transaction({
            receiver: new Address(this.account.address.bech32()),
            sender: new Address(this.account.address.bech32()),
            data: payload,
            gasLimit: 5000000 + 1500 * payload.length() + 1000000,
            chainID: "D"
        });

        tx.setNonce(this.account.getNonceThenIncrement());
        this.provider
          .signTransaction(tx)
          .finally(() => {})
          .then(async (signedTx: any) => {
            let txHash = await this.networkProvider.sendTransaction(signedTx);
            let watcher = new TransactionWatcher(this.networkProvider);
            this.loadingService.show();
            let transactionOnNetwork: ITransactionOnNetwork = await watcher.awaitCompleted(tx);
            resolve(transactionOnNetwork);
          });
      } else {
        reject("No account");
      }
    })
  }

}
