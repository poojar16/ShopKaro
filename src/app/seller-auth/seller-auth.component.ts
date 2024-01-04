import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { signup } from '../data type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})

export class SellerAuthComponent implements OnInit {
  ngOnInit(): void { }
  showLogin = false;
  authError: string = ""

  constructor(private seller: SellerService, private router: Router) { }

  signup(data: object): void {
    console.warn(data)

    this.seller.userSignup(data);
  }
  login(data: signup): void {
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = "email or password is not correct"
      }
      console.warn(isError)

    })
    console.warn(data)

  }
  openLogin() {
    this.showLogin = true
  }
  openSignup() {
    this.showLogin = false
  }

}