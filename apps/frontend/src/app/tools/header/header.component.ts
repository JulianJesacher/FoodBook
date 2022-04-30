import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AuthenticatorServiceInterface } from '../../services/authService/authenticator.service';
import { AuthenticatorComponent } from '../authenticator/authenticator.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private loginSheet: MatBottomSheet,
    public authService: AuthenticatorServiceInterface) { }

  ngOnInit(): void {

  }

  onLoginClick() {
    this.loginSheet.open(AuthenticatorComponent)
  }

}
