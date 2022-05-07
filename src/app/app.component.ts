import { Component } from '@angular/core';
import { ExtensionProvider } from '@elrondnetwork/erdjs-extension-provider/out';
import {
  Account,
  Address,
  TokenPayment,
  Transaction,
  TransactionPayload,
} from '@elrondnetwork/erdjs/out';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'etravel';

  provider;
  // networkProvider = new ApiNetworkProvider('https://devnet-api.elrond.com');
  networkProvider = new ProxyNetworkProvider(
    'https://devnet-gateway.elrond.com'
  );

  constructor() {
    this.provider = ExtensionProvider.getInstance();
  }
  async init() {
    await this.provider.init();
    let walletAddress = await this.provider.login();
    let addressOfWallet = new Address(walletAddress);
    let account = new Account(addressOfWallet);
    let accountOnNetwork = await this.networkProvider.getAccount(
      addressOfWallet
    );
    account.update(accountOnNetwork);
    console.log(account.nonce);
    console.log((account.balance as any).c[0] / 10000);
    let xegld = (account.balance as any).c[0] / 10000;
  }

  connect() {
    this.init();
  }
  async sendTransaction() {
    let tx = new Transaction({
      data: new TransactionPayload('test Alina'),
      gasLimit: 70000,
      receiver: new Address(
        'erd1uv40ahysflse896x4ktnh6ecx43u7cmy9wnxnvcyp7deg299a4sq6vaywa'
      ),
      value: TokenPayment.egldFromAmount(1),
      chainID: 'D',
    });
    this.provider
      .signTransaction(tx)
      .finally(() => {})
      .then((signedTx) => {
        let txHash = this.networkProvider.sendTransaction(tx);
        console.log(txHash);
      });
  }
}
