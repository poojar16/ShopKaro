import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data type';
import { HttpClient } from '@angular/common/http';
import { skipUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  cartData= new EventEmitter<product[] | []>()

  constructor(private http: HttpClient) { }
  addProduct(data:product){
     return this.http.post('http://localhost:3000/products',data);
  }
  productList(){
    return this.http.get<product[]>('http://localhost:3000/products');
  }
  deleteProduct(id:number){
    return this.http.delete(`http://localhost:3000/products/${id}`)
  }
  getProduct(id:string){
    return this.http.get<product>(`http://localhost:3000/products/${id}`)
  }
  updateProduct(product:product){
    return this.http.put<product>(`http://localhost:3000/products/${product.id}`,product)
  }
  popularProducts(){
    return this.http.get<product[]>("http://localhost:3000/products?_limit=5");
  }
  searchProduct(data:any){
    let url='http://localhost:3000/products?q='
    return this.http.get(`${url}${data}`)
  }
  localAddToCart(data:product){
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if(!localCart){
      localStorage.setItem('localCart',JSON.stringify([data]));
      this.cartData.emit([data]);
    }else{
      cartData=JSON.parse(localCart);
      cartData.push(data)
      localStorage.setItem('localCart',JSON.stringify(cartData)); 
    }
  this.cartData.emit(cartData);
}
remoteItemFromCart(productId:any){
  let cartData = localStorage.getItem('localCart');
  if(cartData){
    let item=JSON.parse(cartData)
    item=item.filter((item:any)=> productId!==item.id )
localStorage.setItem('localCart',JSON.stringify(item))
    this.cartData.emit(item);
  }
  
}
AddToCart(cartData:cart){
  return this.http.post('http://localhost:3000/cart',cartData);
}
getToCart(){
  return this.http.get('http://localhost:3000/cart');

}
getCartList(userId:number){
  return this.http.get<product[]>('http://localhost:3000/cart?userId='+userId,{
    observe:'response'
  }).subscribe((result)=>{
    if(result && result.body){
      this.cartData.emit(result.body);
    }
  })
}
removeToCart(cartId:any){
  return this.http.delete('http://localhost:3000/cart/'+cartId);
}

  currentCart(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId='+userData.id);
    
  }
  orderNow(data:order){
    return this.http.post('http://localhost:3000/orders',data);
  }
  orderList(){
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId='+userData.id);
    

  }
  deleteCartItems(cartId:number){
    return this.http.delete('http://localhost:3000/cart/'+cartId).subscribe((result)=>{
      this.cartData.emit([]);
    });
    

  }
  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId);

  }

}


