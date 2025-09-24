import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import * as FileSaver from 'file-saver';
import { AlmacenService } from '../../service/almacenServices';
import { MessageService } from 'primeng/api';

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
        private messageService: MessageService
      ){          
    }

    ngOnInit(): void{
      this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'codproducto', header: 'CÓDIGO' },
          { field: 'despro', header: 'DESCRIPCIÓN ' },
          { field: 'nomfamilia', header: 'GRUPO' },
          { field: 'nomsubfamilia', header: 'CATEGORIA' },
          { field: 'nommarca', header: 'MARCA' },
          { field: 'modelo', header: 'modelo' },
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
        this.tituloDetalle =  dato.codproducto + ' - ' + dato.despro;
        this.data = {
          idcodigo: dato.idprod,
          paramReg:'V'
        }        
        this.vistaLista = false;
    }

    onEditar(dato: any) {      
        this.tituloDetalle = dato.codproducto + ' - ' + dato.despro;
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

   onVerDetalle(data: any) { 
             
             this.setSpinner(true);
           this.mensajeSpinner = 'Descargando...!';
       
           const objeto = {
             idprod: data.idprod
           }
       
           const $cargarOrdenC = this.almacenService.rdlcProducto(objeto).subscribe({
             next: (rpta: any) => {
               this.setSpinner(false);      
               
               const mediaType = 'application/pdf';
                 const blob = new Blob([rpta.body], { type: mediaType });
                 const filename = 'Producto_'+ data.codproducto;
         
                 const url = window.URL.createObjectURL(blob);
                 const a = document.createElement('a');
                 a.href = url;
                 a.download = filename;
                 document.body.appendChild(a);
                 a.target = '_blank';
                 a.click();
       
                 window.open(url);
       
                 setTimeout(() => {
                     document.body.removeChild(a);
                     window.URL.revokeObjectURL(url);
                 }, 100);
             },
                 error: (err) => {
                   this.setSpinner(false);
                 this.messageService.clear();
                 this.messageService.add({
                     severity: 'error',
                     summary: 'Error',
                     detail: mensajesQuestion.msgErrorGenerico,
                 });
             },
                 complete: () => {
             },
           });
           this.$listSubcription.push($cargarOrdenC)
     }
}