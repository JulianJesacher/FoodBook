import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithErrorComponent } from './input-with-error.component';

describe('InputWithErrorComponent', () => {
  let component: InputWithErrorComponent;
  let fixture: ComponentFixture<InputWithErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputWithErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWithErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
