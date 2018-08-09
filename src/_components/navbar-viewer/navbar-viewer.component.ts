import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-viewer',
  templateUrl: './navbar-viewer.component.html',
  styleUrls: ['./navbar-viewer.component.css']
})
export class NavbarViewerComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['/', 'dashboard']);
  }

}
