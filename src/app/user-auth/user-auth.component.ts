import { Component ,OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { login, product, signup } from '../data type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  showLogin:boolean=true
  authError:string="";
  constructor(private user:UserService,private product:ProductService){}
ngOnInit(): void {
  // this.user.userauthreload()
}
signUp(data:signup){
  this.user.userSignup(data)
  
}

login(data:login){
  console.log(data);
  this.user.userLogin(data)
  this.user.invalidUesrAuth.subscribe((result:any)=>{
    if(result){
      this.authError='please enter valid user details'
    }else{
      setTimeout(() => {
        this.localCartToRemoteCart()
      }, 3000);
    }
  })

}
isLogin=false
isSignup=true
openLogin(){
this.isLogin=true
this.isSignup=false
}
openSignup(){
  this.isLogin=false
  this.isSignup=true
}
localCartToRemoteCart(){
  let data = localStorage.getItem('localCart');
  let user = localStorage.getItem('user');
  console.log(user);
  
    let userId= user && JSON.parse(user).id;
  if(data){
    let cartDataList:product[]= JSON.parse(data);
    cartDataList.forEach((product:product,index)=>{
      let cartData:any={
        ...product,
        productId:product.id,
        userId
      }
      delete cartData.id;
      setTimeout(()=>{
        this.product.AddToCart(cartData).subscribe((result:any)=>{
          if(result){
            console.warn("data is stored in db");
            
          }
        })
      },500);
      if(cartDataList.length===index+1){
        localStorage.removeItem('localCart')
      }
    })
  }
  setTimeout(()=>{
    this.product.getCartList(userId)
  },2000);
}
}

