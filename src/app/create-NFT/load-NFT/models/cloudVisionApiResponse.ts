import { LandmarkAnnotation } from "./LandmarkAnnotation"

export class CloudVisionApiItemResponse{
  landmarkAnnotations : LandmarkAnnotation[]=[];
}
export class CloudVisionApiResponse{
  responses : CloudVisionApiItemResponse[]=[];
}

