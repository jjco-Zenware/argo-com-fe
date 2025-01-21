import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-librodiario',
  templateUrl: './c-librodiario.component.html',
  styleUrls: ['./c-librodiario.component.scss']
})
export class CLibroDiarioComponent implements OnInit, OnDestroy{

    @Input() IA_data: any;
    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstBancos: any;
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    dataDet: any;

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,
        //private proyectosService: ProyectosService,     
        private serviceSharedApp: SharedAppService,  
        public config: DynamicDialogConfig       
      ){          
    }

    ngOnInit(): void{
      console.log('INICIO ASIENTO...', this.config.data);
        this.createFrm();
        this.getListar();
        this.cols = [
          { field: 'razonsocial', header: 'NOMBRE ' },
          { field: 'destipobanco', header: 'TIPO BANCO' },
          { field: 'idtipodoc', header: 'TIPO DOC' },
          { field: 'nrodoc', header: 'NRO DOC' },
          { field: 'codctactble', header: 'CTA CTBLE' },
          { field: 'codigobcr', header: 'BCR'},
          { field: 'codbancosbs', header: 'SBS'},
          { field: 'codbancosunat', header: 'SUNAT'}
          
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
      //this.setSpinner(true);
      //this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      
      // const $getListarOrdenCompra = this.tesoreriaService.listarBanco()
      //   .subscribe({
      //     next: (rpta:any) => {
      //         this.setSpinner(false);
      //         console.log('getListar', rpta);
      //         this.lstBancos = rpta;
      //     },
      //     error:(err)=>{
      //         this.setSpinner(false);
      //         this.serviceSharedApp.messageToast()
      //     },
      //     complete:() => {
      //       this.setSpinner(false);
      //     }
      //   });
      // this.$listSubcription.push($getListarOrdenCompra)
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
      this.tituloDetalle = "REGISTRAR BANCO ";
      this.dataDet = {
        idcodigo: 0,
        paramReg:'N'
      }
      this.vistaLista = false;
    }
   
}
