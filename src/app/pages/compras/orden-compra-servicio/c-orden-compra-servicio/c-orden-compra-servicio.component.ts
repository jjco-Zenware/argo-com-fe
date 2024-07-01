import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { dOperacion } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { SharedAppService } from '@sharedAppService';
import { CDatoCotizacionViewProyecComponent } from '../../proyectos-ganados/c-dato-cotizacion-view-proyec/c-dato-cotizacion-view-proyec.component';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CModalExcTransacComponent } from '../modal-exc-transac/modal-exc-transac.component';

@Component({
  selector: 'app-c-orden-compra-servicio',
  templateUrl: './c-orden-compra-servicio.component.html',
  styleUrls: ['./c-orden-compra-servicio.component.scss']
})
export class COrdenCompraServicioComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstOrdenCompra: any;
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    dataOC:any;
    dropdownItemsEstado = [
        { name: 'Registrado', code: 'REG' },
        { name: 'Confirmado', code: 'CFM' },
        { name: 'Aprobado', code: 'APR' },
        { name: 'Rechazado', code: 'RCH' }
    ];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    menuItems: MenuItem[] = [];
    @ViewChild('menu') menu!: Menu;
    ordenCompra: any;

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
      //console.log('this.frmDatos...', this.frmDatos.value);

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

    onVer(dato: any) {
      let codigo;
      if (dato.estado === 'EMI' || dato.estado === 'ANU') {
        codigo = dato.codigonroorden;
      }else{
        codigo = dato.idordencompra;
      }
        this.tituloDetalle = "ORDEN DE COMPRA/SERVICIOS N° " + codigo;
        this.dataOC = {
          idordencompra: dato.idordencompra,
          paramReg:'V'
        }
        this.vistaLista = false;
    }

    onEditar(dato: any) {
      console.log('onEditar', dato);
      let codigo;
      if (dato.estado === 'EMI' || dato.estado === 'ANU') {
        codigo = dato.codigonroorden;
      }else{
        codigo = dato.idordencompra;
      }
        this.tituloDetalle = "ORDEN DE COMPRA/SERVICIOS N° " + codigo;
        this.dataOC = {
          idordencompra: dato.idordencompra,
          paramReg:'N'
        }
        this.vistaLista = false;
    }

    verCotiza(data: any) {
        console.log('onVer...', data);
        this.tituloDetalle = "Cotización de Orden de Compra/Servicio N° " + data.codigonroorden;
        this.vistaLista = false;
        this.visDetalle = false;
    }

    getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListarOrdenCompra();
    }

    getBack() {
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListarOrdenCompra();
    }

    onNuevo() {        
      this.tituloDetalle = "ORDEN DE COMPRA/SERVICIOS";
      this.dataOC = {
        idordencompra: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
    }

    toggleMenu(event: Event, data: any) {
      if (data.acciones) {
          this.cargarMenu(data.acciones);
          this.ordenCompra = data;
          this.menu.toggle(event);
      }
  }

    cargarMenu(data: any) {
      this.menuItems = [];
      data.forEach((item: any) => {
          this.menuItems.push({
              label: item.nomtrx,
              icon: 'pi pi-cog',
              command: () => this.onAccion(item)
          })
      });
    }
  
    onAccion(item: any) {
      this.ordenCompra.idtrx = item.idtrx;
      console.log('onAccion', item);
      const ref = this.dialogService.open(CModalExcTransacComponent, {
          data: this.ordenCompra,
          header: item.nomtrx +' - '+  this.ordenCompra.idordencompra,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '40%'
      });
  
      ref.onClose.subscribe(() => {
          this.getListarOrdenCompra();
        });
    }
}
