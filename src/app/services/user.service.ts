import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import {  Router } from '@angular/router';
import { login, signup } from '../data type';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  invalidUesrAuth= new EventEmitter<boolean>(false)
  constructor(private http:HttpClient,private router:Router) { }
  userSignup(user:signup){
    this.http.post("http://localhost:3000/users",user,{observe:'response'}).subscribe((result)=>{
      console.warn(result);
      if(result){
        localStorage.setItem('user',JSON.stringify(result.body));
        this.router.navigate(['/'])
        
      }
    })
  }
  userauthreload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/'])
    }
  }
  userLogin(data:login){
    this.http.get<signup[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,
    {observe:'response'})
    .subscribe((result)=>{
      if(result && result.body){
        this.invalidUesrAuth.emit(false)
        localStorage.setItem('user',JSON.stringify(result.body[0]));
        this.router.navigate(['/'])
      }else{
        this.invalidUesrAuth.emit(true)
      }
    })
  }
}