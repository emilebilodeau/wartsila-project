import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearqComponent } from './linearq.component';

describe('LinearqComponent', () => {
  let component: LinearqComponent;
  let fixture: ComponentFixture<LinearqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinearqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinearqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
