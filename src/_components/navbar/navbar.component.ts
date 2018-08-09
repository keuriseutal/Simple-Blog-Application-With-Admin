import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { User } from '../../_models/users.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  users: User[];
  isAdmin: boolean = false;

  constructor(private usersService: UsersService, private router: Router) { }

  ngOnInit() {

    this.usersService
      .getUsers()
      .subscribe((data: User[]) => {
        this.users = data;
      })

    if (this.usersService.loggedUser.isAdmin == true) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

  }

  onLogOut() {
    this.usersService.loggedUser.isLoggedIn = false;
    this.usersService.setAsLoggedOut(this.usersService.loggedUser).subscribe((data: User) => {
      this.usersService.loggedUser = data;
    });
    this.router.navigateByUrl('/login');

  }//end onLogOut

}
