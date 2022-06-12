import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExtensionProvider } from '@elrondnetwork/erdjs-extension-provider/out';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers/out';
import { Account, Address, ESDTNFTTransferPayloadBuilder, TokenPayment, Transaction, TransactionPayload, TransactionWatcher } from '@elrondnetwork/erdjs/out';
import { WalletService } from '../services/wallet/wallet.service';
import { WalletQuery } from '../services/wallet/wallet.query';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent  {

  // networkProvider = new ApiNetworkProvider('https://devnet-api.elrond.com');



  constructor(public router: Router,
    private walletService: WalletService,
    private walletQuery: WalletQuery) {

  }


}
