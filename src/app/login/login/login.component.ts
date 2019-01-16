import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['wang@163.com', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  onSubmit({value, valid}, ev: Event) {
    console.log(value);
    console.log(valid);
  }
}
