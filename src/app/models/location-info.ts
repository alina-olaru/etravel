import { LocationCoordinates } from "./location-coordinates";

export class LocationInfo {
  locationName?: string = "";
  // description?: string = "";
  coordinates: LocationCoordinates = { latitude: 0, longitude: 0 };
  public  areConditionSatisfied(): boolean {
    // TODO POATE FACEM VALIDARI
    if (this.locationName && this.locationName?.length >=1 && this.coordinates &&  this.coordinates?.latitude  && this.coordinates && this.coordinates?.longitude) {
      return true;
    }
    return false;
  }
}
