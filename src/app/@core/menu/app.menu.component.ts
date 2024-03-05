import { Component, OnInit, OnDestroy } from '@angular/core';
import { constantesLocalStorage, moduloAPP } from '@constantes';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  constructor(private serviceAuth: AuthService) { }

  model: any[] = [];
  items!: MenuItem[];

  ngOnInit() {
    const $obtenerMenu = this.serviceAuth.obtenerMenu(moduloAPP, constantesLocalStorage.idusuario)
      .subscribe({
        next: (rpta: any) => {
          this.model = rpta;
        },
        error: (err) => { },
        complete: () => { }
      });
    this.$listSubcription.push($obtenerMenu);
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }
}
