import { Component, OnDestroy, OnInit } from '@angular/core';
import { mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ContabilidadService } from '../../service/contabilidad.services';
import { ModalAmarreComponent } from '../modal-plan/modal-amarre.component';

@Component({
  selector: 'app-c-amarrecontable',
  templateUrl: './c-amarrecontable.component.html',
  styleUrls: ['./c-amarrecontable.component.scss']
})
export class CAmarreContableComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    lstAmarreContable: any;
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
          { field: 'nomtipodocprc', header: 'nomtipodocprc' },
          { field: 'nomcategoria', header: 'nomcategoria' },
          { field: 'nomconceptoctble', header: 'nomconceptoctble' },
          { field: 'nomctactble', header: 'nomctactble' },
          { field: 'nompartidacfg', header: 'nompartidacfg' }
          
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

      const objeto = {
        idasientocfg : 0,
        idtipodocprc : 0,
        idcategoria:0
      }

      const $listarAmarreContable = this.contabilidadService.listarAmarreContable(objeto)
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('getListar', rpta);
              this.lstAmarreContable = rpta;
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setSpinner(false);
          }
        });
      this.$listSubcription.push($listarAmarreContable)
    }

    onEditar(dato: any) {
      //this.tituloDetalle = "NUEVO REGISTRO";
      dato.parmctactble = 1;
      const ref = this.dialogService.open(ModalAmarreComponent, {
          data: dato,
          header: "Editar Configuración",
          styleClass: 'testDialog',
          closeOnEscape: false,
          closable: true,
          width: '40%'
      });
      ref.onClose.subscribe((rpta: any) => {
        this.getListar()
      });
    } 

    onNuevo() {
      const objeto = {
        parmctactble: 0
      }
      const ref = this.dialogService.open(ModalAmarreComponent, {
          data: objeto,
          header: "Nueva Configuración ",
          styleClass: 'testDialog',
          closeOnEscape: false,
          closable: true,
          width: '40%'
      });
      ref.onClose.subscribe((rpta: any) => {
        this.getListar()
      });
    }
   
}
