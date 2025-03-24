export interface Question {
  id: string;
  type: 'linear' | 'yesno' | 'text' | 'number';
  question: string;
}
