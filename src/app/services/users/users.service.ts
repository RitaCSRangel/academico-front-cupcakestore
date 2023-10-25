import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from './user-model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiServerUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiServerUrl}/all`);
  }

  public addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/add`, user);
  }

  public updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiServerUrl}/update`, user);
  }

  public loginUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/login`, user);
  }

  public recoverPasswordUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiServerUrl}/recoverpassword`, user);
  }

  public deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiServerUrl}/delete/${userId}`);
  }
}
