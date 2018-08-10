import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { User } from '../../_models/users.interface';
import { Router } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Local } from '../../../node_modules/protractor/built/driverProviders';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loggedUser: User;
  users: User[];
  errMsg: string;
  isError: boolean;
  isLoggedIn: boolean;

  constructor(private usersService: UsersService,
    private router: Router,
    private localStorage: LocalStorage
  ) { }

  ngOnInit() {
    this.usersService
      .getUsers()
      .subscribe((data: User[]) => {
        this.users = data;
      })

    this.errMsg = "";
    this.isError = false;
  }

  onLogin(uname, pass) {
    if (uname.length != 0 && pass.length != 0) {
      for (let i = 0; i < this.users.length; i++) {
        //check if username and password exists in the database
        if ((this.users[i].uname == uname) && (this.users[i].pass == pass)) {
          //set user as loggedIn
          this.users[i].isLoggedIn = true;
          this.usersService.setAsLoggedIn(this.users[i])
            .subscribe((data: User) => {
              this.loggedUser = data;
            });

          this.usersService.loggedUser = this.users[i];
          this.router.navigate(['/', 'dashboard']);
          break;
        } else if ((this.users[i].uname != uname) || (this.users[i].pass != pass)) {
          this.errMsg = "Username or password is incorrect";
          this.isError = true;
          continue;
        }
      }//end loop
    }//end if fields are not empty
    else {
      this.errMsg = 'Please make sure that all fields are filled';
      this.isError = true;
    }//end else field(s) is/are empty
  }//end onLogin

}
