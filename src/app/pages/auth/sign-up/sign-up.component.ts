import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/@dw/services/auth/auth.service';
import { DialogService } from 'src/@dw/dialog/dialog.service';

interface FormData {
  email: string;
  password: string;
  confirmedPassword: string;
  name: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})

// https://material.angular.io/components/input/overview
// ErrorStateMatcher
export class SignUpComponent implements OnInit {
  form: FormGroup;
  pwdMatchFlag: boolean;

  signUpFormData: FormData = {
    email: '',
    password: '',
    confirmedPassword: '',
    name: ''
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
    private dialogService: DialogService
  ) {
    this.form = this.fb.group(
      {
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(4),
          Validators.minLength(15)
        ]],
        confirmedPassword: ['', [
          Validators.required,
          Validators.minLength(4),
          Validators.minLength(15)
        ]],
        name: ['', [
          Validators.required,
        ]],
      },
    );
  }

  ngOnInit(): void {
    console.log(this.f);
  }

  get f() {
    return this.form.controls;
  }

  signUp() {
    // console.log(this.signUpFormData);
    this.authService.signUp(this.signUpFormData).subscribe(
      (data: any) => {
        this.dialogService.openDialogPositive('Successfully, signed up');
        // alert('successfully signed up');
        // console.log(data.message);
        this.router.navigate(['/sign-in']);
      },
      err => {
        // this.dialogService.openDialogNegative('failed to sign up.' + err.message)
        this.errorAlert(err.error.message);
      }
    )
  }

  errorAlert(err) {
		switch(err) {
      case 'retired':
          this.dialogService.openDialogNegative(`An employee who's retired at the company.`);
          break;
      case 'duplicated':
        this.dialogService.openDialogNegative(`This email already exists.`);
        break;
		}
	};

}
