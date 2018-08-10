import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';

import { User } from '../_models/users.interface';
import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

const USER_API: string = 'http://localhost:3000/users';
const LOGGEDUSER_API: string = 'http://localhost:3000/users?isLoggedIn=true';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements OnInit {

  loggedUser: User;
  users: User[];

  constructor(private http: Http,
    private httpClient: HttpClient) { }

  ngOnInit() {
  }
  /*for reading data 
  this.localStorage.getItem<User>('user').subscribe((user) => {
  user.firstName; });
  */
  getUsers(): Observable<User[]> {
    return this.http
      .get(USER_API)
      .pipe(map((response: Response) => response.json()));
  }

  setAsLoggedIn(user: User): Observable<any> {
    return this.httpClient.put(`${USER_API}/${user.id}`, user, httpOptions);
  }

  setAsLoggedOut(user: User): Observable<any> {
    return this.httpClient.put(`${USER_API}/${user.id}`, user, httpOptions);
  }

  getLoggedUser() {
    return this.http
      .get(LOGGEDUSER_API)
      .pipe(map((response: Response) => response.json()));
  }

  updateProfile(user: User): Observable<any> {
    return this.httpClient.put(`${USER_API}/${user.id}`, user, httpOptions)
  }
}