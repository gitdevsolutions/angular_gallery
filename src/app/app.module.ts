import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SurveyService } from './survey.service';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SurveyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
