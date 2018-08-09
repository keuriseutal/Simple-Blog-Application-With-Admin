import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from '../app.component';
import { LoginComponent } from '../../_components/login/login.component';
import { ForgotPasswordComponent } from '../../_components/forgot-password/forgot-password.component';
import { DashboardComponent } from '../../_components/dashboard/dashboard.component';
import { NavbarComponent } from '../../_components/navbar/navbar.component';
import { ProfileComponent } from '../../_components/profile/profile.component';
import { CreatePostComponent } from '../../_components/create-post/create-post.component';
import { EditPostComponent } from '../../_components/edit-post/edit-post.component';
import { DraftsComponent } from '../../_components/drafts/drafts.component';
import { PendingPostComponent } from '../../_components/pending-post/pending-post.component';
import { ViewPostComponent } from '../../_components/view-post/view-post.component';
import { NavbarViewerComponent } from '../../_components/navbar-viewer/navbar-viewer.component';

import { ModalModule } from 'ngx-bootstrap/modal';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'create-post', component: CreatePostComponent },
  { path: 'edit-post', component: EditPostComponent },
  { path: 'view-post', component: ViewPostComponent },
  { path: 'pending-post', component: PendingPostComponent },
  { path: 'drafts', component: DraftsComponent },
  { path: 'home', component: NavbarViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ModalModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }