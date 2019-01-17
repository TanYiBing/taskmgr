import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { QuoteService } from '../../services/quote.service';
import { Quote } from '../../domain/quote.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  quote: Quote = {
    cn: '满足感在于不断的努力，而不是现有成就。全心努力定会胜利满满。',
    en: 'Satisfaction lies in the effort, not in the attainment. Full efforts is full victory.',
    pic: 'assets/img/quotes/0.jpg'
  };

  constructor(
    private fb: FormBuilder,
    private quoteService$: QuoteService
  ) {
    this.quoteService$.getQuote().subscribe(q => this.quote = q );
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
