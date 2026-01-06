import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'; import { KanbanCard } from '@interfaces';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { HabitacionesService } from '../../habitacion/habitaciones.service';
//import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';

@Component({
  selector: 'app-cm-exc-transac-reserva',
  templateUrl: './cm-exc-transac-reserva.component.html',
  styleUrls: ['./cm-exc-transac-reserva.component.scss']
})
export class CmExcTransacReservaComponent implements OnInit, AfterViewInit {
  @ViewChild('descArea') descArea!: ElementRef<HTMLTextAreaElement>;
  $listSubcription: Subscription[] = [];
  _transaccion: any;
  habitacion!: any;

  headerTitleAccion!: string;
  btnTitleAccion!: string;
  btnIdAccion!: number;
  errorMensaje: string = "";
  descripcion: string = "OK";
  btnIconAccion!: string;
  btnColor!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstUsuariosAux: any[] = [];
  visLstUsuariosAux: boolean = false;
  idusuarioresponsable: number = 0;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public refDatoItem: DynamicDialogRef,
    private serviceSharedApp: SharedAppService,
    private ordencompraService: OrdencompraService,
    private serviceHabitacion: HabitacionesService,
  ) { }

  ngOnInit(): void {
    this.habitacion = this.config.data;
    this.visLstUsuariosAux = this.config.data.idtrx === 416 || this.config.data.idtrx === 419;
    console.log('habitacion Modal', this.habitacion);
    this._transaccion = this.config.data.acciones.filter((x: { idtrx: any; }) => x.idtrx === this.config.data.idtrx);
    this.cargarData();
    if (this.visLstUsuariosAux) {
      this.descripcion = "";
      this.listarUsuariosAux();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.descArea?.nativeElement) {
        this.descArea.nativeElement.focus();
      }
    }, 300);
  }

  cargarData() {
    this.headerTitleAccion = this._transaccion[0].nomtrx;
    this.btnTitleAccion = this._transaccion[0].nomtrxbtn;
    this.btnIdAccion = this._transaccion[0].idtrx;
    this.btnIconAccion = this._transaccion[0].icono;
    this.btnColor = this._transaccion[0].clasebtn;
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  getPagar(codigo: number) {
    if (this.validarDatos()) {
      console.log("errorMensaje : ", this.errorMensaje);
      this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: this.errorMensaje });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjProcesando
    console.log("habitacion : ", JSON.stringify(this.habitacion));

    const items_pago = this.habitacion.idordencompraitemArray.map((x: any) => ({
      iddocumentoprc_item: x
    }));

    const objeto = {
      idtrx: 422,
      idusuario: constantesLocalStorage.idusuario,
      descripcion: this.descripcion,
      iddocumentoprc: this.habitacion.idordencompra, //his.habitacion.idnrooperacion,
      /*iddocumentoprc_item: this.habitacion.idoperacion_item, //this.habitacion.idnrooperacion_item,
      idprod: this.habitacion.idprod,*/
      items_pago
    }

    console.log("procesarTrxDocPago : ", objeto);

    const $procesarTrx = this.ordencompraService.procesarTrxDocPago(objeto).subscribe({
      next: (rpta: any) => {
        console.log('prcReunion', rpta);
        this.setSpinner(false);
        this.cerrar(rpta);
        /*this.serviceSharedApp.messageToast({
          severity: rpta.procesoSwitch === 0 ? 'success' : 'info',
          summary: rpta.procesoSwitch === 0 ? 'Exito' : 'Validación...!',
          detail: rpta.mensaje
        });

        if (rpta.procesoSwitch === 0) {
            console.log('entro procesoSwitch....');
            this.cerrar(objeto)
        }*/
      },
      error: (err: any) => {
        this.setSpinner(false);
        console.error('error : ', err);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { },
    });
    this.$listSubcription.push($procesarTrx)
  }

  validarDatos(): boolean {
    this.errorMensaje = "";

    if (this.visLstUsuariosAux) {
      if (!this.idusuarioresponsable) {
        this.errorMensaje = "Debe Seleccionar un Usuario Responsable...!";
        return false;
      }
    } else if (this.descripcion === " " || this.descripcion === "") {
      this.errorMensaje = "Debe Ingresar Descripción...!";
      return false;
    }

    return true;
  }

  listarUsuariosAux() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const $listarUsuariosAuxHouseKeeping = this.serviceHabitacion.listarUsuariosAuxHouseKeeping()
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta getListar', rpta);
          this.lstUsuariosAux = rpta;
        },
        error: (err: any) => {
          console.log('rpta err', err);
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($listarUsuariosAuxHouseKeeping)
  }

  cerrar(data: any) {
    this.refDatoItem.close({ data });
  }

}
