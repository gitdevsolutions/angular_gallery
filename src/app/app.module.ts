import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SurveyService } from './survey.service';
import { AppComponent } from './app.component';
import { Http } from '@angular/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SurveyService, Http],
  bootstrap: [AppComponent]
})
export class AppModule { }
