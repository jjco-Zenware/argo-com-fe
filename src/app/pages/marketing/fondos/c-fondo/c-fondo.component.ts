import { Component, OnDestroy, OnInit } from '@angular/core';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { CModalFondoComponent } from '../c-modal-fondo/c-modal-fondo.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { MarketingService } from '../../service/marketingServices';

@Component({
  selector: 'app-c-fondo',
  templateUrl: './c-fondo.component.html',
  styleUrls: ['./c-fondo.component.scss']
})
export class CFondoComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    vistaLista: boolean = true;
    visDetalle: boolean = false;
    lstFondos: any[] = [];
    tituloDetalle!: string;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    data:any;
    frmDatos!: FormGroup;
    lstQ = [
      { id: 0, desQ: 'TODOS' },
      { id: 1, desQ: 'Q1' },
      { id: 2, desQ: 'Q2' },
      { id: 3, desQ: 'Q3' },
      { id: 4, desQ: 'Q4' }
  ];
  lstProveedores: any[]=[];
  lstMonedas: any[] = []; 

    constructor(
        private fb: FormBuilder,
        public dialogService: DialogService  ,  
        private serviceSharedApp: SharedAppService    ,
        private utilitariosService: UtilitariosService,    
        private marketingService: MarketingService
      ){          
    }

    ngOnInit(): void{
      this.listaProveedores();  
      this.listaMonedas();  
      this.createFrm();
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

      createFrm(){
        this.frmDatos = this.fb.group({    
            anio: [{value: this.utilitariosService.obtenerFechaInicioMes(),disabled: false}],  
            idq: [{value: 0,disabled: false}], 
            idusuario: [{value: constantesLocalStorage.idusuario,disabled: false}],
            idproveedor: [{value: 0,disabled: false}],
            idmoneda: [{value: 0,disabled: false}],
        }) 
      }

    getListar(){
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
      // const objeto = {
      //   idofi : 0
      // }
      // console.log('objeto', objeto);

      const $getListar = this.marketingService.listarFondosTrimestrales(this.frmDatos.getRawValue())
        .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              console.log('rpta lstFondos', rpta.registro);
              this.lstFondos = rpta.registro
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
        const refItem = this.dialogService.open(CModalFondoComponent, {
          data: dato,
          header: "Editar Registro" ,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '40%'
        });
        refItem.onClose.subscribe((rpta: any) => {    
          console.log('onClose',rpta);  
          this.getListar();
        });
    }  

    


    onNuevo() {        
      this.data = {
        idcodigo: 0,
        paramReg:'N'
      }     

      const refItem = this.dialogService.open(CModalFondoComponent, {
        data: this.data,
        header: "Nuevo Registro" ,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: ' 40%'
      });
      refItem.onClose.subscribe((rpta: any) => {   
        console.log('onClose',rpta);   
        this.getListar();
      });
    }

    listaMonedas() {
      const $listaMonedas = this.marketingService.obtenerMonedas().subscribe({
        next: (rpta: any) => {
          console.log('listaMonedas', rpta);
          this.lstMonedas = rpta; 
          
          this.lstMonedas.unshift(
            {
              idmoneda:0,
              desmoneda:"TODOS"
            }
          )      
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
      });
      this.$listSubcription.push($listaMonedas);
    }

    listaProveedores() {
      const $getClientes = this.marketingService.obtenerClientes('PRO').subscribe({
        next: (rpta: any) => {
          this.lstProveedores = rpta;
          this.lstProveedores.unshift(
            {
              idcliente:0,
              nomcomercial:"TODOS"
            }
          )
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => { },
      });
      this.$listSubcription.push($getClientes);
    }

}