import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { CModalRegPAgosComponent } from '../../modalregpagos/c-modalregpagos.component';
import { CModalListPAgosComponent } from '../../modallistpagos/c-modallistpagos.component';

@Component({
  selector: 'app-c-cuentaporcobrar',
  templateUrl: './c-cuentaporcobrar.component.html',
  styleUrls: ['./c-cuentaporcobrar.component.scss']
})

export class CCuentaporCobrarComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];

  lstPorCobrar: any;
  //lstPendientes: any;
  //lstAprobadas: any;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  //cols2: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  lstMonedas: any;
  lstProveedores: any[] = [];

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
    this.listaClientes();
    this.listaMonedas();
    this.cols = [
      { field: 'nrofactura', header: 'FACTURA' },
      { field: 'nomcomercial', header: 'PROVEEDOR ' },
      { field: 'descentrocosto', header: 'COSTO ' },
      { field: 'fecemision', header: 'EMISION' },
      { field: 'fecvencimiento', header: 'VENCIMIENTO' },
      { field: 'nommoneda', header: 'MONEDA' },
      { field: 's_monto_total', header: 'MONTO' },
      { field: 's_monto_total', header: 'SALDO' },
      { field: 'descentrocosto', header: 'COSTO ' },
      { field: 'fecemision', header: 'EMISION' },
      { field: 'fecvencimiento', header: 'VENCIMIENTO' },
      { field: 'nommoneda', header: 'MONEDA' },
      { field: 's_monto_total', header: 'MONTO' },
      { field: 's_monto_total', header: 'SALDO' },
      { field: 'nomestado', header: 'ESTADO' }      
    ];
    this.getListar();
  }


  createFrm(){
      this.frmDatos = this.fb.group({          
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
        idcliente: [{ value: 0, disabled: false }],
        idproveedor: [{value: 0,disabled: false}],
        idmoneda: [{value: 0,disabled: false}],
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
    //console.log('this.frmDatos...', this.frmDatos.value);
    const objeto = {
      ...this.frmDatos.value,
      idtipodocprc: 6
    }

    const $getListar = this.proyectosService.ordenCompraList(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);

            let lista = rpta.ordenescompra;
            if (lista.length > 0) {
              this.lstPorCobrar = lista.filter((x: { estado: string; }) => x.estado === 'EMI' || x.estado === 'EMT');
            }
            console.log('rpta lstPorCobrar', this.lstPorCobrar);
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

  // selectHeaders(tabNumber: any) {
  //   if (tabNumber.index === 0) {
  //     this.lstExportExcel = this.lstPendientes;
  //   }else{
  //     this.lstExportExcel = this.lstAprobadas;
  //   }
  // }
  
  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
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

  listaClientes() {

    const $getClientes = this.proyectosService.obtenerClientes('CLI').subscribe({
      next: (rpta: any) => {
        this.lstProveedores = rpta;
        const objet = {
          idcliente: 0,
          nomcomercial: 'TODOS'
        }
        this.lstProveedores.unshift(objet);
        console.log('this.lstProveedores', this.lstProveedores);
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($getClientes);

  }

  onVer(data :any) {
    const refItemx = this.dialogService.open(CModalListPAgosComponent, {
      data: data,
      header: "Lista de Cobros / "+ data.nomcomercial + ' / N° FACT - ' + data.nrofactura,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '50%'
    });
    refItemx.onClose.subscribe((rpta: any) => {      
      this.getListar(); 
    });
  }
  
  onPagar(data :any) {
    data.idpagodocprc = 0;
    const refItem = this.dialogService.open(CModalRegPAgosComponent, {
          data: data,
          header: "Registrar Cobro / "+ data.nomcomercial + ' / N° FACT - ' + data.nrofactura,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '30%'
        });
        refItem.onClose.subscribe((rpta: any) => {
          
          console.log('onClose',rpta);
          if (rpta != undefined) {
            this.getListar();    
          }
        });
  }

  getSeverity(data:number) {
    console.log()
    if (data > 0) {
      return 'success';
    }else{
      return 'danger';
    }
}
}
