import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudVisionApiResponse } from 'src/app/create-NFT/load-NFT/models/cloudVisionApiResponse';
import { GoogleVisionApiLocation } from 'src/app/create-NFT/load-NFT/models/GoogleVisionApiLocation';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  private root: string = environment.apiUrl + 'Maps';

  constructor(private http: HttpClient) { }

  getLandmarksForImage(file: File | null): Observable<CloudVisionApiResponse> {
    let formData: FormData = new FormData();
    formData.append('file', file!);
    return this.http.post<CloudVisionApiResponse>(this.root + '/checkLandmark', formData);
  }

}
