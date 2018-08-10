import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule }     from './app-routing/app-routing.module';
import { FormsModule } from '@angular/forms';

//components
import { AppComponent } from './app.component';
import { LoginComponent } from '../_components/login/login.component';
import { DashboardComponent } from '../_components/dashboard/dashboard.component';
import { NavbarComponent } from '../_components/navbar/navbar.component';
import { ProfileComponent } from '../_components/profile/profile.component';
import { DraftsComponent } from '../_components/drafts/drafts.component';
import { ForgotPasswordComponent } from '../_components/forgot-password/forgot-password.component';
import { CreatePostComponent } from '../_components/create-post/create-post.component';
import { EditPostComponent } from '../_components/edit-post/edit-post.component';
import { PendingPostComponent } from '../_components/pending-post/pending-post.component';
import { ViewPostComponent } from '../_components/view-post/view-post.component';

//services
import { UsersService } from '../_services/users.service';
import { PostsService } from '../_services/posts.service';

//styles
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    DraftsComponent,
    ForgotPasswordComponent,
    CreatePostComponent,
    EditPostComponent,
    NavbarComponent,
    PendingPostComponent,
    ViewPostComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  providers: [UsersService, PostsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
