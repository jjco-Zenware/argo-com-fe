import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { CModalListPAgosComponent } from '../../modallistpagos/c-modallistpagos.component';
import { CModalRegPAgosComponent } from '../../modalregpagos/c-modalregpagos.component';
import { CModalProgramacionComponent } from '../../modalfecprogramacion/c-modalfecprogramacion.component';

@Component({
  selector: 'app-c-cuentaporpagar',
  templateUrl: './c-cuentaporpagar.component.html',
  styleUrls: ['./c-cuentaporpagar.component.scss']
})

export class CCuentaporPagarComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  lstCuentas: any[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  lstMonedas: any;
  lstProveedores: any[] = [];
  saldo_documento_sol: number = 0;
  saldo_documento_dol: number = 0;
  s_monto_recaudado_sol: number = 0;
  s_monto_recaudado_dol: number = 0;
  
  @Output() OB_back = new EventEmitter<boolean>();

  lstEstado = [
    {value: '000', name: 'TODOS' },
    {value: 'PEN', name: 'PENDIENTE' }, 
    {value: 'PAR', name: 'PARCIAL' }, 
    {value: 'PAG', name: 'PAGADO' }, 
  ]

  constructor(
      private fb: FormBuilder,
      private utilitariosService: UtilitariosService,
      public dialogService: DialogService  ,
      private confirmationService: ConfirmationService,  
      private serviceSharedApp: SharedAppService,
      private messageService: MessageService,
      private tesoreriaService: TesoreriaService, 
      private proyectosService: ProyectosService,
      
    ){    
      
  }

  ngOnInit(): void{
      this.createFrm();
      this.listaMonedas();
      this.listaProveedores();
      this.listaProveedores();
    this.getListar();
  }

  createFrm(){
      this.frmDatos = this.fb.group({          
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
        idproveedor: [{ value: 0, disabled: false }],
        idmoneda: [{value: 0,disabled: false}],
        idcliente: [{value: 0,disabled: false}],
        estado: [{value: '000' ,disabled: false}],
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
    this.saldo_documento_sol =0;
    this.saldo_documento_dol =0;
    this.s_monto_recaudado_sol =0;
    this.s_monto_recaudado_dol =0;

    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 18
    }

    const $getListar = this.proyectosService.ordenCompraListCuentas(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta',rpta);

            this.lstCuentas = rpta.ordenescompra;

          
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);
          this.saldo_documento_sol = this.lstCuentas.filter((item:any) => item.idmoneda === 1).reduce((acc:any, item:any) => acc + item.saldo_documento, 0);
          this.saldo_documento_dol = this.lstCuentas.filter((item:any) => item.idmoneda === 2).reduce((acc:any, item:any) => acc + item.saldo_documento, 0);
          this.s_monto_recaudado_sol = this.lstCuentas.filter((item:any) => item.idmoneda === 1).reduce((acc:any, item:any) => acc + item.s_monto_recaudado, 0);
          this.s_monto_recaudado_dol = this.lstCuentas.filter((item:any) => item.idmoneda === 2).reduce((acc:any, item:any) => acc + item.s_monto_recaudado, 0);
        }
      });
    this.$listSubcription.push($getListar)
  }
  
  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        //console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;       
        const objet = {
          idmoneda: 0,
          desmoneda: 'TODOS'
        }
        this.lstMonedas.unshift(objet);
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);

  }
  

  listaProveedores() {

    const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
      next: (rpta: any) => {
        this.lstProveedores = rpta;
        const objet = {
          idcliente: 0,
          nomcomercial: 'TODOS'
        }
        this.lstProveedores.unshift(objet);
        //console.log('this.lstProveedores', this.lstProveedores);
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($getClientes);

  }

  getBack(){
    this.OB_back.emit(true);
  }

    onVer(data :any) {
      data.tipodeuda = 1;
      const refItem = this.dialogService.open(CModalListPAgosComponent, {
        data: data,
        header: "Lista de Pagos / "+ data.nomcomercial + ' / N° FACT - ' + data.nrofactura,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '50%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        this.getListar();         
      });
    }
    
    onPagar(data :any) {
      if (data.fecprogramacion === null || data.fecprogramacion === undefined || data.fecprogramacion === '') {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Ingresar Fecha de Pago..' });
          return;        
      }

      data.tipodeuda = 1;
      const refItem = this.dialogService.open(CModalRegPAgosComponent, {
            data: data,
            header: "Registrar Pagos",
            closeOnEscape: false,
            styleClass: 'testDialog',
            width: '30%'
          });
          refItem.onClose.subscribe((rpta: any) => {
            
            console.log('onClose',rpta);
            if (rpta != undefined) {
              this.getListar()   ;
            }
          });
    }


  onPagarDetra(data :any) {
    console.log('onPagarDetra',data);
    data.tipodeuda = 2;
    const refItem = this.dialogService.open(CModalRegPAgosComponent, {
          data: data,
          header: "Pagar Detracción",
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '30%'
        });
        refItem.onClose.subscribe((rpta: any) => {
          console.log('onClose',rpta);
          if (rpta != undefined) {
            this.getListar()   ;
          }
        });
  }

  onVerDetra(data :any) {
    data.tipodeuda = 2;
    const refItem = this.dialogService.open(CModalListPAgosComponent, {
      data: data,
      header: "Pago Detracción de "+ data.nomcomercial + ' / FACT N° - ' + data.nrofactura,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '50%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      this.getListar();         
    });
  }

  onProgramarPago(data :any){
    console.log('onProgramarPago',data);
    const refItem = this.dialogService.open(CModalProgramacionComponent, {
      data: data,
      header: "Programación de Pagos" ,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '20%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      if (rpta != undefined) {
        this.getListar()   ;
        
      }        
    });
  }
  

  getExportarExcel() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 18,
      saldo_documento_sol:this.saldo_documento_sol,
      saldo_documento_dol:this.saldo_documento_dol,
      s_monto_recaudado_sol: this.s_monto_recaudado_sol,
      s_monto_recaudado_dol: this.s_monto_recaudado_dol,
    }

    const $getListar = this.tesoreriaService.exportarexcelcuentas(objeto)
    .subscribe({
      next: (rpta:any) => {
          this.setSpinner(false);
          this.utilitariosService.descargarExcel(rpta, 'CuentasPorPagar');
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
