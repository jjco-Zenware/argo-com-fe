
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CBusquedaProductoComponent } from '../../busqueda-producto/c-busqueda-producto.component';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';

@Component({
  selector: 'app-c-kardex',
  templateUrl: './c-kardex.component.html',
  styleUrls: ['./c-kardex.component.scss']
})
export class CKardexComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    lstAlmacen: any;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    lstProducto:any;
    tituloKardex: string = 'KARDEX';
    idprod: any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private proyectosService: ProyectosService,   
        private confirmationService: ConfirmationService,  
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        
      ){    
        
    }

    ngOnInit(): void{
        this.createFrm();
        //this.getListar();
        this.cols = [
          { field: 'idordencompra', header: 'ID ALMACÉN' },
          { field: 'nomtipoorden', header: 'OFICINA ' },
          { field: 'codigonroorden', header: 'NOMBRE' },
          { field: 'nomcomercial', header: 'DIRECCIÓN' },
          { field: 'nomestado', header: 'ESTADO' }
          
      ];

        // this.confirmationService.confirm({
        //     key: 'confirm1',
        //     header: 'Aviso',
        //     message:  'Existen Nuevas Funcionalidades...',
        //     accept: () => {
        //       this.acceptfuncionalidad();
        //     }
        // });
    }

    createFrm(){
        this.frmDatos = this.fb.group({
          fechaini: [{value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
          fechafin: [{value: this.utilitariosService.obtenerFechaFinMes(), disabled: false}],     
          idusuario: [{value: constantesLocalStorage.idusuario, disabled: false}],
          codproducto: [{value: '',disabled: false}]          
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
        idprod : this.idprod
      }

      const $getListarOrdenCompra = this.proyectosService.kardexlistar(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta kardex', rpta);
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

    acceptfuncionalidad() {
        this.confirmationService.confirm({
            message: 'Se agrego este nuevo filtro para la busqueda de Productos...',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            }
        });
    }

    getBusquedaAvanzada(data: any) {
      console.log('CBusquedaProductoComponent', data);
      const refItem = this.dialogService.open(CBusquedaProductoComponent, {
        data: data,
        header: "Busqueda Avanzada por Productos",
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '60%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        
        console.log('onClose',rpta.data);
        this.tituloKardex = "KARDEX  -  CÓDIGO: " + rpta.data.codproducto + "  -  PRODUCTO: " + rpta.data.despro ;
        this.frmDatos.get('codproducto')?.setValue(rpta.data.codproducto);
        this.idprod = rpta.data.idprod
        this.getListar();
        // if (rpta != undefined) {
        //     const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == index))
        //     if (_posAll != -1) {
        //       this.lstItemOC.splice(_posAll, 1)
        //     }
        //     console.log('getItem',rpta.objeto);
        //   this.lstItemOC.push(rpta.objeto);
        //   console.log('this.lstItemOC',this.lstItemOC);
        // }
      });
    }
    
}

