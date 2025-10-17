import { Component, OnInit, OnDestroy } from '@angular/core';
import { constantesLocalStorage, moduloAPP } from '@constantes';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.scss']
})
export class AppMenuComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  constructor(private serviceAuth: AuthService) { }

  model: MenuItem[] = [];
  activeItem: any;

  ngOnInit() {
    const $obtenerMenu = this.serviceAuth.obtenerMenu(moduloAPP, constantesLocalStorage.idusuario)
      .subscribe({
        next: (rpta: any) => {
          console.log('obtenerMenu', rpta);
          this.model = rpta;

          this.model.forEach(element => {
            if (element.items && element.items.length > 0) {
              element.items.forEach((subElement: any) => {
                if (subElement.items && subElement.items.length > 0) {
                  subElement.items.forEach((subSubElement: any) => {
                    subSubElement.routerLinkActiveOptions = { exact: true };
                  });
                }
                subElement.routerLinkActiveOptions = { exact: true };
              });
            }
          });


          // for (let i = 0; i < this.model.length; i++) {
          //   this.model[i]['routerLinkActiveOptions'] = { exact: true };
          // }

          
          console.log('model', this.model);
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

   toggleAll() {
        const expanded = !this.areAllItemsExpanded();
        this.model = this.toggleAllRecursive(this.model, expanded);
    }

    private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
        return items.map((menuItem) => {
            menuItem.expanded = expanded;
            if (menuItem.items) {
                menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
            }
            return menuItem;
        });
    }

    private areAllItemsExpanded(): boolean {
        return this.model.every((menuItem) => menuItem.expanded);
    }
 
}
