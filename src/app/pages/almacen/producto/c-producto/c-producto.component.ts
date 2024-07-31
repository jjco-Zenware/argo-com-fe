import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-c-producto',
  templateUrl: './c-producto.component.html',
  styleUrls: ['./c-producto.component.scss']
})

export class CProductoComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstAlmacen: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        //private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,
        
      ){          
    }

    ngOnInit(): void{
      this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'idordencompra', header: 'CÓDIGO' },
          { field: 'nomtipoorden', header: 'PRODUCTO ' },
          { field: 'codigonroorden', header: 'FAMILIA' },
          { field: 'nomcomercial', header: 'SUBFAMILIA' },
          { field: 'nomestado', header: 'ESTADO' }
          
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
      //this.setSpinner(true);
      //this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      //console.log('this.frmDatos...', this.frmDatos.value);
      // const objeto = {
      //   ...this.frmDatos.value,
      //   idtipodocprc: 8
      // }

      // const $getListarOrdenCompra = this.proyectosService.ordenCompraList(objeto)
      //   .subscribe({
      //     next: (rpta:any) => {
      //         this.setSpinner(false);
      //         console.log('rpta getListarOrdenCompra', rpta.ordenescompra);
      //         this.lstOrdenCompra = rpta.ordenescompra
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
     
        this.tituloDetalle =  dato.nomalmacen;
        
        this.vistaLista = false;
    }

    onEditar(dato: any) {
      
        this.tituloDetalle = dato.nomalmacen;
        
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
      this.tituloDetalle = "REGISTRAR PRODUCTO";
      
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