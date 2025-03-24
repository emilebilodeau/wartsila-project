import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberqComponent } from './numberq.component';

describe('NumberqComponent', () => {
  let component: NumberqComponent;
  let fixture: ComponentFixture<NumberqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
