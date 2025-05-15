import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { CModalExcAlmacenComponent } from 'src/app/pages/compras/orden-compra-servicio/modal-exc-almacen/modal-exc-almacen.component';
import { MarketingService } from 'src/app/pages/marketing/service/marketingServices';
import { CModalTransacComponent } from '../../modal-trans-gasto/modal-transac.component';

@Component({
  selector: 'app-c-infogastos',
  templateUrl: './c-infogastos.component.html',
  styleUrls: ['./c-infogastos.component.scss']
})
export class CInformeGastosComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstInfoGastos: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    frmDatos!: FormGroup;
    dataDet: any;
    menuItems: MenuItem[] = [];
    @ViewChild('menu') menu!: Menu;
    gasto: any;
    listadoArchivos: any[]=[];
    totaldolares: number = 0;
    totalsoles: number = 0;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private marketingService: MarketingService,     
        private serviceSharedApp: SharedAppService,      
                private messageService: MessageService,  
        
      ){          
    }

    ngOnInit(): void{
        this.createFrm();
        this.getListar();
    }

    createFrm(){
        this.frmDatos = this.fb.group({
          fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
          fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
          idusuario: [{value: constantesLocalStorage.idusuario, disabled: false}],
          idgasto: [{value: 0, disabled: false}],
        })
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

      const objeto = {
        ...this.frmDatos.value
      }

      const $listarGastos = this.marketingService.listarGastos(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta listarGastos', rpta);
              this.lstInfoGastos = rpta.registro
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setSpinner(false);
            this.totalsoles = this.lstInfoGastos.filter((item:any) => item.idmoneda === 1).reduce((acc:any, item:any) => acc + item.monto, 0);
          this.totaldolares = this.lstInfoGastos.filter((item:any) => item.idmoneda === 2).reduce((acc:any, item:any) => acc + item.monto, 0);
          }
        });
      this.$listSubcription.push($listarGastos)
    }

    onVer(dato: any) {
      console.log('VER GASTO DE - ', dato);
     
        this.tituloDetalle =  'VER GASTO DE - '+ dato.nomusuario;
        this.dataDet = {
          idcodigo: dato.idgasto,
          paramReg:'V'
        } 
        this.vistaLista = false;
    }

    onEditar(dato: any) {
      console.log('EDITAR GASTO DE - ', dato);
        this.tituloDetalle = 'EDITAR GASTO DE - '+ dato.nomusuario;
        this.dataDet = {
          idcodigo: dato.idgasto,
          paramReg:'E'
        }
        this.vistaLista = false;
    }

  

    getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListar();
    }

    getBack() {
      this.vistaLista = true;
      this.visDetalle = false;
      this.getListar();
    }

    onNuevo() {        
      this.tituloDetalle = "REGISTRAR NUEVO GASTO";
      this.dataDet = {
        idcodigo: 0,
        paramReg:'N',
      }
      this.vistaLista = false;
    }

      toggleMenu(event: Event, data: any) {
        if (data.acciones) {
            this.cargarMenu(data.acciones);
            this.gasto = data;
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
        console.log('onAccion', item);

        this.gasto.idtrx = item.idtrx;
        console.log('onAccion', item);
        const ref = this.dialogService.open(CModalTransacComponent, {
            data: this.gasto,
            header: item.nomtrx ,
            closeOnEscape: false,
            styleClass: 'testDialog',
            width: '30%'
        });
    
        ref.onClose.subscribe(() => {
            this.getListar();
          });
      }

       getExportarExcel() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto = {
      ...this.frmDatos.value,
      //idtipodocprc: 18,
      // saldo_documento_sol:this.saldo_documento_sol,
      // saldo_documento_dol:this.saldo_documento_dol,
      // s_monto_recaudado_sol: this.s_monto_recaudado_sol,
      // s_monto_recaudado_dol: this.s_monto_recaudado_dol,
    }

    const $getListar = this.marketingService.exportarexcelgastos(objeto)
    .subscribe({
      next: (rpta:any) => {
          this.setSpinner(false);
          this.utilitariosService.descargarExcel(rpta, 'Gastos');
      },
      error:(err)=>{
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
      },
      complete:() => {
        this.setSpinner(false);
      }
    });
  this.$listSubcription.push($getListar)
  }
}
