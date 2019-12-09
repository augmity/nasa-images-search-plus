import { Component } from '@angular/core';

import { NasaImagesService } from './nasa-images.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  query: string;
  
  constructor(public nasaImagesService: NasaImagesService) {}
}
