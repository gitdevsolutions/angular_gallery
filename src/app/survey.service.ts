import { Injectable } from '@angular/core';
import { Survey } from './survey.model';

const testSurveys: Survey[] = [
  {
    id: 1,
    title: 'first test survey',
    lastAction: new Date(86400000),
    options: [
      {
        id: 1,
        title: 'first option'
      },
      {
        id: 2,
        title: 'second option'
      }
    ]
  },
  {
    id: 2,
    title: 'second test survey',
    lastAction: new Date(864000002),
    options: [
      {
        id: 1,
        title: 'third option'
      },
      {
        id: 2,
        title: 'fourth option'
      }
    ]
  }

];

@Injectable()
export class SurveyService {

  surveys: Survey[];
  currentId = 100;
  sortBy: SortBy = SortBy.Title;

  getSurveys(): Promise<Survey[]> {
    return new Promise<Survey[]>((resolve, reject) => {
      if (this.surveys) {
        resolve(this.surveys);
      } else {
        this.fetchSurveys().then(() => {
          resolve(this.surveys);
        }).catch(reject);
      }
    });
  }

  fetchSurveys(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.surveys = [];
      testSurveys.forEach((survey) => {
        this.surveys.push(Object.assign({}, survey));
      });
      resolve();
    });
  }

  createSurvey(): Promise<Survey> {
    return this.fetchNewSurvey();
  }

  fetchNewSurvey(): Promise<Survey> {
    return new Promise<Survey>((resolve, reject) => {
      const survey: Survey = new Survey();
      survey.id = this.obtainId();
      survey.lastAction = new Date();
      this.fetchSurveys().then(() => {
        this.surveys.push(survey);
        resolve(survey);
      });
    });
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

  obtainId(): number {
    return this.currentId++;
  }
}

enum SortBy {
  LastAction,
  Title
}
