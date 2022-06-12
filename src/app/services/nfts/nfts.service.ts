import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { NftAttributes } from 'src/app/models/nft-attributes';
import { LocationInfo } from 'src/app/models/location-info';
import { NftSale, NFTView } from 'src/app/models/nft-view';
import { Observable } from 'rxjs/internal/Observable';
import { WalletQuery } from '../wallet/wallet.query';
import { Address } from '@elrondnetwork/erdjs/out';
import { off } from 'process';
import { map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NftsService {

  private root: string = environment.apiUrl + 'Nft';

  constructor(private http: HttpClient,
    private walletQuery: WalletQuery) { }

  createNft(file: File, feeTxId: string, locationInfo: LocationInfo, nftAttributes: NftAttributes) {
    let formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('nftAttributes', JSON.stringify({
      nft_name: nftAttributes.nft_name,
      location_name: locationInfo.locationName,
      description: nftAttributes.description,
      tags: nftAttributes.tags,
      coordinates: locationInfo.coordinates
    }));
    let wallet = this.walletQuery.getValue();
    if (!wallet) {
      return of({});
    }
    let bech32 = wallet?.account?.address.bech32();
    if (!bech32) {
      return of({});
    }
    formData.append('wallet', bech32);
    formData.append('feeTxId', feeTxId);
    return this.http.post(this.root, formData);
  }

  getNFTsByAccount(accountAddress: string): Observable<NFTView[]> {
    return this.http.get<NFTView[]>(this.root + "/" + accountAddress).pipe(map(items => {
      return items.map(item => {

        return {
          ...item,
          imgUrl: `https://${item.ipfsCID}.ipfs.nftstorage.link/${item.fileName}`
        }
      });
    }));
  }

  getNftDetails(nftId: string): Observable<NFTView> {
    return this.http.get<NFTView>(this.root + "/NftDetails/" + nftId).pipe(map(item => {
      return {
        ...item,
        imgUrl: `https://${item.ipfsCID}.ipfs.nftstorage.link/${item.fileName}`
      }
    }));
  }

  getNftsForSale(): Observable<NftSale[]> {
    return this.http.get<NftSale[]>(this.root + "/NftsForSale").pipe(map(items => {
      return items.map(item => {
        item.nft.imgUrl = `https://${item.nft.ipfsCID}.ipfs.nftstorage.link/${item.nft.fileName}`;
        return item;
      });
    }));
  }

  addNftToSale(nftId: string, price: number, creationTxId: string): Observable<NftSale> {
    return this.http.post<NftSale>(this.root + "/AddToSale", {
      NftId: nftId,
      Price: price,
      CreationTxId: creationTxId
    }).pipe(map(item => {
      item.nft.imgUrl = `https://${item.nft.ipfsCID}.ipfs.nftstorage.link/${item.nft.fileName}`;
      return item;
    }));
  }

  retractNftFromSale(nftId: string): Observable<NftSale> {
    return this.http.delete<NftSale>(this.root + "/RetractNft/" + nftId).pipe(map(item => {
      item.nft.imgUrl = `https://${item.nft.ipfsCID}.ipfs.nftstorage.link/${item.nft.fileName}`;
      return item;
    }));
  }


  buyNft(nftSaleId: number, wallet: string): Observable<NftSale> {
    return this.http.post<NftSale>(this.root + "/BuyNft", {
      NftSaleId: nftSaleId,
      Wallet: wallet
    }).pipe(map(item => {
      item.nft.imgUrl = `https://${item.nft.ipfsCID}.ipfs.nftstorage.link/${item.nft.fileName}`;
      return item;
    }));
  }

}
