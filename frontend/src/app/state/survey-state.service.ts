import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Survey } from '../models/survey.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyStateService {
  private survey$ = new BehaviorSubject<Survey | null>(null);

  setSurvey(survey: Survey | null): void {
    this.survey$.next(survey);
  }

  getSurvey$() {
    return this.survey$.asObservable();
  }

  getCurrentSurvey(): Survey | null {
    return this.survey$.getValue();
  }

  getCurrentSurveyId(): number | null {
    return this.survey$.getValue()?.id ?? null;
  }
}
