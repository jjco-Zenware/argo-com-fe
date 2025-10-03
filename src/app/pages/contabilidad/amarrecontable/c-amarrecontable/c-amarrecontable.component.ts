import { Component, OnDestroy, OnInit } from '@angular/core';
import { mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ContabilidadService } from '../../service/contabilidad.services';

@Component({
  selector: 'app-c-amarrecontable',
  templateUrl: './c-amarrecontable.component.html',
  styleUrls: ['./c-amarrecontable.component.scss']
})
export class CAmarreContableComponent implements OnInit, OnDestroy{

  vistaLista: boolean = true;
  visDetalle: boolean = false;
  $listSubcription: Subscription[] = [];
  lstAmarreContable: any;
  tituloDetalle!: string;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  dataDet: any;
  dataPrc: any;

    constructor(
        public dialogService: DialogService  ,
        private contabilidadService: ContabilidadService,     
        private serviceSharedApp: SharedAppService,         
      ){          
    }

    ngOnInit(): void{
        this.getListar();
        this.cols = [
          { field: 'codigoasiento', header: 'codigoasiento' },
          { field: 'nomtipodocprc', header: 'nomtipodocprc' },
          { field: 'desasiento', header: 'desasiento' }     
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
  

    // onNuevo() {
    //   const objeto = {
    //     parmctactble: 0
    //   }
    //   const ref = this.dialogService.open(ModalAmarreComponent, {
    //       data: objeto,
    //       header: "Nueva Configuración ",
    //       styleClass: 'testDialog',
    //       closeOnEscape: false,
    //       closable: true,
    //       width: '40%'
    //   });
    //   ref.onClose.subscribe((rpta: any) => {
    //     this.getListar()
    //   });
    // }

    onVer(data: any) {
      console.log('onVer...', data);
      this.dataPrc = {
        idasientocfg: data.idasientocfg,
        paramReg:'V'
      }
      this.tituloDetalle = "VER ASIENTO CONTABLE";
      this.vistaLista = false;
      this.visDetalle = true;
  }

    onEditar(data: any) {
      console.log('onEditar...', data);
      this.dataPrc = data.idasientocfg
      this.tituloDetalle = "EDITAR ASIENTO CONTABLE";
      this.vistaLista = false;
      this.visDetalle = true;
  }

  getDetalle(dato:boolean){
      this.vistaLista = true;
      this.visDetalle = false;
  }

  getBack() {
      this.vistaLista = true;
      this.getListar();
      this.visDetalle = false;
    }

    onNuevo() {
      this.tituloDetalle = "REGISTRAR ASIENTO CONTABLE";
      this.dataPrc = {
        idasientocfg: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
      this.visDetalle = true;
    }
   
}
