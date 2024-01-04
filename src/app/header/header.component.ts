import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = "";
  userName:string="";
  cartItem = 0;
  constructor(private route: Router, private product: ProductService) { }

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          let sellerdata = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = sellerdata.name
          this.menuType = 'seller';
          console.log(this.sellerName);

        } else if(localStorage.getItem('user')){
          let userStore = localStorage.getItem('user');
        let userdata = userStore && JSON?.parse(userStore)
          this.userName = userdata.name
          this.menuType = 'user';
          this.product.getCartList(userdata.id)

        } else {
          this.menuType = 'default';
        }
      }
    });
    let cartData=localStorage.getItem('localCart');
    if(cartData){
      this.cartItem= JSON.parse(cartData).length;
      console.log(this.cartItem);
      

    }
    this.product.cartData.subscribe((item)=>{
     // console.log(item,'items');
      
      this.cartItem=item.length
    })

    this.getTocart()

  }
cartItems:any;
  getTocart(){
    this.product.getToCart().subscribe((res)=>{
      console.log(res);
      this.cartItems=res
      console.log(this.cartItems);
      
    })
  }
  logout() {
    localStorage.clear()
    this.route.navigate(['/'])
    this.product.cartData.emit([])
  }
  resultList:any;
  searchProduct(data: any) {
    if (data.value) {
      this.product.searchProduct(data.value).subscribe((res) => {
        this.resultList = res
      })
    } else {
      this.resultList = []
    }

  }
  hideSearch() {
    this.resultList = undefined
  }
  submitSearch(val: string) {
    console.warn(val);
    // this.route.navigate([`search/${val}`]);

    this.route.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([`search/${val}`], { queryParams: {} });
  }

  redirectToProduct(id: any) {
    console.log(id);
    // this.route.navigate([`/product/${id}`])

    this.route.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([`/product/${id}`], { queryParams: {} });
  }
}