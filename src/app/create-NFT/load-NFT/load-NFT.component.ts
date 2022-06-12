import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CloudVisionApiItemResponse, CloudVisionApiResponse } from './models/cloudVisionApiResponse';
import { hardcodedCloudVisionApiResponse } from './cloudVisionApiHardcodedResponse';
import { MapInfoWindow, GoogleMap } from '@angular/google-maps';
import exifr from 'exifr'
import { NftsService } from '../../services/nfts/nfts.service';
import { WalletService } from '../../services/wallet/wallet.service';
import { environment } from 'src/environments/environment';
import { NftAttributes } from 'src/app/models/nft-attributes';
import { LocationInfo } from 'src/app/models/location-info';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { LandmarkAnnotation } from './models/LandmarkAnnotation';
import { ReturnStatement } from '@angular/compiler';
import { LoadingService } from '../../services/loading.service';
import { NotificationsService } from '../../services/notifications.service';
import { Router } from '@angular/router';
import { MapsService } from '../../services/maps/maps.service';
import { LatLngGV } from './models/LatLngGV';
@Component({
  selector: 'app-load-NFT',
  templateUrl: './load-NFT.component.html',
  styleUrls: ['./load-NFT.component.scss']
})
export class LoadNFTComponent implements OnInit, AfterViewInit {

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
    maxZoom: 18,
    minZoom: 8,
  };

  url: any; //Angular 11, for stricter type
  msg = "";
  file: File | null = null;

  nftAttributes: NftAttributes = new NftAttributes();
  locationInfo: LocationInfo = new LocationInfo();

  cloudVisionApiResponse: CloudVisionApiResponse = hardcodedCloudVisionApiResponse;
  locations: LandmarkAnnotation[] = [];
  selectedLocation: LandmarkAnnotation | undefined;
  // tag chips

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];

  @ViewChild('fruitInput')
  tagInput!: ElementRef<HTMLInputElement>;

  // location

  locationNameFC = new FormControl();
  latitudefc = new FormControl();
  longitudefc = new FormControl();

  constructor(private nftsService: NftsService, private walletService: WalletService, private loadingService: LoadingService, private notificationsService: NotificationsService,
    private router: Router,
    private mapsService: MapsService) {

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );

  }
  ngAfterViewInit(): void {
    this.googleMap.panTo({
      lat: 41.403706,
      lng: 2.173504
    });
    this.zoom = 10;
  }

  nftNameFC = new FormControl();
  nftDescFC = new FormControl();
  ngOnInit() {

    this.nftDescFC.valueChanges.subscribe((value: any) => {
      this.nftAttributes.description = value;
    })
    this.nftNameFC.valueChanges.subscribe((value: any) => {
      this.nftAttributes.nft_name = value;
    })
  }

  async uploadFile(event: any) {

    await this.addFile(event)
  }
  async addFile(fileContent: any) {

    let fd = new FormData();
    fd.append('files', fileContent);
  }

  selectFile(event: any) { //Angular 11, for stricter type
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    var mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    var reader = new FileReader();
    this.file = event.target.files[0];
    this.getResultsFromGoogleVisionApi(this.file!);
    reader.readAsDataURL(event.target.files[0]);

    exifr.parse(event.target.files[0]).then(result => {
      console.log(result);
    })


    reader.onload = (_event) => {
      this.msg = "";
      this.url = reader.result;
    }


  }

  getResultsFromGoogleVisionApi(file: File) {
    this.mapsService.getLandmarksForImage(file).subscribe(
      response => {
        this.cloudVisionApiResponse = response;
        this.locations = this.cloudVisionApiResponse.responses[0].landmarkAnnotations.map(loc => {
          return {
            ...loc,
            latLongMap:  {
              lat: loc.locations[0].latLng.latitude,
              lng: loc.locations[0].latLng.longitude
            } as google.maps.LatLngLiteral
          }
        });
        let biggestScoreLocation = this.locations.reduce((prev, curr) => {
          return prev.score > curr.score ? prev : curr;
        });
        this.selectMarker(biggestScoreLocation);
        setTimeout(() => {
          this.scrollToResult();
        }, 100);

      }
    );
    //update values for inputs

  }
  scrollToResult() {
    if (!this.selectedLocation) {
      return;
    }
    this.googleMap.panTo({
      lat: this.selectedLocation.latLongMap.lat,
      lng: this.selectedLocation.latLongMap.lng
    });

    this.zoom = 30;


  }

  createNft() {
    if (!this.areConditionSatisfied()) {
      return;
    }
    this.loadingService.show();
    this.notificationsService.showToast("Your NFT is being created, please wait...", 'info')
    this.walletService.sendEgld(environment.eTravelWallet, 0.05).then(response => {
      if (response.status.isExecuted()) {

        this.nftsService.createNft(this.file!, response.hash, this.locationInfo, this.nftAttributes).subscribe(response => {
          this.notificationsService.showToast("Your NFT has been created", 'success');
          this.router.navigate(['/my-nfts']);
          this.loadingService.hide();
        },
          error => {
            this.loadingService.hide();
          });
      }
    })

  }
  public areConditionSatisfied(): boolean {

    if (this.locationInfo.areConditionSatisfied() && this.nftAttributes.areConditionSatisfied()) {
      return true;
    }
    return false;
  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value);
      this.nftAttributes.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.tags.indexOf(fruit);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.nftAttributes.tags.splice(index, 1);
    }
  }

  selected(event: any): void {
    this.nftAttributes.tags.push(event.option.viewValue);
    this.tags.push(event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tagg => tagg.toLowerCase().includes(filterValue));
  }
  selectMarker(landmark: LandmarkAnnotation) {
    this.selectedLocation = landmark;
    //update values for inputs
    if (!this.locationInfo) {
      return;
    }
    this.locationInfo.coordinates.latitude = this.selectedLocation.locations[0].latLng.latitude;
    this.locationInfo.coordinates.longitude = this.selectedLocation.locations[0].latLng.longitude;
    this.locationInfo.locationName = this.selectedLocation.description;

    this.nftAttributes.nft_name = this.selectedLocation.description;

    this.locationNameFC.setValue(this.selectedLocation.description);
    this.locationNameFC.updateValueAndValidity();

    this.latitudefc.setValue(this.selectedLocation.locations[0].latLng.latitude);
    this.latitudefc.updateValueAndValidity();

    this.longitudefc.setValue(this.selectedLocation.locations[0].latLng.longitude);
    this.longitudefc.updateValueAndValidity();
  }
}
