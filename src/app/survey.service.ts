import { Injectable } from '@angular/core';
import { Survey } from './survey.model';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

@Injectable()
export class SurveyService {

  surveys: Survey[] = [];
  sortBy: SortBy = SortBy.Title;

  constructor(private http: Http) { }

  getSurveys(): Promise<Survey[]> {
    return new Promise<Survey[]>((resolve, reject) => {
      if (this.surveys.length === 0) {
        this.fetchSurveys().then((surveys) => {
          this.surveys = surveys;
          resolve(this.surveys);
        }).catch(reject);
      } else {
        resolve(this.surveys);
      }
    });
  }

  private fetchSurveys(): Promise<Survey[]> {
    return this.http.get('surveys/all')
      .map(res => res.json() as Survey[])
      .toPromise();
  }

  createSurvey(): Promise<Survey> {
    return this.fetchNewSurvey().then(survey => {
      this.surveys.push(survey);
      return survey;
    });
  }

  private fetchNewSurvey(): Promise<Survey> {
    return this.http.get('surveys/new')
      .map(res => res.json() as Survey)
      .toPromise();
  }

  sortByTitle() {
    this.sortBy = SortBy.Title;
    this.sortSurveys();
  }

  sortByLastAction() {
    this.sortBy = SortBy.LastAction;
    this.sortSurveys();
  }

  sortSurveys() {
    this.surveys = this.surveys.sort((s1: Survey, s2: Survey) => {
      if (this.sortBy === SortBy.Title) {
        return s1.title.localeCompare(s2.title);
      }
      if (this.sortBy === SortBy.LastAction) {
        return s2.lastAction.valueOf() - s1.lastAction.valueOf();
      }
    });
  }
}

enum SortBy {
  LastAction,
  Title
}
