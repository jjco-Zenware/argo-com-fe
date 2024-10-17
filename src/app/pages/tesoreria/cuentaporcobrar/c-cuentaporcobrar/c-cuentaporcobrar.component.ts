import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-c-cuentaporcobrar',
  templateUrl: './c-cuentaporcobrar.component.html',
  styleUrls: ['./c-cuentaporcobrar.component.scss']
})


export class CCuentaporCobrarComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  lstCuentas: any;
  lstPendientes: any;
  lstAprobadas: any;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  lstMonedas: any;
  lstCliente: any;

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
      this.listaCliente();
      this.cols = [
        { field: 'idordencompra', header: 'ID ALMACÉN' },
        { field: 'nomtipoorden', header: 'OFICINA ' },
        { field: 'codigonroorden', header: 'NOMBRE' },
        { field: 'nomcomercial', header: 'DIRECCIÓN' },
        { field: 'nomestado', header: 'ESTADO' }
        
    ];
  }

  createFrm(){
      this.frmDatos = this.fb.group({          
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
        idcliente: [{ value: 0, disabled: false }],
        idmoneda: [{ value: 0, disabled: false }],
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
      idtipodocprc: 0
    }

    const $getListar = this.proyectosService.ordenCompraList(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta getListar', rpta.ordenescompra);
            this.lstCuentas = rpta.ordenescompra
            this.lstPendientes = this.lstCuentas.filter((x: { estado: string; }) => x.estado === 'PRC');
            this.lstAprobadas = this.lstCuentas.filter((x: { estado: string; }) => x.estado === 'EMI');
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

  selectHeaders(tabNumber: any) {
    if (tabNumber.index === 0) {
      this.lstExportExcel = this.lstPendientes;
    }else{
      this.lstExportExcel = this.lstAprobadas;
    }
  }


  getExportarExcel(data :any) {
    this.lstExportar = [];
    console.log(data.filteredValue);
    if (data.filteredValue !== undefined) {
      this.lstExportExcel = data.filteredValue;
    }
    console.log( 'this.lstExportar...',  this.lstExportar);

    
    for (let i = 0; i < this.lstExportExcel.length; i++) {       
        const objeto = {
            'N°': i + 1,
            'TIPO': this.lstExportExcel[i].nomtipoorden,
            'N° ORDEN': this.lstExportExcel[i].codigonroorden,
            'N° RUC': this.lstExportExcel[i].nrodocumento,
            'PROVEEDOR': this.lstExportExcel[i].nomcomercial,
            'COD PROYECTO' : this.lstExportExcel[i].codigoproyecto,
            'NOM PROYECTO' : this.lstExportExcel[i].nomproyecto,
            'MONEDA': this.lstExportExcel[i].nommoneda,
            'BASE IMPONIBLE': this.lstExportExcel[i].s_monto,
            'IGV': this.lstExportExcel[i].s_igv,
            'TOTAL': this.lstExportExcel[i].s_monto_total,
            'ESTADO' : this.lstExportExcel[i].nomestado
            
        }
        this.lstExportar.push(objeto);
    }

    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Orden Compra');
      });
    }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_'+ EXCEL_EXTENSION);
  }  
  
  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;       
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);

  }

  listaCliente() {

    const $getClientes = this.proyectosService.obtenerClientes('CLI').subscribe({
      next: (rpta: any) => {
        this.lstCliente = rpta;
        console.log('this.lstCliente', this.lstCliente);
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($getClientes);

  }
}
