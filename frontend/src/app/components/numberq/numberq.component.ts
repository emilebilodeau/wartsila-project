import { Component, Input } from '@angular/core';
import { Question } from '../../models/question.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-numberq',
  imports: [ReactiveFormsModule],
  templateUrl: './numberq.component.html',
  styleUrl: './numberq.component.scss',
})
export class NumberqComponent {
  @Input() question!: Question;
  @Input() control!: FormControl;
}
