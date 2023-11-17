import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { CPagesComponent } from './c-pages.component';
import { CoreModule } from '../@core/core.module';
import { AppConfigModule } from '../@core/config/app.config.module';
import { DialogService } from 'primeng/dynamicdialog';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../services/token-interceptor';
import { PagesService } from './pages.service';


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
    PagesService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ]
})
export class PagesModule { }
