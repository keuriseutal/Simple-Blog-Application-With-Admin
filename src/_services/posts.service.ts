import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UsersService } from './users.service';

import { Post } from '../_models/posts.interface';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

//const POST_API_DATESORT: string = 'http://localhost:3000/posts?_sort=date&_order=';
//const POST_API_TITLESORT: string = 'http://localhost:3000/posts?_sort=title&_order=';
const POST_PENDING_API: string = 'http://localhost:3000/posts?isDraft=false&status=Pending';

const POST_PENDING_USER_API: string = 'http://localhost:3000/posts?isDraft=false&status=Pending&author=';
const POST_RETURNED_API: string = 'http://localhost:3000/posts?isDraft=false&status=Returned&author=';

const POST_APPROVED_API: string = 'http://localhost:3000/posts?isDraft=false&status=Approved';

const DRAFT_API: string = 'http://localhost:3000/posts?isDraft=true&author=';

const POSTS_API: string = 'http://localhost:3000/posts';
const POSTS_USER_API: string = 'http://localhost:3000/posts?author=';
const POSTS_TODAY_API: string = 'http://localhost:3000/posts?status=Approved&date=';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  post: Post;
  posts: Post[];

  constructor(private http: Http, private httpClient: HttpClient, private usersService: UsersService) {
   
  }
  
  getPendingPostsOfUser(author: string, filter: string) {
    return this.http
      .get(POST_PENDING_USER_API + author + filter).pipe(map((response: Response) => response.json()));
  }

  getPendingPosts(filter: string) {
    return this.http
      .get(POST_PENDING_API + filter).pipe(map((response: Response) => response.json()));
  }

  getReturnedPosts(author: string, filter: string) {
    return this.http
      .get(POST_RETURNED_API + author + filter).pipe(map((response: Response) => response.json()));
  }

  getApprovedPosts(filter: string) {
    return this.http
      .get(POST_APPROVED_API + filter).pipe(map((response: Response) => response.json()));
  }

  getDrafts(author: string) {
    return this.http
      .get(DRAFT_API + author).pipe(map((response: Response) => response.json()));
  }

  submitDraft(post: Post) {
    return this.httpClient.put(`${POSTS_API}/${post.id}`, post, httpOptions);
  }

  addPost(post: Post): Observable<any> {
    return this.httpClient.post<Post>(POSTS_API, post, httpOptions);
  }

  updatePost(post: Post): Observable<any> {
    return this.httpClient.put(`${POSTS_API}/${post.id}`, post, httpOptions);
  }

  getOldPosts(author: string): Observable<any> {
    return this.http
    .get(POSTS_USER_API + author).pipe(map((response: Response) => response.json()));
  }

  getLatestPosts(date: string): Observable<any> {
    return this.http
    .get(POSTS_TODAY_API + date).pipe(map((response: Response) => response.json()));
  }

  deletePost(post: Post): Observable<any> {
    return this.httpClient.delete<Post>(`${POSTS_API}/${post.id}`, httpOptions);
  }


}





