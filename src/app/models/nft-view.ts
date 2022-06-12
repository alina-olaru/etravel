import { NumberValueAccessor } from "@angular/forms";

export class NFTView{
  id:string;
  nonce:number;
  owner:string;
  nftName:string;
  description:string;
  locationName:string;
  locationLatitude:number;
  locationLongitude:number;
  ipfsCID:string;
  fileName:string;
  creationFeeTxId:string;
  transferTxId:string;
  tags:Tag[];
  nftSales:NftSale[];
  position:{
    lat:number,
    lng:number
  };
  options:any = {};
  imgUrl:string;
  isForSale: boolean;
  constructor(){
    this.tags=[];
    this.nftSales=[];
    this.id="";
    this.creationFeeTxId = "";
    this.description="";
    this.nftName="";
    this.nonce = 1;
    this.owner="";
    this.locationLatitude=0;
    this.locationLongitude=0;
    this.locationName="";
    this.fileName="";
    this.ipfsCID="";
    this.transferTxId="";
    this.position = {
      lat:this.locationLatitude,
      lng:this.locationLongitude
    }
    // <!-- todo FIX img src for nft -->
    this.imgUrl = "";
    this.isForSale = false;
  }

}

export class Tag{
  id:number;
  name:string;
  constructor(){
    this.id=1;
    this.name="";
  }
}
export class NftSale{
  id: number;
  nftId:string;
  nft: NFTView;
  price:number;
  status:number;
  creationTxId:string;
  soldTxId:string;
  soldFeeTxId:string;
  retractTxId:number;
  constructor(){
    this.id = 0;
    this.nftId = "";
    this.nft = new NFTView();
    this.price=0;
    this.status=0;
    this.creationTxId="";
    this.soldFeeTxId="";
    this.soldTxId="";
    this.retractTxId =0;
  }
}
