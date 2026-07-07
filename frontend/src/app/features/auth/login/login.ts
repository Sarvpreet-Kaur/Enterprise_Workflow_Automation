import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder)

  loginForm = this.fb.group({
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  onSubmit(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log(this.loginForm.value)
  }

}
