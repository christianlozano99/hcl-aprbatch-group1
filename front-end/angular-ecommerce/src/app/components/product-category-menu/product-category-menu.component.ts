import { Component, OnInit } from '@angular/core';
import {ProductCategory} from "../../common/product-category";
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  productCategories: ProductCategory[];
  product_1: Product[];
  product_2: Product[];
  product_3: Product[];
  product_4: Product[];
  constructor(private productService:ProductService) { }

  ngOnInit() {
    this.listProductCategories();
    this.listProducts();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data))
        this.productCategories=data
      }
    )
  }
  listProducts() {
    for (let i = 1; i < 5; i++) {
      this.productService.getProductList(i).subscribe(
        data=>{
          console.log(`Product Details= ${JSON.stringify(data)}`)
          this["product_"+i] = data;
        }
      )
    }


  }
}
