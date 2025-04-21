import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { TesoreriaService } from '../service/tesoreriaServices';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ComprasService } from '../../compras/Service/compraServices';

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
    valueMoneda: number=0;
    verTC: boolean = true;
    lstCuentas: any[] = [];
    idtipodocprc: number = 0;
 
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
         private comprasService: ComprasService,   
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param...', this.param);
    this.idtipodocprc = this.param.idtipodocprc;
    this.valueMoneda = this.param.idmoneda;
    this.createForm();
    this.listaBanco();
    this.listaMonedas();  

    // if (this.param.idtipodocprc > 0) {
    //   this.traeruno();      
    // }

    if (this.param.tipodeuda === 2) {
      this.registerForm.get('idmoneda')?.setValue(1);
      this.registerForm.get('tc')?.setValue(1);
      if (this.param.saldo_detraccion > 0) {
        this.registerForm.get('monto')?.setValue(this.param.saldo_detraccion);
        this.registerForm.get('montopago')?.setValue(this.param.saldo_detraccion);        
      }else{
        this.registerForm.get('monto')?.setValue(this.param.s_monto_detraccion_mn_CTB);
      this.registerForm.get('montopago')?.setValue(this.param.s_monto_detraccion_mn_CTB);
      }      
      this.registerForm.get('idbanco')?.setValue(4);

      this.registerForm.get('monto')?.disable();
      this.registerForm.get('idbanco')?.disable();
      this.registerForm.get('idmoneda')?.disable();
      this.verTC = false;

      this.changeBanco(4);
    }
    // else{
    //   this.param.idmoneda = this.param.idmoneda;
    //   this.param.tc = this.param.tc;
    //   this.param.monto = this.param.saldo_documento;
    //   this.param.montopago = this.param.saldo_documento;
    //   this.param.idbanco = null;
    // }

    if (this.param.idpagodocprc > 0) {
      this.registerForm.patchValue(this.param);
      this.registerForm.get('idmoneda')?.disable();
      this.registerForm.get('monto')?.disable();
      this.registerForm.get('tc')?.disable(); 

      this.registerForm.get('nroctaproveedor')?.setValue(this.param.nroctaproveedor);
      this.registerForm.get('fecprogramacion')?.setValue(this.param.fechapago);
      this.changeBanco(this.param.idbanco);
      this.registerForm.get('idcuentaprov')?.setValue(this.param.idcuentaprov);

    }else{
      this.registerForm.get('idmoneda')?.enable();
      this.registerForm.get('monto')?.enable();
      this.registerForm.get('tc')?.enable();

      this.registerForm.get('nroctaproveedor')?.setValue(this.param.nrocuentaproveedor);
    }

   if (this.param.idtipodocprc === 17) {
    this.registerForm.get('montofactura')?.setValue(this.param.saldo_documento);  
    this.registerForm.get('fecprogramacion')?.setValue(this.param.fecvencimiento);  
    this.registerForm.get('nroctaproveedor')?.setValue(this.param.nrocuentaproveedor);  
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
        tc: [{ value: this.param.tc, disabled: false }],
        nrooperacion: [{ value: null, disabled: false }],
        idbanco: [{ value: null, disabled: false }],
        montopago: [{ value:  this.param.saldo_documento, disabled: false }],
        observacion: [{ value: null, disabled: false }],
        indvig :  [{ value: true, disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
        tipodeuda: [{ value: 0, disabled: true }],
        nroctaproveedor: [{ value: '', disabled: false }],
        nomempresa: [{ value: this.param.nomempresa, disabled: false }],
        nrofactura: [{ value: this.param.nrofactura, disabled: false }],
        fecprogramacion: [{ value: this.param.fecprogramacion, disabled: false }],
        montofactura: [{ value: this.param.monto, disabled: false }],
        bancoproveedor: [{ value: this.param.bancoproveedor, disabled: false }],
        idcuentaprov: [{ value: this.param.idcuentaprov, disabled: false }],
    });
}
setSpinner(valor: boolean) {
  this.blockedDocument = valor;
}

