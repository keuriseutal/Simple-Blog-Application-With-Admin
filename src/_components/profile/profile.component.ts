import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { ProfileService } from '../../_services/profile.service';
import { PostsService } from '../../_services/posts.service';

import { User } from '../../_models/users.interface';
import { Post } from '../../_models/posts.interface';

import { Router } from '@angular/router';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  posts: Post[];
  post: Post;
  users: User[];
  loggedUser: User;
  interests: string[];
  msg: string;
  isSuccess: boolean;
  isButtonClicked: boolean = false;

  emailDomain: string;
  isEmail: boolean;
  isUname: boolean;

  oldUname: string;
  oldEmail: string;

  constructor(private usersService: UsersService,
    private postsService: PostsService,
    private router: Router) { }

  ngOnInit() {
    this.loggedUser = this.usersService.loggedUser;
    this.oldUname = this.loggedUser.uname;
    this.oldEmail = this.loggedUser.profile.email;

    this.usersService
      .getUsers()
      .subscribe((data: User[]) => {
        this.users = data;
      })
    
    this.postsService
      .getOldPosts(this.oldUname)
      .subscribe((data: Post[]) => {
        this.posts = data;
      })
  }

  checkEmail(email) {
    //check email contains @
    for (let i = 0; i < email.length; i++) {
      if (email[i] == "@") {
        this.emailDomain = email.substring(i);
        break;

      } else {
        this.msg = "Email is invalid";
        this.emailDomain = "";
        this.isEmail = false;
        continue;
      }//end check if email contains @
    }//end check email LOOP

    //check if domain is @gmail.com
    if (this.emailDomain == "@gmail.com") {
      //check if email is unique
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].profile.email != email || this.oldEmail == email) {
          //this.msg = "Email is VALID";
          this.isEmail = true;
        } else {
          this.msg = "Email is already registered to another user";
          this.isEmail = false;
          break;
        }//end check if email is unique and is not the current email of the user
      }//end LOOP - check if email of other users
    } else {
      this.msg = "Email is invalid";
      this.emailDomain = "";
      this.isEmail = false;
    }//end if domain is not @gmail.com

  }//end checkEmail

  checkUname(uname) {
    //check if username is unique
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].uname != uname || this.oldUname == uname) {
        //this.msg = "Uname is VALID";
        this.isUname = true;
      } else {
        this.msg = "Username is already registered to another user";
        this.isUname = false;
        break;
      }//end check if email contains @
    }//end LOOP - check if uname of other users
  }//end checkUname

  onEditProfile(uname, fname, mname, lname, email, bdate, interests) {
    this.isButtonClicked = true;
    //check if fields are empty
    if (uname.length != 0 && fname.length != 0 && mname.length != 0 && lname.length != 0 && email.length != 0 && interests.length != 0) {

      this.checkEmail(email);
      this.checkUname(uname);

      //update if everything is valid and user is not an admin
      if (this.isEmail && this.isUname && !this.loggedUser.isAdmin) {

        //update profile
        this.usersService.updateProfile(this.usersService.loggedUser).subscribe((data: User) => {
          this.usersService.loggedUser = data;
        });

        //update author of previous posts if uname is changed
        for (let i = 0; i < this.posts.length; i++) {
          this.posts[i].author = uname;
          this.postsService.updatePost(this.posts[i])
            .subscribe((data: Post) => {
              this.post = data;
            });
        }

        this.msg = "Your profile was updated successfully";
        this.isSuccess = true;

      } else if (this.isEmail && this.isUname && this.loggedUser.isAdmin) {

        //update profile
        this.usersService.updateProfile(this.usersService.loggedUser).subscribe((data: User) => {
          this.usersService.loggedUser = data;
        });

        this.msg = "Your profile was updated successfully";
        this.isSuccess = true;

      } else {
        this.isSuccess = false;
        this.msg = "Email or username is invalid";
      }//end if uname or email is invalid

    } else {
      this.isSuccess = false;
      this.msg = "Please make sure that all fields are filled";
    }//end if fields are not empty
  }//end on EditProfile


}
