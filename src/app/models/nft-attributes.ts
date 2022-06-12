import { LocationCoordinates } from "./location-coordinates";

export class NftAttributes {
  nft_name: string;
  description: string;
  // location_name: string;
  // coordinates: LocationCoordinates;
  tags: string[];
  constructor(){
    this.nft_name = "";
    this.description = "";
    // this.location_name = "";
    // this.coordinates = { latitude: 0, longitude: 0 };
    this.tags = [];
  }
  public areConditionSatisfied(): boolean {
    if (this.nft_name && this.nft_name.length >=1 && this.description && this.description.length >=1 ) {
      return true;
    }
    return false;
  }
}
