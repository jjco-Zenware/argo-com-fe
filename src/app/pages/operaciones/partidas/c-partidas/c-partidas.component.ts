import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    constantesLocalStorage,
    mensajesSpinner,
} from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { AlmacenService } from 'src/app/pages/almacen/service/almacenServices';
import { CModalProductoComponent } from '../modal-producto/c-modal-producto.component';

@Component({
    selector: 'app-c-partidas',
    templateUrl: './c-partidas.component.html',
    styleUrls: ['./c-partidas.component.scss'],
})
export class CPartidasComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];
    lstInfoGastos: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = '';
    frmDatos!: FormGroup;
    dataDet: any;
    gasto: any;
    lstProducto: any[] = [];

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService,
        private serviceSharedApp: SharedAppService,
        private almacenService: AlmacenService,
        public config: DynamicDialogConfig
    ) {}

    ngOnInit(): void {
        this.createFrm();
        this.getListar();
    }

    createFrm() {
        this.frmDatos = this.fb.group({
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
                { value: constantesLocalStorage.idusuario, disabled: false },
            ],
            idproveedor: [{ value: 0, disabled: false }],
            idmoneda: [{ value: 0, disabled: false }],
            idcliente: [{ value: 0, disabled: false }],
        });
    }

    ngOnDestroy(): void {
        if (this.$listSubcription != undefined) {
            this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
    }

    setSpinner(valor: boolean) {
        this.blockedDocument = valor;
    }

     getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    
      const $getListarProducto = this.almacenService.listarPartidas()
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarProducto', rpta);
              this.lstProducto = rpta
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setSpinner(false);
          }
        });
      this.$listSubcription.push($getListarProducto)
    }


    onVer(dato: any) {
        this.tituloDetalle = 'VER REGISTRO';
        this.dataDet = {
            idcodigo: dato.idordencompra,
            paramReg: 'V',
        };
    }

    onEditar(dato: any) {
        
        const refItem = this.dialogService.open(CModalProductoComponent, {
          data: dato,
          header: "Editar Partida de Servicios",
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '40%'
        });
        refItem.onClose.subscribe((rpta: any) => {
          
          console.log('onClose',rpta);
          if (rpta !== undefined) {
            console.log('altaRapida',rpta.objeto.codigo);
            this.getListar();      
          }
        });
    }

    onNuevo() {
        this.tituloDetalle = 'NUEVO REGISTRO';
        this.dataDet = {
            idcodigo: 0,
            paramReg: 'N',
        };
    }

     altaRapida() {
        const refItem = this.dialogService.open(CModalProductoComponent, {
          //data: data,
          header: "Registro Partida de Servicios",
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '40%'
        });
        refItem.onClose.subscribe((rpta: any) => {
          
          console.log('onClose',rpta);
          if (rpta !== undefined) {
            console.log('altaRapida',rpta.objeto.codigo);
            this.getListar();      
          }
        });
      }
}
