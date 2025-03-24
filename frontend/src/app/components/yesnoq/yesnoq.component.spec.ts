import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesnoqComponent } from './yesnoq.component';

describe('YesnoqComponent', () => {
  let component: YesnoqComponent;
  let fixture: ComponentFixture<YesnoqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YesnoqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YesnoqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
