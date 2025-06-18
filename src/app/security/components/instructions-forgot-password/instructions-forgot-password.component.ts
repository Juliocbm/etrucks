import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-instructions-forgot-password',
  templateUrl: './instructions-forgot-password.component.html',
  styleUrls: ['./instructions-forgot-password.component.css']
})
export class InstructionsForgotPasswordComponent implements OnInit {
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private router: Router) { }

  ngOnInit() {
  
  
  }

  redirectLogin() {
    this.router.navigate(['/login']);
  }
}
