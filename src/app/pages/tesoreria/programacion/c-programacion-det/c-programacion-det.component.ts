
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { CModalProgramDetComponent } from '../modal-progradet/c-modal-programdet.component';
import { mensajesSpinner } from '@constantes';

@Component({
  selector: 'app-c-programacion-det',
  templateUrl: './c-programacion-det.component.html',
  styleUrls: ['./c-programacion-det.component.scss']
})
export class CProgramacionDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  registerFormRegistro: any= FormGroup;
  blockedDocument: boolean = false;
  cols: any[] = [];
  lstIngresos:any[] = [];  
  lstEgresos:any[] = [];
  mensajeSpinner: string = "";

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private tesoreriaService: TesoreriaService,  
    private comprasService: ComprasService,    
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit', this.IA_data);

    this.cols = [
        { field: 'nomcomercial', header: 'ID ALMACÉN' },
        { field: 'nommoneda', header: 'NOMBRE' },
        { field: 'nommoneda', header: 'NOMBRE' },
        { field: 's_monto_total', header: 'DIRECCIÓN' },
        { field: 'nomestado', header: 'ESTADO' }
        
    ];
    this.cargarLista();
  } 

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }
  
  agregarDocumento(data:any) {
    let titulo;
    let datos=[];
    if (data.length === 0) {
        datos = this.IA_data;
        titulo = "Nueva Programación"
    }else{
        datos.unshift(data);
        titulo = "Editar Programación N° - " + data.idprogramaciondet
    }

    const refItem = this.dialogService.open(CModalProgramDetComponent, {
      data: datos,
      header: titulo,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '30%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      
      console.log('onClose',rpta );
      if (rpta != undefined) {
        this.traerunoprcProgramacion(rpta.objeto)
      }      
    });
  }

  verDetalle(data: any) {
    console.log('verDetalle', data);
    // const refItem = this.dialogService.open(CModalProgramComponent, {
    //   data: data,
    //   header: "Detalle de Documento N° - " ,
    //   closeOnEscape: false,
    //   styleClass: 'testDialog',
    //   width: '40%'
    // });
  } 

  cargarLista(){
    let lista = this.IA_data[0].items;
    this.lstIngresos = lista.filter((x: { codtipo: string; }) => x.codtipo === 'COB');
    this.lstEgresos = lista.filter((x: { codtipo: string; }) => x.codtipo === 'PAG');
  }

  traerunoprcProgramacion(data: any) {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

    const $getListar = this.tesoreriaService.traerunoprcProgramacion(data.idprogramacion)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
           
            let lista = rpta[0].items;
            this.lstIngresos = lista.filter((x: { codtipo: string; }) => x.codtipo === 'COB');
            this.lstEgresos = lista.filter((x: { codtipo: string; }) => x.codtipo === 'PAG');
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