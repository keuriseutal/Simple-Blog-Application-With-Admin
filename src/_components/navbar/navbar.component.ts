import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { PostsService } from '../../_services/posts.service';
import { User } from '../../_models/users.interface';
import { Post } from '../../_models/posts.interface';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Observable } from 'rx';
import { THIS_EXPR } from '../../../node_modules/@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  users: User[];
  loggedUser: User;
  isAdmin: boolean = false;
  date: string;

  //for admin
  // counts posts that must be reviewed by the admin
  pendingPosts: Post[] =[];

  //for user
  // counts posts that are posted today
  latestPosts: Post[] = [];

  // counts the pending posts of the user
  userPendingPosts: Post[] = [];

  // counts the drafts of the user
  drafts: Post[] = [];

  constructor(private usersService: UsersService,
    private router: Router,
    private postsService: PostsService,
    private localStorage: LocalStorage) { }

  ngOnInit() {

    this.usersService
      .getUsers()
      .subscribe((data: User[]) => {
        this.users = data;
      })

    this.loggedUser = this.usersService.loggedUser;

    if (this.loggedUser.isAdmin == true) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    //get pending count
    this.postsService
      .getPendingPosts("")
      .subscribe((data: Post[]) => {
        this.pendingPosts = data;
      })

    //get latest count
    this.date = this.getDate();
    this.postsService
      .getLatestPosts(this.date)
      .subscribe((data: Post[]) => {
        this.latestPosts = data;
      })

    //get pending of user
    this.postsService
      .getPendingPostsOfUser(this.usersService.loggedUser.uname, "")
      .subscribe((data: Post[]) => {
        this.userPendingPosts = data;
      })

    //get drafts
    this.postsService
      .getDrafts(this.usersService.loggedUser.uname)
      .subscribe((data: Post[]) => {
        this.drafts = data;
      })
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


  onLogOut() {
    this.loggedUser.isLoggedIn = false;
    this.usersService.setAsLoggedOut(this.loggedUser).subscribe((data: User) => {
      this.loggedUser = data;
    });
    this.router.navigateByUrl('/login');

  }//end onLogOut

}
