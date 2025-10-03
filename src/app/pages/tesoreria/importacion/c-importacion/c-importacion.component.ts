import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import * as  XLSX  from 'xlsx';

@Component({
  selector: 'app-c-importacion',
  templateUrl: './c-importacion.component.html',
  styleUrls: ['./c-importacion.component.scss']
})

export class CImportacionComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  frmDatos!: FormGroup;
  lstMonedas: any;
  lstProveedor: any;
  products:any[] = [];
  verImportar: boolean = true;
  ExcelData: any;
  lstItem: any;

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
  }

  createFrm(){
      this.frmDatos = this.fb.group({          
        fecini: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],
        fecfin: [{value: this.utilitariosService.obtenerFechaFinMes(),disabled: false}],
        idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
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

  ReadExcel(event: any, fubauto: any){
      let file = event.files[0];
      let s_nombre = file.name.split('.').pop();  
          console.log('s_nombre...', s_nombre);
  
      if (s_nombre != "xlsx" && s_nombre != "xls") {
          this.messageService.add({severity: 'info', summary: 'Info', detail: "Archivo Incorrecto..." });
          fubauto.clear();
          return;
      }
  
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
  
      fileReader.onload = (e) =>{
          var workBook = XLSX.read(fileReader.result,{type:'binary'});
          console.log('workBook...', workBook);
          var sheetNames = workBook.SheetNames;
          this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
          console.log('Excel...', this.ExcelData);
         
      // const excelDateToJSDate = (serial:any) => {
      //   const utc_days = Math.floor(serial - 25569);
      //   const utc_value = utc_days * 86400; // segundos
      //   const date_info = new Date(utc_value * 1000);
      //   return date_info.toISOString().split('T')[0]; // formato YYYY-MM-DD
      // };
  
      
         this.ExcelData.forEach((item: any) => {        
           this.lstItem.push(item)
         });
      }
     
      console.log( 'listaitems...' ,this.lstItem);
      fubauto.clear();
    }

  ReadExcel2(event: any, fubauto: any){
      let file = event.files[0];
      let s_nombre = file.name.split('.').pop();  
          console.log('s_nombre...', s_nombre);
  
      if (s_nombre != "xlsx" && s_nombre != "xls") {
          this.messageService.add({severity: 'info', summary: 'Info', detail: "Archivo Incorrecto..." });
          fubauto.clear();
          return;
      }
  
       const reader = new FileReader();

        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          console.log(jsonData);

          jsonData.forEach((item: any) => {       
            item.descripcion = item.DESCRIPCIÓN; 
           this.lstItem.push(item)
         });

        };

        reader.readAsArrayBuffer(file);
     
      
      fubauto.clear();
    }
}
