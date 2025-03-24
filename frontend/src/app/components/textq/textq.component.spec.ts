import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextqComponent } from './textq.component';

describe('TextqComponent', () => {
  let component: TextqComponent;
  let fixture: ComponentFixture<TextqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
