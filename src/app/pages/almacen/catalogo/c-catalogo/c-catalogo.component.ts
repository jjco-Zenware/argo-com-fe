
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlmacenService } from '../../service/almacenServices';

@Component({
  selector: 'app-c-catalogo',
  templateUrl: './c-catalogo.component.html',
  styleUrls: ['./c-catalogo.component.scss']
})
export class CCatalogoComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    lstCatalogo: any;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    lstProducto:any;
    lstFamilia:any;
    lstSubFamilia:any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private confirmationService: ConfirmationService,  
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private almacenService: AlmacenService, 
        
      ){    
        
    }

    ngOnInit(): void{
        this.createFrm();
        this.listarFamilia();
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
          codproducto: [{ value: '', disabled: false }],
          idfamilia:[{ value: 0, disabled: false }],
          idsubfamilia: [{ value: 0, disabled: false }],
          desproducto:[{ value: '', disabled: false }],

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
      console.log('this.frmDatos...', this.frmDatos.value);
      const objeto = {
        ...this.frmDatos.value,
        idfamilia: this.frmDatos.value.idfamilia === null ? 0 : this.frmDatos.value.idfamilia,
        idsubfamilia: this.frmDatos.value.idsubfamilia === null ? 0 : this.frmDatos.value.idsubfamilia
      }
      console.log('this.objeto...', objeto);

      const $getListarOrdenCompra = this.almacenService.buscarProducto(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarOrdenCompra', rpta);
              this.lstCatalogo = rpta
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
    
    listarFamilia() {
        const $listarFamilia = this.almacenService.listarFamilia().subscribe({
          next: (rpta: any) => {
            this.lstFamilia = rpta;
          },
          error: (err) => {
            console.info('error : ', err);
            this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
        });
        this.$listSubcription.push($listarFamilia);
      }
  
      getSubFamilia(dato: any) {  
        const $getSubFamilia = this.almacenService.listarSubFamilia(dato).subscribe({
            next: (rpta: any) => {
                this.setSpinner(false);
                console.info('next : ', rpta);
                this.lstSubFamilia = rpta;
            },
            error: (err) => {
                this.setSpinner(false);
                console.info('error : ', err);
                this.messageService.clear();
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: mensajesQuestion.msgErrorGenerico,
                });
            },
            complete: () => {},
        });
        this.$listSubcription.push($getSubFamilia);
      }
}
