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

export function getSortedCart() {
  let sessionCart = JSON.parse(sessionStorage.getItem('cart') || '{}')
  let sortedSessionCart = sessionCart.sort((itemA: { score: number; }, itemB: { score: number; }) => (itemA.score < itemB.score) ? 1 : (itemA.score > itemB.score) ? -1 : 0);
  if (sortedSessionCart.length > 0) {
    return sortedSessionCart;
  } else {
    return null;
  }
}

export function setCart(cart: Product[], ordersService: OrdersService) {
  ordersService.getAllOrderProducts().subscribe(
    (response: OrderProduct[]) => {
      let scoreValues = 5;
      let scoreQuantities = 1;
      let index = 0;
      let newCart: Product[] = [];

      cart.forEach(product => {

        response.forEach((orderProduct) => {

          if (product.id === orderProduct.productId) {
            scoreValues = scoreValues + orderProduct.score;
            scoreQuantities++;
            index = cart.indexOf(product);
          }
        });

        let updatedProduct: Product = {
          id: product.id,
          name: product.name,
          value: product.value,
          type: product.type,
          quantity: product.quantity,
          stock: product.stock,
          score: scoreValues / scoreQuantities,
          image: product.image
        }

        newCart.push(updatedProduct);
        scoreValues = 5;
        scoreQuantities = 1;
      });

      sessionStorage.setItem('cart', JSON.stringify(newCart));
    },
    (error: HttpErrorResponse) => {
      alert(error.message);
    }
  );

}

export function getUser() {
  let user = JSON.parse(sessionStorage.getItem('user') || '{}')
  if (user) {
    return user;
  } else {
    return null;
  }
}

export function setUser(user: any) {
  sessionStorage.setItem('user', JSON.stringify(user));
}