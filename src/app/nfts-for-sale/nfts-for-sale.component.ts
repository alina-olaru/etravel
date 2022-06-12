import { Component, OnInit, ViewChild } from '@angular/core';
import { NftsService } from '../services/nfts/nfts.service';
import { NftSale, NFTView } from '../models/nft-view';
import { MapInfoWindow, GoogleMap } from '@angular/google-maps';
import { NftDetailsComponent } from '../map/nft-details/nft-details.component';
import { MatDialog } from '@angular/material/dialog';
import { WalletService } from '../services/wallet/wallet.service';
import { environment } from 'src/environments/environment';
import { WalletQuery } from '../services/wallet/wallet.query';
import { LoadingService } from '../services/loading.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-nfts-for-sale',
  templateUrl: './nfts-for-sale.component.html',
  styleUrls: ['./nfts-for-sale.component.scss']
})
export class NftsForSaleComponent implements OnInit {

  @ViewChild(MapInfoWindow, { static: false })
  infoWindow!: MapInfoWindow;

  @ViewChild(GoogleMap, { static: false })
  googleMap!: GoogleMap;

  zoom = 12;
  center: google.maps.LatLngLiteral = { lat: -25.363, lng: 131.044 };
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 100,
    minZoom: 8,
  };

  nftSales: NftSale[] = [];
  cachedNftSales: NftSale[] = [];
  bech32: string | null = null;
  searchText: string = '';

  constructor(private nftsService: NftsService,
    private dialog: MatDialog,
    private walletService: WalletService,
    private walletQuery: WalletQuery,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.loadingService.show();
    this.walletQuery.bech32$.subscribe(bech32 => {
      this.bech32 = bech32;
    });
    this.getNftsForSale();
  }

  getNftsForSale() {
    this.nftsService.getNftsForSale().subscribe(response => {
      this.nftSales = response.map(nftS => {
        nftS.nft.position = {
          lat: nftS.nft.locationLatitude,
          lng: nftS.nft.locationLongitude
        }
        return nftS;
      });
      this.cachedNftSales = [...this.nftSales];
      this.loadingService.hide();
    })
  }

  openmarker(marker: NftSale) {
    this.dialog.open(NftDetailsComponent, {
      width: '500px',
      data: {
        nft: marker.nft,
        displayPrice: false
      },
      disableClose: false,
      autoFocus: true
    })
  }
  mapDblclick(ev: any) { }
  mapMouseover(marker: any) {
    // console.log('open hover popup');
    // this.infoWindow.open(marker);
  }
  mapMouseout(ev: any) {
    // console.log('close hover popup');
  }

  scrollMapTo(nft: NftSale) {
    console.log(nft);
    this.googleMap.panTo({
      lat: nft.nft.locationLatitude,
      lng: nft.nft.locationLongitude
    });
    this.zoom = 10;
  }

  filterNFTsBasedOnText(searchText: any) {
    this.searchText = searchText;
    if (!searchText) {
      this.nftSales = this.cachedNftSales;
    }
    var text = ((searchText) as string).toLocaleLowerCase();
    this.nftSales = this.cachedNftSales.filter(
      (el) =>
        el.nft.description.toLocaleLowerCase().includes(text) ||
        el.nft.locationName.toLocaleLowerCase().includes(text) ||
        el.nft.nftName.toLocaleLowerCase().includes(text)
    );
    if (this.nftSales.length > 0) {
      this.scrollMapTo(this.nftSales[0]);
    }
  }

  buy(nftS: NftSale) {
    this.notificationsService.showToast('Confirm the transaction for buying this NFT, after confirmation and succesfull transaction the NFT will be sent to your wallet.', 'info');
    this.walletService.sendEgld(environment.eTravelWallet, nftS.price + 0.05).then(response => {
      if (response.status.isExecuted()) {
        this.loadingService.show();
        this.nftsService.buyNft(nftS.id, this.walletService.account?.address.bech32()!).subscribe(resp => {
          this.loadingService .hide();
          this.notificationsService.showToast('NFT bought successfully', 'success');
          this.nftSales = this.nftSales.filter(el => el.id !== nftS.id);
          this.cachedNftSales = this.cachedNftSales.filter(el => el.id !== nftS.id);
        });
      }
    });
  }

}
