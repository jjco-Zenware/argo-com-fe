import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { AlmacenService } from '../../service/almacenServices';

@Component({
  selector: 'app-c-producto',
  templateUrl: './c-producto.component.html',
  styleUrls: ['./c-producto.component.scss']
})

export class CProductoComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstProducto: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    data:any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        private almacenService: AlmacenService,     
        private serviceSharedApp: SharedAppService,
        
      ){          
    }

    ngOnInit(): void{
      this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'idprod', header: 'ID' },
          { field: 'codproducto', header: 'CÓDIGO' },
          { field: 'despro', header: 'DESCRIPCIÓN ' },
          { field: 'nomfamilia', header: 'GRUPO' },
          { field: 'nomsubfamilia', header: 'CATEGORIA' },
          { field: 'nommarca', header: 'MARCA' },
          { field: 'nomunidad', header: 'UNIDAD' }
          
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
    
      const $getListarProducto = this.almacenService.listarProducto()
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta getListarProducto', rpta);
              this.lstProducto = rpta
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setSpinner(false);
          }
        });
      this.$listSubcription.push($getListarProducto)
    }

    onVer(dato: any) {     
        this.tituloDetalle =  dato.despro;
        this.data = {
          idcodigo: dato.idprod,
          paramReg:'V'
        }        
        this.vistaLista = false;
    }

    onEditar(dato: any) {      
        this.tituloDetalle = dato.despro;
        this.data = {
          idcodigo: dato.idprod,
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
      this.tituloDetalle = "REGISTRAR PRODUCTO";
      this.data = {
        idcodigo: 0,
        paramReg:'N'
      }  
      this.vistaLista = false;
    }

    verDetalleProducto(data :any){
      console.log('verDetalleProducto', data);
    }

    exportarExcel() {
        // if(this.lstCatalogo === undefined || this.lstCatalogo.length === 0){
        //     this.messageService.add({ severity: 'warn', summary: 'Alerta', detail: 'No hay datos para exportar.' });
        //     return;
        //   }

     this.setSpinner(true);
     this.mensajeSpinner = mensajesSpinner.msjRecuperaLista;
  
     const $getListar = this.almacenService.exportarexcelstock(this.frmDatos.value)
     .subscribe({
       next: (rpta:any) => {
           this.setSpinner(false);
           this.utilitariosService.descargarExcel(rpta, 'Stock');
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