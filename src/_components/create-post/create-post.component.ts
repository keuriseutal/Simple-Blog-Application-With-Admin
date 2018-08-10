import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../_services/posts.service';
import { UsersService } from '../../_services/users.service';
import { Post } from '../../_models/posts.interface';
import { User } from '../../_models/users.interface';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  loggedUser: User;
  post: Post;
  posts: Post[];
  date: string;
  author: string;

  bodyCount: number = 0;

  msg: string;
  isSuccess: boolean = false;
  isButtonClicked: boolean = false;

  constructor(private usersService: UsersService,  
              private router: Router, 
              private postsService: PostsService,
              private location: Location) {

  }

  ngOnInit() {
    this.author = this.usersService.loggedUser.uname;

    this.usersService
      .getLoggedUser()
      .subscribe((data: User) => {
        this.loggedUser = data;
      })

    //this.author = this.loggedUser.uname;

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

  onInput(body) {
    this.bodyCount = body.length;
  }

  onGoBack() {
    //this.router.navigate(['/', 'dashboard']);
    this.location.back();
  }

  onAddPost(title, subtitle, category, body) {
    this.date = this.getDate();
    this.isButtonClicked = true;
    //check if required fields are filled correctly
    if (body.length >= 100 && title.length != 0) {
      this.msg = "Your post was added successfully";
      this.isSuccess = true;

      this.post = {
        id: 0,
        status: "Pending",
        title: title.toUpperCase(), //to organize sorting... sorting through url organizes uppercased letters first before lowercased letters
        subtitle: subtitle,
        author: this.author,
        category: category,
        date: this.date,
        body: body,
        isDraft: false
      };

      this.postsService.addPost(this.post).subscribe((data: Post) => {
        this.post = data;
      });
    } else if (title.length == 0 && body.length == 0) {
      this.isSuccess = false;
      this.msg = "ERROR! title and body cannot be empty";
    } else if (body.length < 100) {
      this.isSuccess = false;
      this.msg = "ERROR! The body must contain atleast 100 characters";

    } else if (title.length == 0) {
      this.isSuccess = false;
      this.msg = "ERROR! The title must not be empty";
    }
  }

  onSaveAsDraft(title, subtitle, category, body) {
    this.date = this.getDate();
    this.isButtonClicked = true;
    //check if required fields are filled correctly
    if (body.length >= 100 && title.length != 0) {
      this.msg = "Your post was successfully saved as draft";
      this.isSuccess = true;

      this.post = {
        id: 0,
        status: "Pending",
        title: title,
        subtitle: subtitle,
        author: this.author,
        category: category,
        date: this.date,
        body: body,
        isDraft: true
      };

      this.postsService.addPost(this.post).subscribe((data: Post) => {
        this.post = data;
      });
    } else if (title.length == 0 && body.length == 0) {
      this.isSuccess = false;
      this.msg = "ERROR! title and body cannot be empty";
    } else if (body.length < 100) {
      this.isSuccess = false;
      this.msg = "ERROR! The body must contain atleast 100 characters";

    } else if (title.length == 0) {
      this.isSuccess = false;
      this.msg = "ERROR! The title must not be empty";
    }
  }
}


