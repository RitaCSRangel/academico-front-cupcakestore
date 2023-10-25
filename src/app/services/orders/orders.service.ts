import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, OrderProduct } from './order-model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private apiServerUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  public getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiServerUrl}orders/all`);
  }

  public getAllOrderProducts(): Observable<OrderProduct[]> {
    return this.http.get<OrderProduct[]>(`${this.apiServerUrl}orderproducts/all`);
  }

  public getAllOrderProductsFromOrder(orderId: number): Observable<OrderProduct[]> {
    return this.http.get<OrderProduct[]>(`${this.apiServerUrl}orderproducts/findbyorderid/${orderId}`);
  }

  public getAllOrdersFromUser(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiServerUrl}orders/findbyuserid/${userId}`);
  }

  public addOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.apiServerUrl}orders/add`, order);
  }

  public addOrderProduct(orderProduct: OrderProduct): Observable<OrderProduct> {
    return this.http.post<OrderProduct>(`${this.apiServerUrl}orderproducts/add`, orderProduct);
  }

  public updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiServerUrl}orders/update`, order);
  }

  public updateOrderProduct(orderProduct: OrderProduct): Observable<OrderProduct> {
    return this.http.put<OrderProduct>(`${this.apiServerUrl}orderproducts/update`, orderProduct);
  }

  public deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}orders/delete/${orderId}`);
  }

  public deleteOrderProduct(orderProductId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}orderproducts/delete/${orderProductId}`);
  }
}
