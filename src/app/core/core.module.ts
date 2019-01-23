import { NgModule, Optional, SkipSelf } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';

import { loadSvgResources } from '../utils/svg.util';
import { SharedModule } from '../shared/shared.module';

import 'hammerjs';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from '../services/services.module';
import { HttpClientModule } from '@angular/common/http';
import { AppStoreModule } from '../reducers';
import { AppEffectsModule } from '../effects';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidebarComponent],
  imports: [
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    ServicesModule.forRoot(),
    AppStoreModule,
    AppEffectsModule,
    BrowserAnimationsModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AppRoutingModule
  ],
  providers: [
    {
      provide: 'BASE_CONFIG', useValue: {
        uri:　'http://localhost:3000'
      }
    }
  ]
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule,
    ir: MatIconRegistry,
    ds: 　DomSanitizer
  ) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
    loadSvgResources(ir, ds);
  }
}
