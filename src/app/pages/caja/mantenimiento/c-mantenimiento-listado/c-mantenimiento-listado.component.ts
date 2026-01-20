import { Component, OnDestroy, OnInit } from '@angular/core';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { CajaService } from '../../caja.service';
import { CmMantenimientoCajaComponent } from '../cm-mantenimiento-caja/cm-mantenimiento-caja.component';

@Component({
  selector: 'app-c-mantenimiento-listado',
  templateUrl: './c-mantenimiento-listado.component.html',
  styleUrls: ['./c-mantenimiento-listado.component.scss']
})
export class CMantenimientoListadoComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  listado: any[] = [];
  tituloDetalle!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  visXperfil: boolean = true;

  constructor(
    public readonly dialogService: DialogService,
    private readonly serviceSharedApp: SharedAppService,
    private readonly serviceCaja: CajaService,
  ) { }

  ngOnInit(): void {
    this.getListar();
    this.visXperfil = constantesLocalStorage.idperfil !== 11
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  getListar() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    const { idlocal } = constantesLocalStorage;

    const $cajaList = this.serviceCaja.cajaList(idlocal, 0)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          const _estadoCerrado = 2;
          const data = rpta.map((item: any) => ({
            ...item,
            estadoCerrado: item.idestadocaja === _estadoCerrado
          }))

          this.listado = data
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast();
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($cajaList)
  }

  getRegistro(data: any) {
    const refItem = this.dialogService.open(CmMantenimientoCajaComponent, {
      data,
      header: data.length == 0 ? "Agregar Caja" : "Editar Caja - " + data.nomcaja,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '30%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      this.getListar();
    });
  }

  eliminarCaja(data: any) {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    const { idcaja } = data
    const { idusuario } = constantesLocalStorage;
    const $cajaList = this.serviceCaja.cajaDelete({ idcaja, idusuario })
      .subscribe({
        next: (rpta: any) => {
          this.serviceSharedApp.messageToast({
            severity: rpta.procesoSwitch === 0 ? 'success' : 'error',
            detail: rpta.mensaje
          });
          this.getListar();
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast();
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($cajaList)
  }
}
