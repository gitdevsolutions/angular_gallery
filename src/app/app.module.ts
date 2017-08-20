import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GalleryGlosujComponent } from './gallery-glosuj/gallery-glosuj.component';

@NgModule({
  declarations: [
    AppComponent,
    GalleryGlosujComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
