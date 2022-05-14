import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode:boolean = false;
  // new properties for pagination
  thePageNumber:number=1;
  thePageSize:number=5;
  theTotalElements:number=0;

  // @ts-ignore
  previousKeyword:string=null;
  constructor(private productService:ProductService,
              private cartService:CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    //check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    // check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed

    // if we have a different category id than previous
    // the nse t the PageNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber=1;
    }
    this.previousCategoryId=this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePagenumber=${this.thePageNumber}`);

    // now get the products for the given category id
    this.productService.getProductListPaginate(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(
      this.processResult()
    );
  }
  processResult() {
    // @ts-ignore
    return data=> {
      this.products = data._embedded.products;
      this.thePageSize=data.page.number+1;
      this.thePageSize=data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  handleSearchProducts() {
    // @ts-ignore
    const theKeyword:string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyword != theKeyword) {
      this.thePageNumber=1;
    }
    this.previousKeyword=theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)
    // now search for the products using keyword
    this.productService.searchProductListPaginate(this.thePageNumber-1, this.thePageSize, theKeyword).subscribe(this.processResult());
  }


  updatePageSize(pageSize: number) {
    this.thePageSize=pageSize;
    this.thePageNumber=1;
    this.listProducts()
  }

  addToCart(theProduct: Product) {
    // console.log(`Adding to cart : ${theProduct.name}, ${theProduct.unitPrice}`)
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }
}
