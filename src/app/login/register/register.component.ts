import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private items:　string[];
  private readonly avatarName = 'avatars';
  form;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${(Math.random() * 16).toFixed()}`;
    const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = num.map((n) => `avatars:svg-${n}`);

    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.required],
      password: ['', Validators.required],
      repeat: ['', Validators.required],
      avatar: [img]
    });
  }

}
