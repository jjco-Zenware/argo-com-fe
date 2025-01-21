import { Component, OnDestroy, OnInit } from '@angular/core';
import { mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ContabilidadService } from '../../service/contabilidad.services';

@Component({
  selector: 'app-c-plancontable',
  templateUrl: './c-plancontable.component.html',
  styleUrls: ['./c-plancontable.component.scss']
})
export class CPlanContableComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstPlanContable: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    dataDet: any;

    constructor(
        public dialogService: DialogService  ,
        private contabilidadService: ContabilidadService,     
        private serviceSharedApp: SharedAppService,         
      ){          
    }

    ngOnInit(): void{
        this.getListar();
        this.cols = [
          { field: 'codctactble', header: 'codctactble' },
          { field: 'desctactble', header: 'desctactble' },
          // { field: 'desmodulo', header: 'desmodulo' },
          // { field: 'desclasectb', header: 'desclasectb' },
          // { field: 'desrubroctb', header: 'desrubroctb' },
          // { field: 'tipocuenta', header: 'tipocuenta'},
          // { field: 'vindimputable', header: 'vindimputable'}
          
      ];
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
      
      const $listarPlanContable = this.contabilidadService.listarPlanContable()
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('getListar', rpta);
              this.lstPlanContable = rpta;
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setSpinner(false);
          }
        });
      this.$listSubcription.push($listarPlanContable)
    }

    onVer(dato: any) {     
      this.tituloDetalle =  dato.razonsocial;
      this.dataDet = {
        idcodigo: dato.idbanco,
        paramReg:'V'
      } 
      this.vistaLista = false;
    }

    onEditar(dato: any) {
      this.tituloDetalle = dato.razonsocial;
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
      this.tituloDetalle = "NUEVO REGISTRO";
      this.dataDet = {
        idcodigo: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
    }
   
}
