import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiSecurityService } from 'src/app/DataAccess/api-security.service';
import { finalize } from 'rxjs/operators';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});
  showAlert = false;
  alertMessage = '';
  alertType = '';
  isLoading: boolean = false;
  constructor(
    private formBuilder: FormBuilder, 
    private apiSecurityService: ApiSecurityService, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
      
    });
  }

    onSubmit(): void {
      this.isLoading = true;
      
      if (this.loginForm.valid) {
        const credentials = {
          usuario: this.loginForm.value.username,
          contrasena: this.loginForm.value.password,
          idSistema: 4,
        };
  
        this.apiSecurityService.login(credentials)
        .pipe(
          tap((data) => { 
            if(data.item){
              const token = data.item ;
              this.authService.setAuthState(token);
    
              // Recupera la URL desde el localStorage y redirige allí, o a una URL por defecto
              const returnUrl = localStorage.getItem('redirectUrl') || '/home';
    
              window.location.href = returnUrl;
              localStorage.removeItem('returnUrl'); // Elimina la URL almacenada del localStorage
             
            }
            this.isLoading = false;
          }),
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe();
      }
    }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  
  
  // Esta función se llama para mostrar la alerta
  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.showAlert = true;
    this.alertType = type;

    // La alerta se ocultará después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

}
