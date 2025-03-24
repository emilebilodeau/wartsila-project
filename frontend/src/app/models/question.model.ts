export interface Question {
  id: number;
  type: 'linear' | 'yesno' | 'text' | 'number';
  question: string;
}
