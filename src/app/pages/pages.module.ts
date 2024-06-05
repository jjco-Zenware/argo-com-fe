import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { CPagesComponent } from './c-pages.component';
import { CoreModule } from '../@core/core.module';
import { AppConfigModule } from '../@core/config/app.config.module';
import { DialogService } from 'primeng/dynamicdialog';
import { PagesService } from './pages.service';
import { AuthService } from '../auth/auth.service';


@NgModule({
  declarations: [
    CPagesComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    CoreModule,
    AppConfigModule
  ],
  providers: [
    DialogService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // },
    PagesService,
    AuthService
  ]
})
export class PagesModule { }
