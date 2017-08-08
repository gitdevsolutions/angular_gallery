import { TestBed, inject, async } from '@angular/core/testing';
import { Survey } from './survey.model';
import { SurveyService } from './survey.service';

describe('SurveyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SurveyService]
    });
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

  it('obtains an id', async(inject([SurveyService], (service: SurveyService) => {
    const id1: number = service.obtainId();
    const id2: number = service.obtainId();
    expect(id1).not.toEqual(id2);
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
