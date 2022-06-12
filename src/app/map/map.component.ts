import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { NFT } from './nft';
import { NFTView } from '../models/nft-view';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NftDetailsComponent } from './nft-details/nft-details.component';
import { Account } from '@elrondnetwork/erdjs/out';
import { WalletService } from '../services/wallet/wallet.service';
import { environment } from '../../environments/environment';
import { NftsService } from '../services/nfts/nfts.service';
import { LoadingService } from '../services/loading.service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
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


  _nfts!: NFTView[];
  get nfts(): NFTView[] {
    return this._nfts;
  }
  @Input() set nfts(value: NFTView[]) {
    this._nfts = value;
    this.nfts.map(el => el.position = {
      lat: el.locationLatitude,
      lng: el.locationLongitude
    })
    this.scrollMapTo(this.nfts[0]);
  }



  //to do change this in 1
  mapType = 0;
  // 0 map
  // 1 my nfts
  @Input() type: number = 0;
  @Input() listNfts: NFTView[] = [];
  markers: google.maps.Marker[] = [];

  constructor(private dialog: MatDialog,
    private walletService: WalletService,
    private nftsService: NftsService,
    private loadingService: LoadingService,
    private notificationsService: NotificationsService) { }
  ngAfterViewInit(): void {

  }

  ngOnInit() {
  }



  openmarker(marker: NFTView) {
    this.dialog.open(NftDetailsComponent, {
      width: '500px',
      data: {
        nft: marker,
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

  scrollMapTo(nft: NFTView) {
    this.googleMap.panTo({
      lat: nft.locationLatitude,
      lng: nft.locationLongitude
    });
    this.zoom = 10;
  }

  filterNFTsBasedOnText(searchText: any) {
    if (!searchText) {
      this.nfts = this.listNfts;
    }
    var text = ((searchText) as string).toLocaleLowerCase();
    this.nfts = this.nfts.filter(
      (el) =>
        el.description.toLocaleLowerCase().includes(text) ||
        el.locationName.toLocaleLowerCase().includes(text) ||
        el.nftName.toLocaleLowerCase().includes(text)
    );
    if (this.nfts.length > 0) {
      this.scrollMapTo(this.nfts[0]);
    }
  }

  buyNFT(nft: NFTView) { }

  sell(nft: NFTView) {
    const diag = this.dialog.open(NftDetailsComponent, {
      width: '500px',
      data: {
        nft: nft,
        displayPrice: true
      },
      disableClose: false,
      autoFocus: true
    })
    diag.afterClosed().subscribe(res => {
      if (res && res > 0) {

        this.notificationsService.showToast('Confirm the transaction for selling this NFT, after confirmation and succesfull transaction your NFT will be added to the sell list.', 'info');
        this.walletService.sendNft(environment.eTravelWallet, nft.nonce).then(responseTx => {
          if (responseTx.status.isExecuted()) {
            this.loadingService.show();
            this.notificationsService.showToast('Your NFT is being added to sell list.', 'info');
            this.nftsService.addNftToSale(nft.id, res, responseTx.hash).subscribe(response => {
              this.loadingService.hide();
              this.notificationsService.showToast('Your NFT was succesfully added to sell list.', 'success');
              nft.isForSale = true;
            })
          }
        });
      }
    })
  };

  retractSell(nft: NFTView) {
    this.loadingService.show();
    this.notificationsService.showToast('Your NFT is being returned to your wallet and retracted from the sale.', 'info');
    this.nftsService.retractNftFromSale(nft.id).subscribe(response => {
      this.loadingService.hide();
      this.notificationsService.showToast('Your NFT was succesfully returned to your wallet.', 'success');
      nft.isForSale = false;
    })
  }

}
