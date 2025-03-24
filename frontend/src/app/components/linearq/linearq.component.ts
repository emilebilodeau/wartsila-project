import { Component, Input } from '@angular/core';
import { Question } from '../../models/question.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-linearq',
  imports: [ReactiveFormsModule],
  templateUrl: './linearq.component.html',
  styleUrl: './linearq.component.scss',
})
export class LinearqComponent {
  @Input() question!: Question;
  @Input() control!: FormControl;

  get scale(): number[] {
    const min = this.question.min ?? 1;
    const max = this.question.max ?? 10;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }
}
