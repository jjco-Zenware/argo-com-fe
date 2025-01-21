import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import * as FileSaver from 'file-saver';
import { CModalProgramComponent } from '../modal-progra/c-modal-program.component';

@Component({
  selector: 'app-c-programacion',
  templateUrl: './c-programacion.component.html',
  styleUrls: ['./c-programacion.component.scss']
})

export class CProgramacionComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  lstCuentas: any[] = [];
  vistaLista: boolean = true;
  visDetalle: boolean = false;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  tituloDetalle: string = "";
  cols: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  lstMonedas: any;
  lstCliente: any;
  dataDet:any;
  lstIngresos:any[] = [
  {
    "nomcomercial": "ADISTEC PERU S.A.C.",
    "ruc": "20536105523",
    "fecha": "08/11/2024",
    "nommoneda": "SOLES",
    "s_monto_total": 15000.00,
    "nomestado": "PENDIENTE"
    //"serevity_estado":"success"
  },
  {
    "nomcomercial": "VIETTEL PERU S.A.C.",
    "ruc": "20543254798",
    "fecha": "08/11/2024",
    "nommoneda": "DOLARES",
    "s_monto_total": 25000.00,
    "nomestado": "PENDIENTE"
  }];

  lstEgresos:any[] = [
    {
      "nomcomercial": "CONMASTER",
      "ruc": "20604146853",
      "fecha": "08/11/2024",
      "nommoneda": "SOLES",
      "s_monto_total": 35000.00,
      "nomestado": "PENDIENTE"
    }];

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
      // this.listaMonedas();
      // this.listaCliente();
      this.getListar();
      this.cols = [
        { field: 'nomcomercial', header: 'ID ALMACÉN' },
        { field: 'nommoneda', header: 'NOMBRE' },
        { field: 'nommoneda', header: 'NOMBRE' },
        { field: 's_monto_total', header: 'DIRECCIÓN' },
        { field: 'nomestado', header: 'ESTADO' }
        
    ];
  }

  createFrm(){
      this.frmDatos = this.fb.group({          
        fechaini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fechafin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
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

    const $getListar = this.tesoreriaService.listarProgramacion(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta getListar', rpta);
            this.lstCuentas = rpta;
            // this.lstIngresos = this.lstCuentas.filter((x: { estado: string; }) => x.estado === 'PRC');
            // this.lstEgresos = this.lstCuentas.filter((x: { estado: string; }) => x.estado === 'EMI');
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
      this.lstExportExcel = this.lstIngresos;
    }else{
      this.lstExportExcel = this.lstEgresos;
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

  programarDocumento() {
    console.log('programarDocumento');
    const refItem = this.dialogService.open(CModalProgramComponent, {
      data: null,
      header: "Nueva Programación",
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      
      console.log('onClose',rpta);
      if (rpta != undefined) {
        this.getListar()
      }      
    });
  }

  verDetalle(data: any) {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const $getListar = this.tesoreriaService.traerunoprcProgramacion(data.idprogramacion)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            //console.log('rpta verDetalle', rpta);
            this.dataDet = rpta;
            this.tituloDetalle = rpta[0].descripcion_proyecto.toUpperCase();
            this.vistaLista = false;
            // this.lstIngresos = this.lstCuentas.filter((x: { estado: string; }) => x.estado === 'PRC');
            // this.lstEgresos = this.lstCuentas.filter((x: { estado: string; }) => x.estado === 'EMI');
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

    
    // const refItem = this.dialogService.open(CModalProgramComponent, {
    //   data: data,
    //   header: "Detalle de Documento N° - " ,
    //   closeOnEscape: false,
    //   styleClass: 'testDialog',
    //   width: '40%'
    // });
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
}

