import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDemandes } from './gestion-demandes';

describe('GestionDemandes', () => {
  let component: GestionDemandes;
  let fixture: ComponentFixture<GestionDemandes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionDemandes],
    }).compileComponents();

    fixture = TestBed.createComponent(GestionDemandes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
