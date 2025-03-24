import { Component, Input } from '@angular/core';
import { Question } from '../../models/question.model';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'app-yesnoq',
  imports: [ReactiveFormsModule],
  templateUrl: './yesnoq.component.html',
  styleUrl: './yesnoq.component.scss',
})
export class YesnoqComponent {
  @Input() question!: Question;
  @Input() control!: FormControl;
}
