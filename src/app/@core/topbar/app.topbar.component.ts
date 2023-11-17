import { Component, ElementRef, ViewChild } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { LayoutService } from '../service/app.layout.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '@localStorage';
import { constantesLocalStorage } from '@constantes';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {

    @ViewChild('menuButton') menuButton!: ElementRef;
    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;
    @ViewChild('searchInput') searchInput!: ElementRef;
    nomUsuario: string = '';

    constructor(public layoutService: LayoutService, public el: ElementRef, private router: Router, private localStorage: LocalStorageService) {
        this.nomUsuario = constantesLocalStorage.nombreUsuario;
    }

    activeItem!: number;

    get mobileTopbarActive(): boolean {
        return this.layoutService.state.topbarMenuActive;
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onRightMenuButtonClick() {
        this.layoutService.openRightSidebar();
    }

    onMobileTopbarMenuButtonClick() {
        this.layoutService.onTopbarMenuToggle();
    }

    focusSearchInput(){
       setTimeout(() => {
         this.searchInput.nativeElement.focus()
       }, 0);
    }

    logout() {
        this.localStorage.limpiar();
        this.router.navigate(['/'])
    }
}
