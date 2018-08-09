import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { User } from '../../_models/users.interface';
import { Router } from '@angular/router';
//bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {

  users: User[];
  errMsg: string;
  password: string;
  isCorrect: boolean = false;
  modalRef: BsModalRef;

  constructor(private usersService: UsersService, private modalService: BsModalService, private router: Router) {}

  ngOnInit() {
     this.usersService
      .getUsers()
      .subscribe((data: User[]) =>{
         this.users = data;
      })

      this.errMsg = "";
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  checkIfCorrect(){
    //check if inputs are correct
    if(this.isCorrect){
      this.backToLogin();
      this.modalRef.hide();
    }else{
      this.modalRef.hide();
    }
  }

  backToLogin() {
    this.router.navigate(['/','login']);
  }
  
  onRetrievePassword(uname, email, mobile){

    if(uname.length != 0 && email.length != 0 && mobile.length != 0){
      for(let i = 0; i < this.users.length; i++){
        //check if username, email and mobile exists in the database
        if((this.users[i].uname == uname) && (this.users[i].profile.email == email) && (this.users[i].profile.mobile == mobile)){
          this.password = this.users[i].pass;
          this.errMsg = " ";
          this.isCorrect = true;
          //this.router.navigate(['/','print-password']);
          console.log('isUser' + this.users[i].uname + this.users[i].profile.email + this.users[i].profile.mobile);
          console.log(this.password);
          break;
        }else if((this.users[i].uname != uname) || (this.users[i].profile.email != email) || (this.users[i].profile.mobile != mobile)){
          this.isCorrect = false;
          this.errMsg = "The data that you've entered does not exist";
         // console.log('!isUser' + this.users[i].uname + this.users[i].profile.email + this.users[i].profile.mobile);
          continue;
        }
      }//end loop
    }//end if fields are not empty
    else{
      this.isCorrect = false;
      this.errMsg = 'Please make sure that all fields are filled';
    }//end else field(s) is/are empty    
  }//end onRetrievePassword

}
