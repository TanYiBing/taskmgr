import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as fromRoot from '../../reducers';
import { Observable } from 'rxjs';
import { Auth } from '../../domain';
import { Store } from '@ngrx/store';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  auth$: Observable<Auth>;
  @Output() toggle = new EventEmitter<void>();
  @Output() toggleDarkTheme = new EventEmitter<boolean>();

  constructor(
    private store$: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    this.auth$ = this.store$.select(fromRoot.getAuthState);
  }

  openSidebar(): void {
    this.toggle.emit();
  }

  onChange(checked: boolean): void {
    this.toggleDarkTheme.emit(checked);
  }

  handleLogout() {
    this.store$.dispatch(new authActions.LogoutAction(null));
  }
}
