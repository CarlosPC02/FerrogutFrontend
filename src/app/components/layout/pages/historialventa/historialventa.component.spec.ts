import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialventaComponent } from './historialventa.component';

describe('HistorialventaComponent', () => {
  let component: HistorialventaComponent;
  let fixture: ComponentFixture<HistorialventaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialventaComponent]
    });
    fixture = TestBed.createComponent(HistorialventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
