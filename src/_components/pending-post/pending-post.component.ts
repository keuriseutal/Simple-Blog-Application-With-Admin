import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../_services/posts.service';
import { UsersService } from '../../_services/users.service';
import { Post } from '../../_models/posts.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pending-post',
  templateUrl: './pending-post.component.html',
  styleUrls: ['./pending-post.component.css']
})
export class PendingPostComponent implements OnInit {

  posts: Post[] = [];
  returnedPosts: Post[] = [];
  post: Post;
  date: string;
  isPending: boolean = true;

  pendingPostsCount: number;
  returnedPostsCount: number;

  currentURL: string = "&_sort=date&_order=desc";

  constructor(private postsService: PostsService,
    private usersService: UsersService,
    private router: Router) { }

  ngOnInit() {

    this.postsService
      .getPendingPostsOfUser(this.usersService.loggedUser.uname, this.currentURL)
      .subscribe((data: Post[]) => {
        this.posts = data;
        this.postsService.posts = data;
        this.pendingPostsCount = this.posts.length;
      })

    this.postsService
      .getReturnedPosts(this.usersService.loggedUser.uname, this.currentURL)
      .subscribe((data: Post[]) => {
        this.returnedPosts = data;
        this.returnedPostsCount = this.returnedPosts.length;
      })

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

  togglePosts() {
    this.isPending = !this.isPending;

    if (this.isPending) {
      this.postsService
        .getPendingPostsOfUser(this.usersService.loggedUser.uname, this.currentURL)
        .subscribe((data: Post[]) => {
          this.posts = data;
          this.postsService.posts = data;
          this.pendingPostsCount = this.posts.length;

        })
    } else {
      this.postsService
        .getReturnedPosts(this.usersService.loggedUser.uname, this.currentURL)
        .subscribe((data: Post[]) => {
          this.posts = data;
          this.postsService.posts = data;
          this.returnedPostsCount = this.posts.length;

        })
    }
  }

  checkIfReturned() {
    if (!this.usersService.loggedUser.isAdmin) {
      for (let i = 0; i < this.posts.length; i++) {
        if (this.posts[i].status == "Returned") {
          return true;
        }
      }
    }
  }

  onGoToEditPage(post) {
    this.date = this.getDate(); //update the date of submitted post to today
    this.postsService.post = post;
    this.postsService.post.date = this.date;
    this.router.navigate(['/', 'edit-post']);
  }//end on GoToEditPage

  onDeletePost(post) {
    this.posts = this.posts.filter(h => h !== post);
    this.postsService.deletePost(post).subscribe();
  }

  onPost(post: Post) {
    this.date = this.getDate(); //update the date in drafts to today
    post.date = this.date;

    this.posts = this.posts.filter(h => h !== post);
    this.postsService.post = post;
    this.postsService.post.isDraft = false;
    this.postsService.post.status = "Pending";
    this.postsService.submitDraft(this.postsService.post).subscribe();
  }//end onPost

}
