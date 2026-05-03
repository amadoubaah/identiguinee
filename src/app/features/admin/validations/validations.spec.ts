import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Validations } from './validations';

describe('Validations', () => {
  let component: Validations;
  let fixture: ComponentFixture<Validations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Validations],
    }).compileComponents();

    fixture = TestBed.createComponent(Validations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
