import { Component } from '@angular/core';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-form',
  imports: [],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  // hard coding for now
  questions: Question[] = [
    {
      id: 1,
      type: 'linear',
      question: 'how are you feeling today?',
    },
    {
      id: 2,
      type: 'number',
      question: 'how many hours did you sleep?',
    },
    {
      id: 3,
      type: 'yesno',
      question: 'was your sleep disrupted/woke up during the night?',
    },
  ];

  // from GPT, not sure how this works for now but it looks like the...
  // ... path i want to take
  // answersForm: FormGroup = this.fb.group({});
  // isLoading = true;

  // constructor(private http: HttpClient, private fb: FormBuilder) {}

  // ngOnInit(): void {
  //   this.http.get<Question[]>('/api/survey/questions').subscribe((data) => {
  //     this.questions = data;
  //     this.buildForm();
  //     this.isLoading = false;
  //   });
  // }

  // buildForm(): void {
  //   this.questions.forEach((q) => {
  //     this.answersForm.addControl(q.id, this.fb.control('', Validators.required));
  //   });
  // }

  // onSubmit(): void {
  //   if (this.answersForm.valid) {
  //     const responses = this.answersForm.value;
  //     this.http.post('/api/survey/submit', responses).subscribe((res) => {
  //       alert('Submitted successfully!');
  //     });
  //   }
  // }
  onSubmit(): void {
    alert('Submitted');
  }
}
