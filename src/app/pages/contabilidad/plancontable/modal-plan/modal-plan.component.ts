import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente, KanbanCard } from '@interfaces';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { TesoreriaService } from 'src/app/pages/tesoreria/service/tesoreriaServices';
import { ContabilidadService } from '../../service/contabilidad.services';

@Component({
  selector: 'app-modal-plan',
  templateUrl: './modal-plan.component.html',
  styleUrls: ['./modal-plan.component.scss']
})
export class ModalPlanComponent {

  $listSubcription: Subscription[] = [];
  registerFormRegistro: any= FormGroup;
  //submitted = false;
  lstOportunidad: KanbanCard[]=[];
  lstCliente: Cliente []=[];
  annio: Date = new Date;
  verOpor: boolean = false;
  verInter: boolean = false;
  verVent: boolean = false;
  errorMensaje!: string;
  blockedDocument: boolean = false;
    mensajeSpinner: string = "Cargando...!";
    lstOrigen: any;
    lstCentroCosto:any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    public refDatoItem: DynamicDialogRef,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig,
    private contabilidadService: ContabilidadService,  

) {}


get formRegistro() { return this.registerFormRegistro.controls; }


ngOnInit(): void {  
  console.log('codigop ver...',this.config.data);
  this.createFormRegistro();
  if (this.config.data.codctactble > 0) {
    this.registerFormRegistro.patchValue({
      desctactble: this.config.data.desctactble,
      codctactble: this.config.data.codctactble,
    });
  }
}

setSpinner(valor: boolean) {
  this.blockedDocument = valor;
}



  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      desctactble: [{ value: null, disabled: false }],
      codctactble: [{ value: this.config.data.codctactble, disabled: false }],
      parmctactble: [{ value: this.config.data.parmctactble, disabled: false }],
      idrubroctb: [{ value: 0, disabled: false }],
      idclasectb: [{ value: 0, disabled: false }],
      idmodulo: [{ value: 0, disabled: false }],
      tipocuenta: [{ value: '', disabled: false }],
      idpersona: [{ value: 0, disabled: false }],
      idmoduloconc: [{ value: 0, disabled: false }],
      codtiposbs: [{ value: '', disabled: false }],
      idcartera: [{ value: 0, disabled: false }],
      indfechavalor: [{ value: false, disabled: false }],
      indsobregiro: [{ value: false, disabled: false }],
      indvbsobregiro: [{ value: false, disabled: false }],
      tipoctaori: [{ value: '', disabled: false }],
      indincremento: [{ value: false, disabled: false }],
      indbajaparcial: [{ value: false, disabled: false }],
      indaltainvertida: [{ value: false, disabled: false }],
      indmn: [{ value: false, disabled: false }],
      indme: [{ value: false, disabled: false }],
      indanaxoper: [{ value: false, disabled: false }],
      indanaxcliente: [{ value: false, disabled: false }],
      indanaxpersona: [{ value: false, disabled: false }],
      indanaxsucursal: [{ value: false, disabled: false }],
      indanaxmoneda: [{ value: false, disabled: false }],
      indaanaxcaja: [{ value: false, disabled: false }],
      indanaxplazo: [{ value: false, disabled: false }],
      indanaxfvalor: [{ value: false, disabled: false }],
      indanaxfvencim: [{ value: false, disabled: false }],
      indanaxsectoreco: [{ value: false, disabled: false }],
      indanaxresid: [{ value: false, disabled: false }],
      indresidente: [{ value: false, disabled: false }],
      inddevenga: [{ value: false, disabled: false }],
      indimputable: [{ value: false, disabled: false }],
      inddiarioope: [{ value: false, disabled: false }],
      indcaja: [{ value: false, disabled: false }],
      indempleado: [{ value: false, disabled: false }],
      indreporte: [{ value: false, disabled: false }],
      indinfoadi: [{ value: false, disabled: false }],
      indespecial: [{ value: false, disabled: false }],
      indfecven: [{ value: false, disabled: false }],
      indelimsaldo: [{ value: false, disabled: false }],
      indcodmov: [{ value: false, disabled: false }],
      indfactura: [{ value: false, disabled: false }],
      ctactbletmp: [{ value: '', disabled: false }],
      imputabletmp: [{ value: false, disabled: false }],
    });
}


guardarRegistro() {
  if (this.validarDatos())
    {
        console.log("errorMensaje : ", this.errorMensaje);
        this.messageService.add({severity: 'info', summary: 'Validación', detail: this.errorMensaje });
        return;
    }

  console.log('this.guardarRegistro...', this.registerFormRegistro.value); 

  this.contabilidadService.plancontablePrc(this.registerFormRegistro.value).subscribe({
    next: (rpta: any) => {
    //this.lstProyecto = rpta;
    if (rpta.procesoSwitch === 0) {
      console.info('lstProyecto : ', rpta );
      this.refDatoItem.close();
    }else{
      this.messageService.add({severity: 'info', summary: 'Validación', detail: rpta.mensaje});
    }
    
    },
    error: (err) => {
    console.info('error : ', err);
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

  
}



validarDatos():boolean{
  let _error = false;
  this.errorMensaje="";
  console.log('validarDatos',this.registerFormRegistro.value)

     if (this.registerFormRegistro.value.codctactble === '' || this.registerFormRegistro.value.codctactble === null)
     {
          this.errorMensaje="Ingresar Código...!";
          _error = true;
     }

     if (!_error && ( this.registerFormRegistro.value.desctactble === null || this.registerFormRegistro.value.desctactble === ''))
     {
          this.errorMensaje="Ingresar Descripción...!";
          _error = true;
     }
     
     return _error;
   }

 

}
