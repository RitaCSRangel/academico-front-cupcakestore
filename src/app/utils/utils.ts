import { HttpErrorResponse } from "@angular/common/http";
import { OrderProduct } from "../services/orders/order-model";
import { OrdersService } from "../services/orders/orders.service";
import { Product } from "../services/products/product-model";
import { User } from "../services/users/user-model";

export function checkLogin() {

  try {
    const loggedUser: User = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (loggedUser.id != null) {
      return true;
    } else {
      return false
    }
  } catch (e) {
    return false;
  }

}

export function getCart() {
  let sessionCart = JSON.parse(sessionStorage.getItem('cart') || '{}')
  if (sessionCart.length > 0) {
    return sessionCart;
  } else {
    return null;
  }
}

export function setCart(products: any){
    sessionStorage.setItem('cart', JSON.stringify(products));
}

export function getUser() {
  let user = JSON.parse(sessionStorage.getItem('user') || '{}')
  if (user) {
    return user;
  } else {
    return null;
  }
}

export function setUser(user: any){
    sessionStorage.setItem('user', JSON.stringify(user));
}


export function  calculateScore(cart: Product[], ordersService: OrdersService){
  ordersService.getAllOrderProducts().subscribe(
    (response: OrderProduct[]) => {
      let scoreValues = 0;
      let scoreQuantities = 0;
      let index = 0;

      cart.forEach(product =>{

         response.forEach((orderProduct) => {

          if (product.id === orderProduct.productId){
            scoreValues = scoreValues + orderProduct.score;
            scoreQuantities ++;
            index = cart.indexOf(product);
         }
         });
      });
      cart[index].score = scoreValues/scoreQuantities;
      setCart(cart);
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );
}