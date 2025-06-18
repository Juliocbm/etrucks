import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Importa más dependencias según lo necesario, como tu servicio de autenticación
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiSecurityService } from 'src/app/DataAccess/api-security.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  showAlert = false;
  alertMessage = '';
  alertType = '';
  token: string = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiSecurityService: ApiSecurityService
    // Inyecta más dependencias según lo necesario
  ) {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { newPassword, confirmPassword } = this.resetPasswordForm.value;
      if (newPassword !== confirmPassword) {
        this.alertType = 'danger';
        this.alertMessage = 'Las contraseñas no coinciden';
        this.showAlert = true;
        return;
      }
      
      // Aquí, realiza la llamada al API para cambiar la contraseña
      this.isLoading = true;
      this.apiSecurityService.resetPassword(this.token, newPassword)
        .subscribe(
          response => {
            this.isLoading = false;
            this.alertMessage = "Tu contraseña ha sido actualizada con éxito";
            this.alertType = "success";
            this.showAlert = true;
          },
          error => {
            this.isLoading = false;
            this.alertMessage = "Error al actualizar la contraseña, intenta de nuevo.";
            this.alertType = "danger";
            this.showAlert = true;
            this.resetPasswordForm.reset();
          }
        );
    }
  }
}
