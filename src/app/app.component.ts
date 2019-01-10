import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private _dark = false;

  constructor(
    private oc: OverlayContainer
  ) { }

  switchTheme(dark: boolean): void {
    this._dark = dark;
    if (dark) {
      this.oc.getContainerElement().classList.add('my-dark-theme');
    } else {
      this.oc.getContainerElement().classList.remove('my-dark-theme');
    }
  }

  get dark() {
    return this._dark;
  }
}
