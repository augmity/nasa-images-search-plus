import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { switchMap, map, tap, distinctUntilChanged  } from 'rxjs/operators';

import { ImageData } from './models';


@Injectable({
  providedIn: 'root'
})
export class NasaImagesService {

  private query = new Subject<string>();

  isLoading = false;
  error = null;

  // Define the stream -> when the query stream gets new value, then the image stream gets updated (and so UI)
  images$ = this.query.pipe(
    // Pass the value down the stream only if it's different than the previous one
    distinctUntilChanged(),
    // Set isLoading value
    tap(() => {
      this.isLoading = true;
    }),
    // Do the API call
    switchMap((query) => this.httpClient.get(`https://images-api.nasa.gov/search?q=${query}&media_type=image`)),
    // Parse the result data from the NASA API
    map(this.nasaImageDataToImageData),
    // Clear isLoading value
    tap(() => {
      this.isLoading = false;
    })
  )
  
  constructor(private httpClient: HttpClient) {}

  search(query: string) {
    this.query.next(query);
  }

  private nasaImageDataToImageData(data: any): ImageData[] {
    // We have to make sure that the dat object returned by the server has all the properties we need to access
    if (data && data.collection && data.collection.items) {
      // Iterating over the images array
      return data.collection.items
        .map((item, index) => {
          if (item.links) {
            // We need to find an object in the 'link' array of type 'preview
            const link = item.links.find(link => link.rel === 'preview');
            return (link) ? { id: index.toString(), uri: link.href } : null;
          } else {
            return null;
          }
        })
        .filter(item => item !== null) // Because (even that it shouldn't) some items after mapping may be null
    } else {
      return null;
    }
  }
}
