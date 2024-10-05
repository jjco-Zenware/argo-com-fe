import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppMenuitemComponent } from './menu-item/app.menuitem.component';
import { AppConfigModule } from './config/app.config.module';
import { AppBreadcrumbComponent } from './breadcrumb/app.breadcrumb.component';
import { AppFooterComponent } from './footer/app.footer.component';
import { AppMenuProfileComponent } from './menu-profile/app.menuprofile.component';
import { AppMenuComponent } from './menu/app.menu.component';
import { AppRightMenuComponent } from './right-menu/app.rightmenu.component';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { AppTopbarComponent } from './topbar/app.topbar.component';
import { SharedPrimeNgModule } from '@primeNgModule';
import { MenuService } from './app.menu.service';
import { MenuModule } from 'primeng/menu';
import { AccordionModule } from 'primeng/accordion';

@NgModule({
    declarations: [
        AppBreadcrumbComponent,
        AppMenuProfileComponent,
        AppTopbarComponent,
        AppRightMenuComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppMenuitemComponent,
        AppFooterComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        RouterModule,
        AppConfigModule,
        SharedPrimeNgModule,
        ReactiveFormsModule,
        MenuModule ,
        AccordionModule 
    ],
    exports: [
        AppBreadcrumbComponent,
        AppMenuProfileComponent,
        AppTopbarComponent,
        AppRightMenuComponent,
        AppMenuComponent,
        AppSidebarComponent,
        AppMenuitemComponent,
        AppFooterComponent,
    ],
    providers:[
        MenuService
      ]
})
export class CoreModule {}
