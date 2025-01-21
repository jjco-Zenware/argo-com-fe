import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { TesoreriaService } from '../service/tesoreriaServices';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
  selector: 'app-c-modalregpagos',
  templateUrl: './c-modalregpagos.component.html'
})
export class CModalRegPAgosComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  headerTitle?: string;
  onlyRead: boolean = false;
  registerForm!: FormGroup;
    lstMonedas: any[] = [];
    lstBancos: any;
    errorMensaje: string = "";
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
 
  constructor(
    private fb: FormBuilder,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private ordencompraService: OrdencompraService,
    private formBuilder: FormBuilder,
    private tesoreriaService: TesoreriaService, 
        private serviceUtilitario: UtilitariosService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param...', this.param);
    this.createForm();
    this.listaBanco();
    this.listaMonedas();  
    if (this.param.idpagodocprc > 0) {
      this.traeruno();
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createForm() {
    //Agregar validaciones de formulario
    this.registerForm = this.formBuilder.group({
        idpagodocprc: [{ value: 0, disabled: true }],
        iddocumentoprc :  [{ value: this.param.idordencompra, disabled: true }],
        fechapago: [{ value: new Date(), disabled: false }],
        idmoneda : [{ value: this.param.idmoneda, disabled: false }],
        monto: [{ value: this.param.saldo_documento, disabled: false }],
        tc: [{ value: 0, disabled: false }],
        nrooperacion: [{ value: null, disabled: false }],
        idbanco: [{ value: null, disabled: false }],
        montopago: [{ value:  0, disabled: false }],
        observacion: [{ value: null, disabled: false }],
        indvig :  [{ value: true, disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }]
    });
}
setSpinner(valor: boolean) {
  this.blockedDocument = valor;
}

traeruno(){
  this.registerForm.patchValue(this.param);
}

  registrarPago() {
    if (this.validarDatos())
      {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjGuardar

      let fechapago;
      fechapago = this.registerForm.value.fechapago;

    if (this.param.idpagodocprc > 0) {
      fechapago = new Date(this.serviceUtilitario.formatFecha(fechapago));      
    }

    const objeto = {
      ...this.registerForm.getRawValue(),
      fechapago,
    }

      console.log('guardarCliente...', this.registerForm.getRawValue());      
      this.tesoreriaService.prcPagoDocumento(objeto)
        .subscribe({
        next: (rpta:any) => {
          this.setSpinner(false);
            console.log("rpta prcClientes : ", rpta);
            if (rpta.procesoSwitch == 0){
                this.messageService.add({severity: 'success', detail: "Operación exitosa...!" });
                //this.registerForm.get('idpersona')?.setValue(rpta.resultProceso);
                this.cerrar({...this.registerForm.getRawValue()})
                }else{
                    this.messageService.add({severity: 'error', detail: rpta.mensaje });
                }
        },
        error:(err)=>{
          this.setSpinner(false);
            console.error('error : ',err)
            this.messageService.clear();
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: mensajesQuestion.msgErrorGenerico
            })
        },
        complete:() => {}
      });
      
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  listaMonedas() {
    const $listaMonedas = this.ordencompraService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        this.lstMonedas = rpta;       
      },
      error: (err) => {
        this.messageService.clear();
                  this.messageService.add({
                      severity: 'error',
                      summary: 'Error',
                      detail: mensajesQuestion.msgErrorGenerico
                  })
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);

  }

  listaBanco(){    
    const $listaBanco = this.ordencompraService.listarBanco()
      .subscribe({
        next: (rpta:any) => {
            this.lstBancos = rpta;
        },
        error:(err)=>{
          this.messageService.clear();
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: mensajesQuestion.msgErrorGenerico
          })
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($listaBanco)
  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";

    if (this.registerForm.value.idbanco === '' || this.registerForm.value.idbanco === null)
      {
          this.errorMensaje="Seleccionar Banco...!";
          _error = true;
      }

      if (!_error && (this.registerForm.value.tc === null || this.registerForm.value.tc ==='' || this.registerForm.value.tc === 0 ))
      {
          this.errorMensaje="Ingresar Tipo de Cambio...!";
          _error = true;
      }

      if (!_error && (this.registerForm.value.nrooperacion === null ||this.registerForm.value.nrooperacion ==='' ))
      {
          this.errorMensaje="Ingresar N° de Operación...!";
          _error = true;
      }

    if (!_error && (this.registerForm.value.monto === null || this.registerForm.value.monto === '' || this.registerForm.value.monto === 0))
    {
        this.errorMensaje="Ingresar Monto a Pagar...!";
        _error = true;
    }

    if (!_error && (this.registerForm.value.observacion === null || this.registerForm.value.observacion === ''))
    {
        this.errorMensaje="Ingresar Observación...!";
        _error = true;
    }

    // if (!_error && (this.registerForm.value.tipodoc_ctb === '' || this.registerForm.value.tipodoc_ctb === null))
    // {
    //     this.errorMensaje="Seleccionar Tipo de Documento...!";
    //     _error = true;
    // }

      return _error;
    }

    onValueChange(event:any){
      console.log('onValueChange...', event);
    }
 
}
