import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSecurityService } from 'src/app/DataAccess/api-security.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  showAlert = false;
  alertMessage = '';
  alertType = '';

  constructor(private formBuilder: FormBuilder, private apiSecurityService: ApiSecurityService, private router: Router) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  
  resetPassword() {
    this.router.navigate(['/reset-password']);
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;
      this.apiSecurityService.forgotPassword(email).subscribe(
        response => {
          // Handle successful response
          this.alertType = 'info';
          this.alertMessage = 'Se envio un correo de recuperacion a su cuenta';
          this.showAlert = true;
          //console.log("Check your email for reset link");
        },
        error => {
          // Handle error
          this.alertType = 'danger';
          this.alertMessage = 'Ocurio un error al enviar el correo de recuperacion';
          this.showAlert = true;
          //console.log("An error occurred");
        }
      );
    }
  }
}
