import { Component, OnInit, TemplateRef } from '@angular/core';
import { PostsService } from '../../_services/posts.service';
import { UsersService } from '../../_services/users.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Post } from '../../_models/posts.interface';

//bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  posts: Post[];
  drafts: Post[];
  msg: string;
  isSuccess: boolean = false;
  isButtonClicked: boolean = false;
  modalRef: BsModalRef;
  isDelete: boolean = false;
  date: string;
  isEditAndSubmit: boolean = false;

  constructor(private usersService: UsersService,
    private postsService: PostsService,
    private router: Router,
    private modalService: BsModalService,
    private location: Location) { }

  ngOnInit() {
    this.postsService
      .getApprovedPosts("&_sort=title,date&_order=asc,desc")
      .subscribe((data: Post[]) => {
        this.posts = data;
      })

    this.postsService
      .getDrafts(this.usersService.loggedUser.uname)
      .subscribe((data: Post[]) => {
        this.drafts = data;
      })

    this.date = this.getDate();

    if (this.postsService.post.status == "Returned" || this.postsService.post.isDraft == true) {
      this.isEditAndSubmit = true;
    } else {
      this.isEditAndSubmit = false;
    }
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onGoBack() {
    //this.router.navigate(['/', 'dashboard']);
    this.location.back();
  }

  checkPost(title, body) {
    //check if required fields are filled correctly
    if (body.length >= 100 && title.length != 0) {
      this.isSuccess = true;
      this.postsService.updatePost(this.postsService.post).subscribe((data: Post) => {
        this.postsService.post = data;
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

  onEditPost(title, subtitle, category, body) {
    this.isButtonClicked = true;
    this.checkPost(title, body);
    if (this.isSuccess == true)
      this.msg = "Your post was updated successfully";
  }

  onDeletePost(post) {
    //to disable edit button and only enable the back button
    this.isDelete = true;
    this.isSuccess = true;
    this.msg = "The post was deleted successfully";

    post = this.postsService.post;
    this.posts = this.posts.filter(h => h !== post);

    this.postsService.deletePost(post).subscribe();
    this.modalRef.hide();

  }

  onSubmitPost(title, body) {
    this.isButtonClicked = true;
    
    this.checkPost(title, body);
    if (this.isSuccess == true)
      this.msg = "Your post was submitted successfully";

    this.date = this.getDate(); //update the date of submitted post to today
    this.postsService.post.date = this.date;
    this.postsService.post.isDraft = false;
    this.postsService.post.status = "Pending";
    this.drafts = this.drafts.filter(h => h !== this.postsService.post);

    this.postsService.updatePost(this.postsService.post).subscribe((data: Post) => {
      this.postsService.post = data;
    });

  }
}