traeruno(){
  this.setSpinner(true);
  this.mensajeSpinner = mensajesSpinner.msjRecuperaRegistro
  
  const $traerUno = this.tesoreriaService.traerunoPagoDocumento(this.param.idpagodocprc)
  .subscribe({
    next: (rpta:any) => {
        console.log('rpta traerUno', rpta[0]); 
        this.registerForm.patchValue(rpta[0]);  
        this.setSpinner(false);         
    },
    error:(err)=>{
      this.setSpinner(false); 
      this.messageService.clear();
      this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensajesQuestion.msgErrorGenerico
      })
    },
    complete:() => {this.setSpinner(false); 
    }
  });
this.$listSubcription.push($traerUno)
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

    let fecprogramacion;
    fecprogramacion = this.registerForm.value.fecprogramacion;

    if (this.param.idpagodocprc > 0) {
      fecprogramacion = new Date(this.serviceUtilitario.formatFecha(fecprogramacion));      
    }

    const objeto = {
      ...this.registerForm.getRawValue(),
      fechapago,
      fecprogramacion,
      tipodeuda: this.param.tipodeuda,
    }

      //console.log('guardarCliente...', this.registerForm.getRawValue());      
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
    this.registerForm.reset();
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

      if (!_error && (this.registerForm.value.idcuentaprov === null || this.registerForm.value.idcuentaprov === ''))
        {
            this.errorMensaje="Seleccionar Cuenta...!";
            _error = true;
        }

      if (this.registerForm.value.idmoneda === 2)
      {
        if (!_error && (this.registerForm.value.tc === null || this.registerForm.value.tc ==='' || this.registerForm.value.tc === 0 ))
          {
              this.errorMensaje="Ingresar Tipo de Cambio...!";
              _error = true;
          }        
      }
      

      if (!_error && (this.registerForm.value.nrooperacion === null ||this.registerForm.value.nrooperacion ==='' ))
      {
          this.errorMensaje="Ingresar N° de Operación...!";
          _error = true;
      }

    if (!_error && (this.registerForm.value.monto === null || this.registerForm.value.monto === '' || this.registerForm.value.monto === 0))
    {
        this.errorMensaje="Ingresar Monto...!";
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
      if (this.registerForm.value.idmoneda !== this.valueMoneda) {
        if (this.valueMoneda === 1) {
          this.registerForm.get('montopago')?.setValue(this.registerForm.value.tc * event);
        }else{
          this.registerForm.get('montopago')?.setValue(event / this.registerForm.value.tc );
        }        
      }else{
        this.registerForm.get('montopago')?.setValue(event);
      }
    }

    changeMoneda(event:any){
      console.log('changeMoneda...', event);
      if (this.registerForm.value.idmoneda !== this.valueMoneda) {
        if (this.valueMoneda === 1) {
          this.registerForm.get('montopago')?.setValue(Math.round(this.registerForm.value.monto * this.registerForm.value.tc));
        }else{
          this.registerForm.get('montopago')?.setValue(Math.round(this.registerForm.value.monto / this.registerForm.value.tc));
        }        
      }else{
        this.registerForm.get('montopago')?.setValue(this.registerForm.value.monto);
      }
    }

    onValueChangeTc(event:any){
      if (this.registerForm.value.idmoneda !== this.valueMoneda) {
        if (this.valueMoneda === 1) {
          this.registerForm.get('montopago')?.setValue(Math.round(this.registerForm.value.monto * event));
        }else{
          this.registerForm.get('montopago')?.setValue(Math.round(this.registerForm.value.monto / event));
        }        
      }
    }
 
    changeBanco(data:any){
      console.log('changeBanco...', data);
      const $personaProveedorlist = this.comprasService.listaPersonaLinea(3324).subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('lstCuentas...', rpta);

          this.lstCuentas= rpta.filter((item:any) => item.idbanco === data);
          
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
          this.setSpinner(false);
        },
      });
      this.$listSubcription.push($personaProveedorlist);
    }

    
}
