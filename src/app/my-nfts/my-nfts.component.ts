import { Component, OnInit } from '@angular/core';
import { NFT } from '../map/nft';
import { WalletService } from '../services/wallet/wallet.service';
import { WalletQuery } from '../services/wallet/wallet.query';
import { NftsService } from '../services/nfts/nfts.service';
import { NFTView } from '../models/nft-view';
import { Account } from '@elrondnetwork/erdjs/out';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-my-nfts',
  templateUrl: './my-nfts.component.html',
  styleUrls: ['./my-nfts.component.scss']
})
export class MyNftsComponent implements OnInit {
  nfts: NFTView[] = [];

  //acc info
  account: Account | null = null;
  bech32: string = '';
  constructor(public walletService: WalletService,
    public nftService: NftsService,
    private walletQuery: WalletQuery,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.show();
    this.walletQuery.account$.subscribe(account => {
      if (account) {
        this.account = account;
        this.bech32 = account?.address.bech32() || " ";
        if (!this.bech32 || this.bech32.length == 0) {
          return;
        }
        this.nftService.getNFTsByAccount(this.bech32).subscribe(resp => {
          this.nfts = resp;
          this.loadingService.hide();
        })
      }

    })

  }


}
