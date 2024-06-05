import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { dOperacion } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { CDatoCotizacionComponent } from '../c-dato-cotizacion/c-dato-cotizacion.component';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ProyectosService } from '../service/proyectos.service';
import { CDatoCotizacionViewProyecComponent } from '../c-dato-cotizacion-view-proyec/c-dato-cotizacion-view-proyec.component';

@Component({
  selector: 'app-c-listaOC',
  templateUrl: './c-listaOC.component.html',
  styleUrls: ['./c-listaOC.component.scss']
})
export class CListaOrdenCompraServicioComponent implements OnInit, OnDestroy{
    @Input() Id_proyecto: any;
    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visQuote: boolean = false;
    lstOrdenCompra: any;
    tituloDetalle!: string;
    headerTitleProducto!: string;
    headerTitleItem!: string;
    headCliente!: string;
    headDescrip!: string;
    headMoneda!: string;
    headFecha!: string;
    headTotalQuote: number = 0;
    headTipoCambio: number = 0;
    headNomCreador!: string;

    blockedDocument: boolean = false;
    mensajeSpinner: string = "";

    constructor(
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService,
        private serviceSharedApp: SharedAppService,
        private proyectosService: ProyectosService,


      ){        }

    ngOnInit(): void{
      console.log('Id_proyecto', this.Id_proyecto);
      this.getListarOrdenCompra();
    }

    ngOnDestroy(): void {
        if (this.$listSubcription != undefined) {
          this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
      }

      setSpinner(valor: boolean) {
        this.blockedDocument = valor;
      }

      getListarOrdenCompra(){
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

        const $listaTareas = this.proyectosService.ordenCompraProyectoList(this.Id_proyecto)
          .subscribe({
            next: (rpta:any) => {
                this.setSpinner(false);
                console.log('rpta listaTareas', rpta.ordenescompra);
                this.lstOrdenCompra = rpta.ordenescompra
            },
            error:(err)=>{
                this.setSpinner(false);
                this.serviceSharedApp.messageToast()
            },
            complete:() => {
              this.setSpinner(false);
            }
          });
        this.$listSubcription.push($listaTareas)
      }

    onVer(dato: any) {
        console.log('onVer...', dato);
        this.tituloDetalle = "Ver Orden de Compra/Servicio N° " + dato.idordencompra;
        this.vistaLista = false;
        this.visQuote = false;

        const ref = this.dialogService.open(CDatoCotizacionViewProyecComponent, {
          data: dato,
          header:  this.tituloDetalle ,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '50%',
          //height: '60%'
        });
    }

    onEditar(dato: any) {
        console.log('onVer...', dato);
        this.tituloDetalle = "Editar Orden de Compra/Servicio N° " + dato.idordencompra;
        this.vistaLista = false;
        this.visQuote = false;
    
        const ref = this.dialogService.open(CDatoCotizacionComponent, {
          data: dato,
          header:  this.tituloDetalle ,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '50%',
          //height: '60%'
        });
    
        ref.onClose.subscribe(() => {
          this.getListarOrdenCompra();
        });
    }
    verCotiza(data: dOperacion) {
        console.log('onVer...', data);
        this.tituloDetalle = "Cotización de Orden de Compra/Servicio N° " + data.idordencompra;
        this.vistaLista = false;
        this.visQuote = true;
    }

    getDetalle(dato:boolean){
        this.vistaLista = true;
        this.visQuote = false;
    }

    getBack() {
        this.vistaLista = true;
        this.visQuote = false;
      }

    onNuevo() {
    //console.log('onNuevo...', data);
    const objeto = {
      idproyecto: this.Id_proyecto,
      idordencompra: 0,
      fechaingreso: new Date(),
      items: [],
      contactos: [],
      idproveedor:0,
      idusuario: constantesLocalStorage.idusuario
    }

    const ref = this.dialogService.open(CDatoCotizacionComponent, {
      data: objeto,
      header:  "Nueva Cotización" ,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '50%',
      //height: '60%'
    });

    ref.onClose.subscribe(() => {
      this.getListarOrdenCompra();
    });
      }
}
