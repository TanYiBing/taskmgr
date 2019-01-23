import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { isValidDate } from '../../utils/date.util';
import { isValidAddr, extractInfo, getAddrByCode } from '../../utils/identity.util';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  private items: 　string[];
  private readonly avatarName = 'avatars';
  private _sub: Subscription;

  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>,
  ) {}

  ngOnInit() {
    const img = `${this.avatarName}:svg-${(Math.random() * 16).toFixed()}`;
    const num = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = num.map((n) => `avatars:svg-${n}`);

    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.required],
      password: ['', Validators.required],
      repeat: ['', Validators.required],
      avatar: [img],
      identity: [],
      dateOfBirth: ['1995-07-27'],
      address: []
    });

    const identity$ = this.form.get('identity').valueChanges.pipe(
      debounceTime(300),
      filter(_ => this.form.get('identity').valid)
    );

    this._sub = identity$.subscribe(identity => {
      const info = extractInfo(identity.identityNo);
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        this.form.patchValue({ address: addr });
        this.form.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
      if (isValidDate(info.dateOfBirth)) {
        const date = info.dateOfBirth;
        this.form.patchValue({ dateOfBirth: date });
        this.form.updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
    });
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.store$.dispatch(new authActions.RegisterAction(value));
  }

}
