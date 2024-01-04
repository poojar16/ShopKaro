import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data type';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(private product: ProductService) { }
  ngOnInit(): void {
this.getpanel()
this.trendyProduct()
console.log();

  }
  panelList: product | any;
  getpanel() {
    this.product.popularProducts().subscribe((res: product | any) => {
      this.panelList=res;
      console.log(this.panelList);
      
    })
  }
  productList: any | product
  trendyProduct() {
    this.product.productList().subscribe(res => {
      this.productList = res
    })
  }

}


