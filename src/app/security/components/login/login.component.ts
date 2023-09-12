import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = {
        usuario: this.loginForm.value.username,
        contrasena: this.loginForm.value.password
      };
      this.authService.login(credentials).subscribe(
        data => {
          // Redirige al usuario a la página principal o al dashboard, por ejemplo
          //this.router.navigate(['/login']);

          // Recupera la URL desde el localStorage y redirige allí, o a una URL por defecto
          const returnUrl = localStorage.getItem('redirectUrl') || '/';

          console.log("url inicial: " + returnUrl);
          this.router.navigateByUrl(returnUrl);
          localStorage.removeItem('returnUrl');  // Elimina la URL almacenada del localStorage
          this.triggerAlert("Operación fallida!","success");
        },
        error => {
          // Muestra un mensaje de error al usuario
          console.error('Error en la autenticación', error);
          this.triggerAlert("Error en la autenticación, favor de verificar usuario y/o contraseña.","danger");
        }
      );

    }
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
