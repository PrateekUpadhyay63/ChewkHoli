import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private auth: AuthenticationService) { }

  ngOnInit(): void {

  }

}
