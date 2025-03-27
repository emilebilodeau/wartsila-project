import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SurveyStateService } from '../../state/survey-state.service';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  selectedSurvey: Survey | null = null;
  surveyId: number | null = null;
  surveyTitle: string | null = null;

  constructor(private surveyState: SurveyStateService) {}

  ngOnInit(): void {
    this.surveyState.getSurvey$().subscribe((survey) => {
      this.selectedSurvey = survey;
      this.surveyId = survey?.id ?? null;
      this.surveyTitle = survey?.title ?? null;
    });
  }

  handleNoSurvey(): void {
    alert('Please select a survey first.');
  }
}
