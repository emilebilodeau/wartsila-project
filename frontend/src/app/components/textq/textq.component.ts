import { Component, Input } from '@angular/core';
import { Question } from '../../models/question.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textq',
  imports: [ReactiveFormsModule],
  templateUrl: './textq.component.html',
  styleUrl: './textq.component.scss',
})
export class TextqComponent {
  @Input() question!: Question;
  @Input() control!: FormControl;
}
