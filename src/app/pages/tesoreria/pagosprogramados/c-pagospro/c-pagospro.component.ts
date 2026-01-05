import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage,  mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { CModalRegPAgosComponent } from '../../modalregpagos/c-modalregpagos.component';
import { CModalListPAgosComponent } from '../../modallistpagos/c-modallistpagos.component';

@Component({
  selector: 'app-c-pagospro',
  templateUrl: './c-pagospro.component.html',
  styleUrls: ['./c-pagospro.component.scss']
})

export class CPagosProComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  lstCuentas: any[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  frmDatos!: FormGroup;
  lstMonedas: any;
  lstProveedores: any[] = [];
  s_monto_pago_sol: number = 0;
  s_monto_pago_dol: number = 0;
  indcompleto: boolean = true;

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
    this.lstCuentas = [];
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 18
    }

    const $getListar = this.proyectosService.pagosProgramados(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta',rpta);
            let lista = rpta.ordenescompra;
            this.lstCuentas = lista.filter((item:any) => item.saldo_documento > 0);
            this.s_monto_pago_sol = this.lstCuentas.filter((item:any) => item.idmoneda === 1).reduce((acc:any, item:any) => acc + item.s_monto_neto_CTB, 0);
            this.s_monto_pago_dol = this.lstCuentas.filter((item:any) => item.idmoneda === 2).reduce((acc:any, item:any) => acc + item.s_monto_neto_CTB, 0);
          
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);  }
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

  getExportarExcel() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 18,
      s_monto_pago_sol:this.s_monto_pago_sol,
      s_monto_pago_dol:this.s_monto_pago_dol,
    }

    const $getListar = this.tesoreriaService.exportarExcelpagosprogramados(objeto)
    .subscribe({
      next: (rpta:any) => {
          this.setSpinner(false);
          this.utilitariosService.descargarExcel(rpta, 'PagosProgramados');
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
      if (rpta != undefined) {
        this.getListar()   ;
      }      
    });
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
      if (rpta != undefined) {
        this.getListar()   ;
      }        
    });
  }
  
  onPagar(data :any) {
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
}
