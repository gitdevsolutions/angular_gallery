import { TestBed, inject, async } from '@angular/core/testing';
import { Survey } from './survey.model';
import { SurveyService } from './survey.service';
import { HttpTestbed, ConnectionMock } from '../http.testbed';

describe('SurveyService', () => {
  beforeEach(() => {
    HttpTestbed.configureTestingModule({
      providers: [SurveyService]
    });
    HttpTestbed.setupConnectionMock('surveys/all', sampleSurveys());
    HttpTestbed.setupConnectionMock('surveys/new', sampleNewSurvey());
  });

  it('should be created', inject([SurveyService], (service: SurveyService) => {
    expect(service).toBeTruthy();
  }));

  it('should load surveys', async(inject([SurveyService], (service: SurveyService) => {
    const surveysPromise: Promise<Survey[]> = service.getSurveys();
    expect(surveysPromise).toBeTruthy();
    surveysPromise.then((surveys: Survey[]) => {
      expect(surveys).toBeTruthy();
    });
  })));

  it('creates a survey', async(inject([SurveyService], (service: SurveyService) => {
    service.createSurvey().then((survey: Survey) => {
      expect(survey).toBeTruthy();
      expect(survey.id).toBeGreaterThan(0);
      expect(survey.lastAction).toBeDefined();
      expect(service.surveys).toContain(survey);
    });
  })));

  it('sorts surveys by title', async(inject([SurveyService], (service: SurveyService) => {
    service.getSurveys().then((surveys: Survey[]) => {
      expect(surveys).toBeTruthy();
      service.sortByTitle();
      expect(service.surveys[0].id).toBe(1);
    });
  })));

  it('sorts surveys by lastAction', async(inject([SurveyService], (service: SurveyService) => {
    service.getSurveys().then((surveys: Survey[]) => {
      expect(surveys).toBeTruthy();
      service.sortByLastAction();
      expect(service.surveys[0].id).toBe(2);
    });
  })));
});

function sampleSurveys() {
  return [{
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
  }, {
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
  }];
};

function sampleNewSurvey(): Survey {
  return {
    id: 2,
    title: 'new test survey',
    lastAction: new Date(864000002),
    options: [
      {
        id: 1,
        title: 'first new option'
      },
      {
        id: 2,
        title: 'second new option'
      }
    ]
  };
}
