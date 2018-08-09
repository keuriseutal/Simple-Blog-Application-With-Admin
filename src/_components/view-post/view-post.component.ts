import { Component, OnInit, TemplateRef } from '@angular/core';
import { PostsService } from '../../_services/posts.service';
import { Router } from '@angular/router';

import { Post } from '../../_models/posts.interface';
import { Location } from '@angular/common';

//bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  posts: Post[];
  msg: string;
  isButtonClicked: boolean = false;
  modalRef: BsModalRef;
  date: string;

  constructor(private postsService: PostsService,
              private router: Router, 
              private modalService: BsModalService,
              private location: Location) { }

  ngOnInit() {
    this.postsService
      .getPendingPosts("&_sort=title,date&_order=asc,desc")
      .subscribe((data: Post[]) => {
        this.posts = data;
      })

    this.date = this.getDate();
  }

  getDate() {
    let date = new Date(Date.now());
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10 && day < 10) {
      return "0" + month.toString() + "/0" + day.toString() + "/" + date.getFullYear().toString();
    }else if (month < 10 && day > 9) {
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

  onAcceptPost() {
    this.isButtonClicked = true;
    this.msg = "The post was approved successfully";
    this.date = this.getDate(); //update the date of approved post to today
    this.postsService.post.date = this.date; 
    this.postsService.post.status = "Approved";
    this.postsService.updatePost(this.postsService.post).subscribe((data: Post) => {
      this.postsService.post = data;
    });

  }

  onRejectPost() {
    this.isButtonClicked = true;
    this.msg = "The post was deleted successfully";

    this.posts = this.posts.filter(h => h! == this.postsService.post);
    this.postsService.deletePost(this.postsService.post).subscribe();
    this.modalRef.hide();
  }

  onReturnPost() {
    this.isButtonClicked = true;
    this.msg = "The post was returned successfully";
    this.postsService.post.status = "Returned";
    this.postsService.updatePost(this.postsService.post).subscribe((data: Post) => {
      this.postsService.post = data;
    });
  }

}
