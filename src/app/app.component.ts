import { Component, HostListener, OnInit } from '@angular/core';
import { ExtensionProvider } from '@elrondnetwork/erdjs-extension-provider/out';
import {
  Account,
  Address,
  TokenPayment,
  Transaction,
  TransactionPayload,
  SignableMessage,
  TransactionWatcher,
} from '@elrondnetwork/erdjs/out';
import { ProxyNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { ApiNetworkProvider } from '@elrondnetwork/erdjs-network-providers';
import { create } from 'ipfs-http-client';
import { Signature } from '@elrondnetwork/erdjs/out/signature';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from './services/loading.service';
import { WalletService } from './services/wallet/wallet.service';
import { Router } from '@angular/router';
import { WalletQuery } from './services/wallet/wallet.query';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'etravel';
  displayLoading = false;
  provider;
  networkProvider = new ProxyNetworkProvider(
    'https://devnet-gateway.elrond.com'
  );

  account: Account | null = null;
  bech32?: string = '';

  constructor(
    private walletQuery: WalletQuery,
    public router: Router, private http: HttpClient, private loadingService: LoadingService, public walletService: WalletService) {
    this.loadingService.displayLoanding$.subscribe(resp => {
      this.displayLoading = resp;
    })
    this.provider = ExtensionProvider.getInstance();
  }
  async ngOnInit() {



    this.walletQuery.select().subscribe(wallet => {
      if (wallet.bech32 != null && wallet.account == null) {
        this.walletService.setAccount(wallet.bech32);
      }
    })

    this.walletQuery.account$.subscribe(account => {
      if (account) {
        this.account = account;
        this.bech32 = account?.address.bech32();
      } else {
        this.account = null;
        this.bech32 = '';
      }
    })

    // if( navigator.geolocation )
    //     {
    //        // Call getCurrentPosition with success and failure callbacks
    //        navigator.geolocation.getCurrentPosition( (position) => {
    //         console.log(position);
    //        }, fail => {
    //         console.log(fail);
    //        } );
    //     }


  }

  async init() {
    await this.walletService.connect();
  }

  toMap() {
    this.router.navigateByUrl("/map");
  }

  start() {
    this.router.navigateByUrl("/create-nft");
  }

  async logout() {
    await this.walletService.logOutAccount();
    this.router.navigateByUrl("/");
  }

}
