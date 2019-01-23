import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quote } from '../../domain/quote.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as quoteActions from '../../actions/quote.action';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  quote$: Observable<Quote>;

  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>,
  ) {
    this.quote$ = this.store$.select(fromRoot.getQuoteState);
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['wpcfan@163.com', Validators.compose([Validators.required, Validators.email])],
      password: ['wp123456', Validators.required]
    });

    this.store$.dispatch(new quoteActions.QuoteAction(null));
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.store$.dispatch(new authActions.LoginAction(value));
  }
}
