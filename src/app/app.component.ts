import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ImageData } from './models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  images$: Observable<ImageData[]>
  query: string;
  isLoading = false;

  constructor(private httpClient: HttpClient) {}

  search() {
    this.isLoading = true;
    this.images$ = this.httpClient.get(`https://images-api.nasa.gov/search?q=${this.query}`)
      .pipe(
        tap(() => {
          this.isLoading = false;
        }),
        map(this.nasaImageDataToImageData)
      );
  }

  private nasaImageDataToImageData(data: any): ImageData[] {
    // We have to make sure that the dat object returned by the server has all the properties we need to access
    if (data && data.collection && data.collection.items) {
      // Iterating over the images array
      return data.collection.items
        .map(item => {
          if (item.links) {
            // We need to find an object in the 'link' array of type 'preview
            const link = item.links.find(link => link.rel === 'preview');
            return (link) ? { id: 1, uri: link.href } : null;
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
