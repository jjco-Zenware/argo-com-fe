import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-c-centrocosto',
  templateUrl: './c-centrocosto.component.html',
  styleUrls: ['./c-centrocosto.component.scss']
})

export class CCentroCostoComponent implements OnInit, OnDestroy{

  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  cuentaVisible: boolean = false;
  IdCentroCosto: number = 0;
  lstCentroCosto: any;
  frmDatos!: FormGroup;
  vistaLista: boolean = true;
  visDetalle: boolean = false;
  dataDet:any;
  tituloDetalle: string ='';

  constructor(
      private fb: FormBuilder,
      public dialogService: DialogService  , 
      private serviceSharedApp: SharedAppService,
      private tesoreriaService: TesoreriaService, 
      private messageService: MessageService, 
    ){    
      
  }

  ngOnInit(): void{
    this.listarCentroCosto();
    this.cols = [
      { field: 'idcentrocosto', header: 'ID' },
      { field: 'codcentrocosto', header: 'CODIGO ' },
      { field: 'descentrocosto', header: 'DESCRIPCION' }        ,
      { field: 'codctactble', header: 'codctactble' }   
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

  listarCentroCosto(){    
    this.setSpinner(true);
      this.mensajeSpinner = 'Cargando...!';

    const $getListarOrdenCompra = this.tesoreriaService.listarCentroCosto()
      .subscribe({
        next: (rpta:any) => {
            this.lstCentroCosto = rpta;
            console.log('listarCentroCosto...', this.lstCentroCosto);
            this.setSpinner(false);
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
            this.setSpinner(false);
        }
      });
    this.$listSubcription.push($getListarOrdenCompra)
  }
  
  
  
  agregarCentroCosto(){
    const objeto = {
      idcentrocosto: 0,
    }

    this.dataDet = objeto;
    this.tituloDetalle = "REGISTRAR CENTRO COSTOS";
    this.vistaLista = false;
    this.visDetalle = true;
  }

  editarCentroCosto(objeto:any){
    console.log('editarLinea', objeto);
    this.dataDet = objeto;
    
    this.tituloDetalle = "EDITAR CENTRO COSTOS";
    this.vistaLista = false;
    this.visDetalle = true;
  }

  eliminarCentroCosto(objeto:any){
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjInactivar;

    const $eliminarCuenta = this.tesoreriaService.eliminarCentroCosto(objeto.idcentrocosto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje }); 
          this.listarCentroCosto(); 
         }else{
          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
         }
      },
      error: (err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
        this.setSpinner(false);
      },
    });
    this.$listSubcription.push($eliminarCuenta);
    
  }

  getBack() {
    this.vistaLista = true;
    this.visDetalle = false;
    this.listarCentroCosto();
  }
  
}
