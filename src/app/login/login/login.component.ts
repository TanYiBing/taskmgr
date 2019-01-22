import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from '../../services/quote.service';
import { Quote } from '../../domain/quote.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/quote.action';

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
    private quoteService$: QuoteService,
    private store$: Store<fromRoot.State>,
  ) {
    this.quote$ = this.store$.select(fromRoot.getQuoteState);
    this.quoteService$.getQuote().subscribe(q => this.store$.dispatch(new actions.QuoteSuccessAction(q)) );
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['wang@163.com', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  onSubmit({value, valid}, ev: Event) {
  }
}
