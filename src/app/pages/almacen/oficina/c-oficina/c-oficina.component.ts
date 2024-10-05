import { Component, OnDestroy, OnInit } from '@angular/core';
import { mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { AlmacenService } from '../../service/almacenServices';
import { COficinaDetalleComponent } from '../c-oficina-detalle/c-oficina-detalle.component';

@Component({
  selector: 'app-c-oficina',
  templateUrl: './c-oficina.component.html',
  styleUrls: ['./c-oficina.component.scss']
})
export class COficinaComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstOficina: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    data:any;

    constructor(
        public dialogService: DialogService  ,
        private almacenService: AlmacenService,     
        private serviceSharedApp: SharedAppService        
      ){          
    }

    ngOnInit(): void{
        this.getListar();
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
      const objeto = {
        idofi : 0
      }
      console.log('objeto', objeto);

      const $getListar = this.almacenService.ListarOficina(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta lstOficina', rpta);
              this.lstOficina = rpta
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
        this.tituloDetalle =  dato.nomofi;     
        this.data = {
          idcodigo: dato.idofi,
          paramReg:'V'
        }    
        this.vistaLista = false;
    }

    onEditar(dato: any) {      
        //this.tituloDetalle = dato.nomalmacen; 
        this.data = {
          idcodigo: dato.idofi,
          paramReg:'E'
        }        
        //this.vistaLista = false;
        const refItem = this.dialogService.open(COficinaDetalleComponent, {
          data: this.data,
          header: "Editar Oficina" ,
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
      this.data = {
        idcodigo: 0,
        paramReg:'N'
      }     

      const refItem = this.dialogService.open(COficinaDetalleComponent, {
        data: this.data,
        header: "Registrar Oficina" ,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: ' 30%'
      });
      refItem.onClose.subscribe((rpta: any) => {   
        console.log('onClose',rpta);   
        this.getListar();
      });
    }

}