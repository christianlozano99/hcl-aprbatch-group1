import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class CartService {
  cartItems: CartItem[]=[];

  totalPrice:Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity:Subject<number> = new BehaviorSubject<number>(0);

  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;
  constructor() {
    // read data from storage
    // @ts-ignore
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;
      // computer totals based on the data that is read from storage
      this.computerCartTotals();
    }
  }
  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart
    let alreadyExistsInCart:boolean = false;
    // @ts-ignore
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length >0){
      // find the item in the cart based on item id
      // for (const cartItem of this.cartItems) {
      //   if (cartItem.id === theCartItem.id) {
      //     existingCartItem = cartItem;
      //     break;
      //   }
      // }
      // @ts-ignore
      existingCartItem = this.cartItems.find(tempCartItem=> tempCartItem.id===theCartItem.id);
      // check if we found it
      alreadyExistsInCart = (existingCartItem!=undefined);
    }
    if (alreadyExistsInCart) {
      // increment the quantity
      if((existingCartItem.unitsLeft - existingCartItem.quantity) == 0) {
        alert("Unfortunatly there are only " + existingCartItem.unitsLeft + " albums left for "
                + existingCartItem.name);
      } else {
        existingCartItem.quantity++;
      }

    } else {
      // just add the item to the array
      this.cartItems.push(theCartItem);
    }
    this.computerCartTotals();

  }
  computerCartTotals(){
    let totalPriceValue:number=0;
    let totalQuantityValue:number=0;

    for (const cartItem of this.cartItems) {
      totalPriceValue+= cartItem.quantity*cartItem.unitPrice;
      totalQuantityValue+= cartItem.quantity;
    }

    // public the new values...all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging process
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log(`Contents of the cart`)
    for (const cartItem of this.cartItems) {
      const subTotalPrice = cartItem.quantity * cartItem.unitPrice;
      console.log(`name:${cartItem.name}, quantity=${cartItem.quantity}, unitPrice=${cartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }
    console.log(`totalPrice ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('-----')
  }

  decrementQuantity(tempCartItem:CartItem) {
    tempCartItem.quantity--;
    if (tempCartItem.quantity == 0) {
      this.remove(tempCartItem);
    } else {
      this.computerCartTotals();
    }
  }

  remove(tempCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem=> tempCartItem.id === tempCartItem.id)

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex,1);
      this.computerCartTotals();
    }
  }
}
