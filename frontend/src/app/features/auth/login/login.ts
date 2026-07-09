import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  loginForm = this.fb.group({
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (response)=>{
        console.log(response);
        this.authService.saveToken(response.token)
        this.authService.saveUser(response.user)
        this.router.navigate(['/dashboard'])

      },
      error: (error)=>{
        console.error(error)
      }
    });
    console.log(this.loginForm.value)
  }

}
