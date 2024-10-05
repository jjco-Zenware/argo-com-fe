import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
//import * as FileSaver from 'file-saver';
import { AlmacenService } from '../../service/almacenServices';
import { CAlmacenesDetalleComponent } from '../c-almacenes-detalle/c-almacenes-detalle.component';

@Component({
  selector: 'app-c-almacenes',
  templateUrl: './c-almacenes.component.html',
  styleUrls: ['./c-almacenes.component.scss']
})
export class CAlmacenesComponent implements OnInit, OnDestroy{

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
    lstOficina: any;
    data:any;

    constructor(
        private fb: FormBuilder,
        public dialogService: DialogService  ,
        private almacenService: AlmacenService,     
        private serviceSharedApp: SharedAppService,
        
      ){          
    }

    ngOnInit(): void{
      this.createFrm();
      this.listarOficinas();
        this.getListar();
    }

    createFrm(){
      this.frmDatos = this.fb.group({        
        idalmacen: [
          {
            value: 0,
            disabled: false,
          },
        ],
        idofi: [
          {
            value: 0,
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

    listarOficinas(){
      const objeto = {
        idofi : 0
      }

      const $getListar = this.almacenService.ListarOficina(objeto)
        .subscribe({
          next: (rpta:any) => {              
              this.lstOficina = rpta
              const objet = {
                idofi: 0,
                nomofi: 'TODOS'
              }
              this.lstOficina.unshift(objet);
          },
          error:(err)=>{
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
          }
        });
      this.$listSubcription.push($getListar)
    }

    getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      console.log('this.frmDatos...', this.frmDatos.value);
      const objeto = {
        ...this.frmDatos.value
      }

      const $getListar = this.almacenService.ListarAlamcen(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta lstAlmacen', rpta);
              this.lstAlmacen = rpta
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

    onVer(dato: any) {     
        this.tituloDetalle =  dato.nomalmacen;     
        this.data = {
          idcodigo: dato.idalmacen,
          paramReg:'V'
        }    
        this.vistaLista = false;
    }

    onEditar(dato: any) {      
        //this.tituloDetalle = dato.nomalmacen; 
        this.data = {
          idcodigo: dato.idalmacen,
          paramReg:'E'
        }        
        //this.vistaLista = false;
        const refItem = this.dialogService.open(CAlmacenesDetalleComponent, {
          data: this.data,
          header: "Editar Almacén" ,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '30%'
        });
        refItem.onClose.subscribe((rpta: any) => {    
          console.log('onClose',rpta);  
          this.getListar();
        });
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
      //this.tituloDetalle = "REGISTRAR ALMACÉN";  
      this.data = {
        idcodigo: 0,
        paramReg:'N'
      }     
      //this.vistaLista = false;

      const refItem = this.dialogService.open(CAlmacenesDetalleComponent, {
        data: this.data,
        header: "Registrar Almacén" ,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: ' 30%'
      });
      refItem.onClose.subscribe((rpta: any) => {   
        console.log('onClose',rpta);   
        this.getListar();
      });
    }


    // getExportarExcel(data :any) {
    //   this.lstExportar = [];
    //   console.log(data.filteredValue);
    //   if (data.filteredValue !== undefined) {
    //     this.lstExportExcel = data.filteredValue;
    //   }
    //   console.log( 'this.lstExportar...',  this.lstExportar);

      
    //   for (let i = 0; i < this.lstExportExcel.length; i++) {       
    //       const objeto = {
    //           'N°': i + 1,
    //           'TIPO': this.lstExportExcel[i].nomtipoorden,
    //           'N° ORDEN': this.lstExportExcel[i].codigonroorden,
    //           'N° RUC': this.lstExportExcel[i].nrodocumento,
    //           'PROVEEDOR': this.lstExportExcel[i].nomcomercial,
    //           'COD PROYECTO' : this.lstExportExcel[i].codigoproyecto,
    //           'NOM PROYECTO' : this.lstExportExcel[i].nomproyecto,
    //           'MONEDA': this.lstExportExcel[i].nommoneda,
    //           'BASE IMPONIBLE': this.lstExportExcel[i].s_monto,
    //           'IGV': this.lstExportExcel[i].s_igv,
    //           'TOTAL': this.lstExportExcel[i].s_monto_total,
    //           'ESTADO' : this.lstExportExcel[i].nomestado
              
    //       }
    //       this.lstExportar.push(objeto);
    //   }
  
    //   import('xlsx').then((xlsx) => {
    //     const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
    //     const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //     const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     this.saveAsExcelFile(excelBuffer, 'Orden Compra');
    //     });
    //   }
  
    //   saveAsExcelFile(buffer: any, fileName: string): void {
    //     let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    //     let EXCEL_EXTENSION = '.xlsx';
    //     const data: Blob = new Blob([buffer], {
    //         type: EXCEL_TYPE
    //     });
    //     FileSaver.saveAs(data, fileName + '_export_'+ EXCEL_EXTENSION);
    //   }
}

