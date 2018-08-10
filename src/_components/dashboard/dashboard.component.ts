import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../_services/posts.service';
import { UsersService } from '../../_services/users.service';
import { Post } from '../../_models/posts.interface';
import { User } from '../../_models/users.interface';

import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  posts: Post[] = [];
  post: Post;
  loggedUser: User;

  date: string;
  
  titleClicks: number = 0;

  selectDate: boolean = false;
  selectAuthor: boolean = false;
  selectCategory: boolean = false;
  isPending: boolean = true;
  

  titleSortOrder: string = "asc";
  dateSortOrder: string = "desc";
  currentURL: string = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder;

  constructor(private postsService: PostsService,
    private usersService: UsersService,
    private router: Router,
    private localStorage: LocalStorage) { }

  ngOnInit() {

    this.loggedUser = this.usersService.loggedUser;
    
    //if admin show pending posts, else show approved posts
    if (this.loggedUser.isAdmin == true) {
      this.onGetPending(this.currentURL);
    } else {
      this.onGetApproved(this.currentURL);
    }

    this.date = this.getDate();

  }

  getDate() {
    let date = new Date(Date.now());
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10 && day < 10) {
      return "0" + month.toString() + "/0" + day.toString() + "/" + date.getFullYear().toString();
    } else if (month < 10 && day > 9) {
      return "0" + month.toString() + "/" + day.toString() + "/" + date.getFullYear().toString();
    } else if (month > 9 && day < 10) {
      return month.toString() + "/0" + day.toString() + "/" + date.getFullYear().toString();
    } else {
      return month.toString() + "/" + day.toString() + "/" + date.getFullYear().toString();
    }


  }

  onGetPending(url) {
    this.postsService
      .getPendingPosts(url)
      .subscribe((data: Post[]) => {
        this.posts = data;
        this.postsService.posts = data;
      })
  }

  onGetApproved(url) {
    this.postsService
      .getApprovedPosts(url)
      .subscribe((data: Post[]) => {
        this.posts = data;
        this.postsService.posts = data;
      })
  }

  onGetPostsForUser(date, author, category, dateSort) {

    if (dateSort == "Latest") {
      this.dateSortOrder = "desc";
    } else if (dateSort == "Earliest") {
      this.dateSortOrder = "asc";
    }

    this.titleClicks += 1; //increment clicks for title for toggling sort order

    if (this.titleClicks % 2 == 0) {
      this.titleSortOrder = "asc";
    } else if (this.titleClicks % 2 != 0) {
      this.titleSortOrder = "desc";
    }

    //if nothing will be filtered
    if (this.selectDate == false && this.selectAuthor == false && this.selectCategory == false) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder;
      this.onGetApproved(this.currentURL);

      //if only the date will be filtered
    } else if (this.selectDate == true && this.selectAuthor == false && this.selectCategory == false) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&date=" + date;
      this.onGetApproved(this.currentURL);

      //if only the author will be filtered
    } else if (this.selectDate == false && this.selectAuthor == true && this.selectCategory == false) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&author=" + author;
      this.onGetApproved(this.currentURL);

      //if only the category will be filtered  ----> CATEGORY FILTER IS FOR BLOGGERS ONLY
    } else if (this.selectDate == false && this.selectAuthor == false && this.selectCategory == true) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&category=" + category;
      this.onGetApproved(this.currentURL);

      //if only the date & author will be filtered
    } else if (this.selectDate == true && this.selectAuthor == true && this.selectCategory == false) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&date=" + date + "&author=" + author;
      this.onGetApproved(this.currentURL);

      //if only the date & category will be filtered ----> CATEGORY FILTER IS FOR BLOGGERS ONLY
    } else if (this.selectDate == true && this.selectAuthor == false && this.selectCategory == true) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&date=" + date + "&category=" + category;
      this.onGetApproved(this.currentURL);

      //if only the author & category will be filtered ----> CATEGORY FILTER IS FOR BLOGGERS ONLY
    } else if (this.selectDate == false && this.selectAuthor == true && this.selectCategory == true) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&author=" + author + "&category=" + category;
      this.onGetApproved(this.currentURL);

      //if everything will be filtered ----> CATEGORY FILTER IS FOR BLOGGERS ONLY
    } else if (this.selectDate == true && this.selectAuthor == true && this.selectCategory == true) {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&author=" + author + "&category=" + category + "&date=" + date;
      this.onGetApproved(this.currentURL);

    }

  }//end onGetPosts

  onGetPostsForAdmin(date, author, posts, dateSort) {


    if (posts == 'Pending') {
      this.isPending = true;
    } else if (posts == 'Approved') {
      this.isPending = false;
    }

    if (dateSort == "Latest") {
      this.dateSortOrder = "desc";
    } else if (dateSort == "Earliest") {
      this.dateSortOrder = "asc";
    }

    this.titleClicks += 1; //increment clicks for title for toggling sort order

    if (this.titleClicks % 2 == 0) {
      this.titleSortOrder = "asc";
    } else if (this.titleClicks % 2 != 0) {
      this.titleSortOrder = "desc";
    }

    //if only pending posts are filtered
    if (this.selectDate == false && this.selectAuthor == false && posts == 'Pending') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder;
      this.onGetPending(this.currentURL);

      //if only the date will be filtered for pending posts
    } else if (this.selectDate == true && this.selectAuthor == false && posts == 'Pending') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&date=" + date;
      this.onGetPending(this.currentURL);

      //if only the author will be filtered for pending posts
    } else if (this.selectDate == false && this.selectAuthor == true && posts == 'Pending') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&author=" + author;
      this.onGetPending(this.currentURL);

      //if only the date & author will be filtered for pending posts
    } else if (this.selectDate == true && this.selectAuthor == true && posts == 'Pending') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&date=" + date + "&author=" + author;
      this.onGetPending(this.currentURL);

      //if only approved posts are filtered
    } else if (this.selectDate == false && this.selectAuthor == false && posts == 'Approved') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder;
      this.onGetApproved(this.currentURL);

      //if only the date will be filtered for approved posts
    } else if (this.selectDate == true && this.selectAuthor == false && posts == 'Approved') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&date=" + date;
      this.onGetApproved(this.currentURL);

      //if only the author will be filtered for approved posts
    } else if (this.selectDate == false && this.selectAuthor == true && posts == 'Approved') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&author=" + author;
      this.onGetApproved(this.currentURL);

      //if only the date & author will be filtered for approved posts
    } else if (this.selectDate == true && this.selectAuthor == true && posts == 'Approved') {

      this.currentURL = "&_sort=date,title&_order=" + this.dateSortOrder + "," + this.titleSortOrder + "&date=" + date + "&author=" + author;
      this.onGetApproved(this.currentURL);

    }

  }//end onGetPosts

  onGoToEditPage(post) {
    this.postsService.post = post;
    this.router.navigate(['/', 'edit-post']);
  }//end on GoToEditPage

  onDeletePost(post) {
    this.posts = this.posts.filter(h => h !== post);
    this.postsService.deletePost(post).subscribe();
  }

  onGoToDetailsPage(post) {
    this.postsService.post = post;
    this.router.navigate(['/', 'view-post']);
  }//end on GoToEditPage

}
