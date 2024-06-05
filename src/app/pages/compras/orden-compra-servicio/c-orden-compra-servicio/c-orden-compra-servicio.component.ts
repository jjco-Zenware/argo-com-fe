import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { dOperacion } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { CDatoCotizacionComponent } from '../../proyectos-ganados/c-dato-cotizacion/c-dato-cotizacion.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { SharedAppService } from '@sharedAppService';
import { CDatoCotizacionViewProyecComponent } from '../../proyectos-ganados/c-dato-cotizacion-view-proyec/c-dato-cotizacion-view-proyec.component';

@Component({
  selector: 'app-c-orden-compra-servicio',
  templateUrl: './c-orden-compra-servicio.component.html',
  styleUrls: ['./c-orden-compra-servicio.component.scss']
})
export class COrdenCompraServicioComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];


    vistaLista: boolean = true;
    visDetalle: boolean = false;
    visQuote: boolean = false;
    lstOrdenCompra: any;
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    tipoOC:any;

    dropdownItemsEstado = [
        { name: 'Registrado', code: 'REG' },
        { name: 'Confirmado', code: 'CFM' },
        { name: 'Aprobado', code: 'APR' },
        { name: 'Rechazado', code: 'RCH' }
    ];

    blockedDocument: boolean = false;
    mensajeSpinner: string = "";

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,
        
      ){

           
    }

    ngOnInit(): void{
        this.createFrm();
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

    createFrm(){
        this.frmDatos = this.fb.group({
          //   idestado: [
          //   {
          //     value: null,
          //     disabled: false,
          //   },
          // ],
          fecini: [
            {
              value: this.utilitariosService.obtenerFechaInicioMes(),
              disabled: false,
            },
          ],
          fecfin: [
            {
              value: this.utilitariosService.obtenerFechaFinMes(),
              disabled: false,
            },
          ],
          idusuario: [
            {
              value: constantesLocalStorage.idusuario,
              disabled: false,
            },
          ],
        })
      }

      getListarOrdenCompra(){
        this.setSpinner(true);
        this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
        console.log('this.frmDatos...', this.frmDatos.value);

        const $getListarOrdenCompra = this.proyectosService.ordenCompraList(this.frmDatos.value)
          .subscribe({
            next: (rpta:any) => {
                this.setSpinner(false);
                console.log('rpta getListarOrdenCompra', rpta.ordenescompra);
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
        this.$listSubcription.push($getListarOrdenCompra)
      }

    onVer(dato: dOperacion) {
        console.log('onVer...', dato);
        const ref = this.dialogService.open(CDatoCotizacionViewProyecComponent, {
          data: dato,
          header: "Ver Orden de Compra/Servicio N° " + dato.idordencompra ,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '50%',
        });
    }

    onEditar(dato: dOperacion) {
        console.log('onVer...', dato);
        const ref = this.dialogService.open(CDatoCotizacionComponent, {
          data: dato,
          header: "Editar Orden de Compra/Servicio N° " + dato.idordencompra,
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
        this.visDetalle = false;
        this.visQuote = true;
    }

    getDetalle(dato:boolean){
        this.vistaLista = true;
        this.visDetalle = false;
        this.visQuote = false;
    }

    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
        this.visQuote = false;
      }

      onNuevo() {
        
        this.tituloDetalle = "Nueva Orden de Compra/Servicio ";
        this.tipoOC = 1;
        this.vistaLista = false;
      }
}
