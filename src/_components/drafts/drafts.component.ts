import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../_services/posts.service';
import { UsersService } from '../../_services/users.service';
import { User } from '../../_models/users.interface';
import { Post } from '../../_models/posts.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.css']
})
export class DraftsComponent implements OnInit {

  posts: Post[] = [];
  date: string;

  constructor(private postsService: PostsService, private usersService: UsersService,
              private router: Router) { }

  ngOnInit() {
    this.postsService
      .getDrafts(this.usersService.loggedUser.uname)
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

  onDiscard(post) {
    this.posts = this.posts.filter(h => h !== post);
    this.postsService.deletePost(post).subscribe();
  }//end onDiscard

  onGoToEditPage(post) {
    this.date = this.getDate(); //update the date in drafts to today
    post.date = this.date; 
    
    this.postsService.post = post;
    this.router.navigate(['/', 'edit-post']);
  }//end on GoToEditPage

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
