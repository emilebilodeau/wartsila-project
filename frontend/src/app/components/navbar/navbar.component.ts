import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SurveyStateService } from '../../state/survey-state.service';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  selectedSurvey: Survey | null = null;
  surveyId: number | null = null;

  constructor(
    private surveyState: SurveyStateService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.surveyState.getSurvey$().subscribe((survey) => {
      this.selectedSurvey = survey;
      this.surveyId = survey?.id ?? null;
    });
  }

  handleNoSurvey(): void {
    alert('Please select a survey first.');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
