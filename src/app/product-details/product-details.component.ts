import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: any;
  productQuantity: number = 1
  quantity: number = 1;
  removeCart = false;
  cartData:any;
  constructor(private Aroute: ActivatedRoute, private service: ProductService, private toaster: ToastrService,private product:ProductService) { }
  id: any;
  productDetail: undefined | product
  ngOnInit(): void {
    this.id = this.Aroute.snapshot.paramMap.get('id')
    console.log(this.id);

    this.service.getProduct(this.id).subscribe(result => {
      console.log(result);
      this.productData = result
      this.productDetail = result
      let cartData = localStorage.getItem('localCart');
      if (this.id && cartData) {
        let item = JSON.parse(cartData);
        item = item.filter((item: any) => this.id == item?.id?.toString())
        if (item.length) {
          this.removeCart = true
        } else {
          this.removeCart = false
        }
      }
      let user = localStorage.getItem('user');
      if(user){
      let userId = user && JSON.parse(user).id;
      this.product.getCartList(userId);
      this.product.cartData.subscribe((result)=>{
        let item = result.filter((item:product)=>this?.id?.toString()===item?.productId?.toString())
        if(item.length){
         this.cartData=item[0];
          this.removeCart=true
        }
      })
      }
    })
  }
  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1
    }
    else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1

    }
  }
  AddToCart() {
    if (this.productDetail) {
      this.productDetail.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.service.localAddToCart(this.productDetail);
        this.removeCart = true;
      } else {
        console.warn('user is logged in');
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id
        console.warn(userId);
        console.log(this.productData)
        let cartData: any = {
          ...this.productData,
          userId,
          productId: this.productData.id,
        }
        console.warn(cartData);
        delete cartData.id;
        console.warn(cartData);
        this.service.AddToCart(cartData).subscribe((result) => {
          console.warn(result);
          if (result) {
            this.product.getCartList(userId);
            this.removeCart=true
            // alert('product is added in cart'); 
            this.toaster.success('Product Add to Cart Successfully')
          }

        })



      }
    }
  }
  RemoveToCart(productId: any) {
    if (!localStorage.getItem('user')) {
    this.service.remoteItemFromCart(productId)
    }else{
      console.warn("cartData",this.cartData);
      console.log(productId);
      console.log(this?.cartData?.id);
      
      this.product.removeToCart((this?.cartData?.id))
      .subscribe((result)=>{
        console.log(result);
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        this.product.getCartList(userId)
      },err=>{
        console.log(err);
           let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        this.product.getCartList(userId)
      })
    }
    this.removeCart = false
  }
}