import { NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './services/error.interceptor';
//import { AppLayoutModule } from './layout/app.layout.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        BrowserAnimationsModule
        //AppLayoutModule
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
          }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
