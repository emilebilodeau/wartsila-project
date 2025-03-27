import { TestBed } from '@angular/core/testing';

import { SurveyStateService } from './survey-state.service';

describe('SurveyStateService', () => {
  let service: SurveyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
