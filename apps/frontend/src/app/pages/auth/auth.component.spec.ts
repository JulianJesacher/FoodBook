import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { AuthenticatorServiceInterface, TestAuthService } from '../../services/authService/authenticator.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { By } from '@angular/platform-browser';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService: TestAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatBottomSheetModule,
      ],
      declarations: [ AuthComponent ],
      providers: [{provide: AuthenticatorServiceInterface, useClass: TestAuthService}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    authService = TestBed.inject(AuthenticatorServiceInterface) as TestAuthService;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends login request when logging in', () => {
    fixture.debugElement.query(By.css('#login-email')).nativeElement.value ='my-email';
    fixture.debugElement.query(By.css('#login-password')).nativeElement.value ='my-password';
    fixture.debugElement.query(By.css('button')).nativeElement.click();

    expect(authService.loginCount).toBe(1);
  });
});
