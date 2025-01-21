import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';

@Component({
  selector: 'app-c-cajachica',
  templateUrl: './c-cajachica.component.html',
  styleUrls: ['./c-cajachica.component.scss']
})

export class CCajachicaComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  vistaLista: boolean = true;
  visDetalle: boolean = false;
  lstCaja: any;
  tituloDetalle!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  dataDet: any;

  constructor(
      private fb: FormBuilder,
      private utilitariosService: UtilitariosService,
      public dialogService: DialogService  ,
      private proyectosService: ProyectosService,     
      private serviceSharedApp: SharedAppService,
      private tesoreriaService: TesoreriaService,            
    ){          
  }

  ngOnInit(): void{
      this.createFrm();
      this.getListar();
      this.cols = [
        { field: 'idordencompra', header: 'CÓDIGO' },
        { field: 'nomtipoorden', header: 'NOMBRE ' },
        { field: 'nomcomercial', header: 'TIPO' },
        { field: 'nomestado', header: 'DOCUMENTO' },
        { field: 'nomestado', header: 'NRO' },
        { field: 'nomestado', header: 'CTA CTBLE' }
        
    ];
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

    this.lstCaja = [{
      "nomusuario":"SINDY JULIET", 
      "tipodoc":"BOLETA",
      "nrodoc":"B001-000034",
      "razonsocial":"FRUTERIA",
      "fechacaja":"11/11/2024",
      "motivo":"COMPRA DE FRUTAS",
      "monto":100,
      "moneda":"SOLES"
    },
    {
      "nomusuario":"SINDY JULIET", 
      "tipodoc":"BOLETA",
      "nrodoc":"B002-000444",
      "razonsocial":"TIENDAS MIAS",
      "fechacaja":"11/11/2024",
      "motivo":"COMPRA DE MENAJE",
      "monto":200,
      "moneda":"SOLES"
    }]

    this.setSpinner(false);
    
    // const $getListarOrdenCompra = this.tesoreriaService.listarBanco()
    //   .subscribe({
    //     next: (rpta:any) => {
    //         this.setSpinner(false);
    //         console.log('getListar', rpta);
    //         this.lstCaja = rpta;
    //     },
    //     error:(err)=>{
    //         this.setSpinner(false);
    //         this.serviceSharedApp.messageToast()
    //     },
    //     complete:() => {
    //       this.setSpinner(false);
    //     }
    //   });
    // this.$listSubcription.push($getListarOrdenCompra)
  }

  onVer(dato: any) {     
    this.tituloDetalle =  dato.nomusuario;
    this.dataDet = {
      idcodigo: dato.idbanco,
      paramReg:'V'
    } 
    this.vistaLista = false;
  }

  onEditar(dato: any) {
    this.tituloDetalle = dato.nomusuario;
    this.dataDet = {
      idcodigo: dato.idbanco,
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
    this.tituloDetalle = "NUEVO REGISTRO CAJA CHICA";
    this.dataDet = {
      idcodigo: 0,
      paramReg:'N'
    }
    this.vistaLista = false;
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
}
