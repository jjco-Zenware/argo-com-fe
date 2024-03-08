import {
    ChangeDetectorRef,
    Component,
    OnInit,
    Renderer2,
    ViewChild,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { MenuService } from '../@core/app.menu.service';
import { LayoutService } from '../@core/service/app.layout.service';
import { AppSidebarComponent } from '../@core/sidebar/app.sidebar.component';
import { AppTopbarComponent } from '../@core/topbar/app.topbar.component';
import { LocalStorageService } from '@localStorage';
import { constantesLocalStorage } from '@constantes';

@Component({
    selector: 'app-c-pages',
    templateUrl: './c-pages.component.html',
    styleUrls: ['./c-pages.component.scss'],
})
export class CPagesComponent implements OnInit  {
    overlayMenuOpenSubscription: Subscription;
    topbarMenuOpenSubscription: Subscription;
    menuProfileOpenSubscription: Subscription;
    menuOutsideClickListener: any;
    menuScrollListener: any;
    topbarMenuOutsideClickListener: any;
    menuProfileOutsideClickListener: any;
    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;
    @ViewChild(AppTopbarComponent) appTopbar!: AppTopbarComponent;

    constructor(
        private menuService: MenuService,
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        private localStorageService:LocalStorageService,
    ) {
        constantesLocalStorage.nombreUsuario = localStorageService.obtenerUsuario();
        constantesLocalStorage.login = localStorageService.obtenerDataGeneral().login;
        constantesLocalStorage.idusuario = localStorageService.obtenerDataGeneral().idusuario;
        constantesLocalStorage.imagen = localStorageService.obtenerDataGeneral().imagen;

        this.hideMenuProfile();
        this.overlayMenuOpenSubscription =
            this.layoutService.overlayOpen$.subscribe(() => {
                this.hideTopbarMenu();
                if (!this.menuOutsideClickListener) {
                    this.menuOutsideClickListener = this.renderer.listen(
                        'document',
                        'click',
                        (event) => {
                            const isOutsideClicked = !(
                                this.appSidebar.el.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appSidebar.el.nativeElement.contains(
                                    event.target
                                ) ||
                                this.appTopbar.menuButton.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appTopbar.menuButton.nativeElement.contains(
                                    event.target
                                )
                            );
                            if (isOutsideClicked) {
                                this.hideMenu();
                            }
                        }
                    );
                }
                if (
                    (this.layoutService.isHorizontal() ||
                        this.layoutService.isSlim() ||
                        this.layoutService.isSlimPlus()) &&
                    !this.menuScrollListener
                ) {
                    this.menuScrollListener = this.renderer.listen(
                        this.appSidebar.menuContainer.nativeElement,
                        'scroll',
                        (event) => {
                            if (this.layoutService.isDesktop()) {
                                this.hideMenu();
                            }
                        }
                    );
                }
                if (this.layoutService.state.staticMenuMobileActive) {
                    this.blockBodyScroll();
                }
            });

        this.topbarMenuOpenSubscription =
            this.layoutService.topbarMenuOpen$.subscribe(() => {
                if (!this.topbarMenuOutsideClickListener) {
                    this.topbarMenuOutsideClickListener = this.renderer.listen(
                        'document',
                        'click',
                        (event) => {
                            const isOutsideClicked = !(
                                this.appTopbar.el.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appTopbar.el.nativeElement.contains(
                                    event.target
                                ) ||
                                this.appTopbar.mobileMenuButton.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appTopbar.mobileMenuButton.nativeElement.contains(
                                    event.target
                                )
                            );
                            if (isOutsideClicked) {
                                this.hideTopbarMenu();
                            }
                        }
                    );
                }
                if (this.layoutService.state.staticMenuMobileActive) {
                    this.blockBodyScroll();
                }
            });

        this.menuProfileOpenSubscription =
            this.layoutService.menuProfileOpen$.subscribe(() => {
                this.hideMenu();
                if (!this.menuProfileOutsideClickListener) {
                    this.menuProfileOutsideClickListener = this.renderer.listen(
                        'document',
                        'click',
                        (event) => {
                            const isOutsideClicked = !(
                                this.appSidebar.menuProfile.el.nativeElement.isSameNode(
                                    event.target
                                ) ||
                                this.appSidebar.menuProfile.el.nativeElement.contains(
                                    event.target
                                )
                            );
                            if (isOutsideClicked) {
                                this.hideMenuProfile();
                            }
                        }
                    );
                }
            });

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideTopbarMenu();
                this.hideMenuProfile();
            });
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(
                new RegExp(
                    '(^|\\b)' +
                        'blocked-scroll'.split(' ').join('|') +
                        '(\\b|$)',
                    'gi'
                ),
                ' '
            );
        }
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        this.menuService.reset();

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }

        if (this.menuScrollListener) {
            this.menuScrollListener();
            this.menuScrollListener = null;
        }
        this.unblockBodyScroll();
    }

    hideTopbarMenu() {
        this.layoutService.state.topbarMenuActive = false;

        if (this.topbarMenuOutsideClickListener) {
            this.topbarMenuOutsideClickListener();
            this.topbarMenuOutsideClickListener = null;
        }
    }

    hideMenuProfile() {
        this.layoutService.state.menuProfileActive = false;

        if (this.menuProfileOutsideClickListener) {
            this.menuProfileOutsideClickListener();
            this.menuProfileOutsideClickListener = null;
        }
    }

    get containerClass() {
        let styleClass: { [key: string]: any } = {
            'layout-overlay': this.layoutService.config.menuMode === 'overlay',
            'layout-static': this.layoutService.config.menuMode === 'static',
            'layout-slim': this.layoutService.config.menuMode === 'slim',
            'layout-slim-plus':
                this.layoutService.config.menuMode === 'slim-plus',
            'layout-horizontal':
                this.layoutService.config.menuMode === 'horizontal',
            'layout-reveal': this.layoutService.config.menuMode === 'reveal',
            'layout-drawer': this.layoutService.config.menuMode === 'drawer',
            'p-input-filled': this.layoutService.config.inputStyle === 'filled',
            'p-ripple-disabled': !this.layoutService.config.ripple,
            'layout-static-inactive':
                this.layoutService.state.staticMenuDesktopInactive &&
                this.layoutService.config.menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active':
                this.layoutService.state.staticMenuMobileActive,
            'layout-topbar-menu-active':
                this.layoutService.state.topbarMenuActive,
            'layout-menu-profile-active':
                this.layoutService.state.menuProfileActive,
            'layout-sidebar-active': this.layoutService.state.sidebarActive,
            'layout-sidebar-anchored': this.layoutService.state.anchored,
        };

        styleClass['layout-topbar-' + this.layoutService.config.topbarTheme] =
            true;
        styleClass['layout-menu-' + this.layoutService.config.menuTheme] = true;
        styleClass[
            'layout-menu-profile-' +
                this.layoutService.config.menuProfilePosition
        ] = true;
        return styleClass;
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
    
    ngOnInit(): void {
        this.changeTopbarTheme('lightblue')        
        this.changeTheme('blue')

        this.applyScale();
        /*
        this.changeTheme(this.layoutService.config.componentTheme)
        this.changeTopbarTheme(this.layoutService.config.topbarTheme)
        */
    }

    changeTheme(theme: string) {
        const themeLink = <HTMLLinkElement>(
            document.getElementById('theme-link')
        );
        const newHref = themeLink
            .getAttribute('href')!
            .replace(this.layoutService.config.componentTheme, theme);
        this.layoutService.replaceThemeLink(newHref, () => {
            this.layoutService.config.componentTheme = theme;
            this.layoutService.onConfigUpdate();
        });
    }

    changeTopbarTheme(theme:string) {
        this.layoutService.config.topbarTheme = theme;
        this.layoutService.onConfigUpdate();
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }
}
