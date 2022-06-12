import { BoundingPoly } from "./BoundingPoly";
import { GoogleVisionApiLocation } from "./GoogleVisionApiLocation";
import { LatLngGV } from "./LatLngGV";

export class LandmarkAnnotation {
  mid: string = '';
  description: string = '';
  score: number = 0;
  boundingPoly: BoundingPoly = new BoundingPoly();
  locations: GoogleVisionApiLocation[] = [];
  latLongMap: google.maps.LatLngLiteral  = {lat: 0, lng: 0};
}


