import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/@dw/services/auth/auth.service';
import { DialogService } from 'src/@dw/dialog/dialog.service';

interface LoginFormData {
    email: string;
    password: string;
}

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})

// https://material.angular.io/components/input/overview
// ErrorStateMatcher
export class SignInComponent implements OnInit {
    form: FormGroup;

    signInFormData: LoginFormData = {
        email: '',
        password: '',
    };

    constructor(
        private router: Router,
        private authService: AuthService,
        private fb: FormBuilder,
        private dialogService: DialogService,
    ) {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4), Validators.minLength(15)]],
        });
    }

    ngOnInit(): void {
        // console.log(this.f);
    }

    get f() {
        return this.form.controls;
    }

    signIn() {
        // console.log(this.signInFormData);
        this.authService.signIn(this.signInFormData).subscribe(
            (data: any) => {
                if(data.token != '' && data.token != null) {
                    this.router.navigate(['main']);
                }        
            },
            err => {
                console.log(err.error);
				this.errorAlert(err.error.message);
            },
        );
    }

    errorAlert(err) {
		switch(err) {
			case 'not found':
				this.dialogService.openDialogNegative('The email does not exist. Try again.');
				break;
            case 'mismatch':
                this.dialogService.openDialogNegative('Password is incorrect. Try again.');
                break;
		}
	};
}
