import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ReservaService } from 'src/app/pages/hotel/reserva/reserva.service';
@Component({
  selector: 'app-c-modalpersona',
  templateUrl: './c-modalpersona.component.html'
})
export class CModalPersonaComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  registerFormRegistro!: FormGroup;
  headerTitle?: string;
  submitted?: boolean;  
  lstProyectos: any;
  idProgramacion: any;
  lstOrigen: any;
  onlyRead: boolean = false;
  registerFormCliente!: FormGroup;
  personaNatural: boolean = false;
  lstRol:any[] = [];

  dropdownItemsTipPer = [
    { name: 'Jurídica', code: 'J' },
    { name: 'Natural', code: 'N' }
];

dropdownItemsNac = [
    { name: 'Extranjero', code: '0' },
    { name: 'Peruano', code: '1' }
];

dropdownItemsTipNro = [
    /*{ name: 'RUC', code: 'RUC' },
    { name: 'DNI', code: 'DNI' }*/
];

lstEnti = [
    { id:'P', name: 'PRIVADO' },
    { id: 'E', name: 'ESTADO' },
];
esPersonaJuridica: boolean = false;

  constructor(
    private fb: FormBuilder,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private ordencompraService: OrdencompraService,
    private formBuilder: FormBuilder,
    private serviceReserva: ReservaService,
  ) { }


  get formCliente() { return this.registerFormCliente.controls; }

  ngOnInit(): void {
    this.param = this.config.data;
    console.log('Config data:', this.param);
    
    this.createFormCliente();
    this.cambioTipoPer('N');
    this.listarItemsTabla();
    this.listarTiposDoc();
    console.log("esPersonaJuridica : ", this.esPersonaJuridica);
    if(this.param?.idtipodoc != null && this.param?.nroDocumento != null){
        this.getBuscarPersonaPAX();
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFormCliente() {
    //Agregar validaciones de formulario
    this.registerFormCliente = this.formBuilder.group({
    //idrolpersona: [{ value: this.param.idrolpersona, disabled: false }],
    idrolpersona: [{ value: "CLI", disabled: false }],
    tipopersona :  [{ value: 'N', disabled: false }],
    tipoalta : [{ value: 'NOR', disabled: false }],
    indnacionalidad: [{ value: '1', disabled: false }, [Validators.required]],
    idpais: [{ value: '1', disabled: false }],
    idtipodoc: [{ value: this.param?.idtipodoc || null, disabled: false }, [Validators.required]],
    nrodocumento: [{ value: this.param?.nroDocumento || null, disabled: false }, [Validators.required]],
    appaterno: [{ value: null, disabled: false }, [Validators.required]],
    apmaterno: [{ value: null, disabled: false }, [Validators.required]],
    apcasada: [{ value: null, disabled: false }],
    nombres: [{ value: null, disabled: false }, [Validators.required]],
    razonsocial: [{ value: null, disabled: false }, [Validators.required]],
    nomcomercial: [{ value: null, disabled: false }],
    direcresumen: [{ value: null, disabled: false }, [Validators.required]],
    telefresumen: [{ value: null, disabled: false }],
    telefmovil: [{ value: null, disabled: false }],
    email: ['', [Validators.required, Validators.email]],
    paginaweb: [{ value: null, disabled: false }],
    facebook: [{ value: null, disabled: false }],
    youtube: [{ value: null, disabled: false }],
    indmigrado :  [{ value: false, disabled: false }],
    indestado:  [{ value: '1', disabled: false }],
    indvig :  [{ value: true, disabled: false }],
    fechareg: [{ value: new Date(), disabled: false }],
    iduserreg : [{ value: 1, disabled: false }],
    fechaact: [{ value: new Date(), disabled: false }],
    iduseract: [{ value: 1, disabled: false }],
    idpersona: [{ value: 0, disabled: false }],
    tipocambio: [{ value: 0, disabled: false }],
    tipoentidad: [{ value: 'P', disabled: false }, [Validators.required]],
    nroctadetraccion: [{ value: null, disabled: false }],
    });
}


  
  cambioTipoPer(dato: any) {
    this.listarTiposDoc();
    if (dato === 'J') {
      this.personaNatural = false;
      this.esPersonaJuridica = true;

      this.registerFormCliente.get('razonsocial')?.clearValidators();
      this.registerFormCliente.get('razonsocial')?.setValidators(Validators.required);
      this.registerFormCliente.get('razonsocial')?.updateValueAndValidity();

      this.registerFormCliente.get('nombres')?.clearValidators();
      this.registerFormCliente.get('nombres')?.updateValueAndValidity();

      this.registerFormCliente.get('appaterno')?.clearValidators();
      this.registerFormCliente.get('appaterno')?.updateValueAndValidity();

      this.registerFormCliente.get('apmaterno')?.clearValidators();
      this.registerFormCliente.get('apmaterno')?.updateValueAndValidity();
    }else{
      this.personaNatural = true;
      this.esPersonaJuridica = false;

      this.registerFormCliente.get('nombres')?.clearValidators();
      this.registerFormCliente.get('nombres')?.setValidators(Validators.required);
      this.registerFormCliente.get('nombres')?.updateValueAndValidity();

      this.registerFormCliente.get('appaterno')?.clearValidators();
      this.registerFormCliente.get('appaterno')?.setValidators(Validators.required);
      this.registerFormCliente.get('appaterno')?.updateValueAndValidity();

      this.registerFormCliente.get('apmaterno')?.clearValidators();
      this.registerFormCliente.get('apmaterno')?.setValidators(Validators.required);
      this.registerFormCliente.get('apmaterno')?.updateValueAndValidity();

      this.registerFormCliente.get('razonsocial')?.clearValidators();
      this.registerFormCliente.get('razonsocial')?.updateValueAndValidity();
  }
  }

  cambioTipoDoc(dato: any) {
      if (dato == 'RUC') {
          //this.idtipodoc
      }else{
          //this.cliente.tipopersona == 'N';
      }
  }

  guardarCliente() {
      this.submitted = true;
      console.log('guardarCliente...', this.registerFormCliente.getRawValue());

      // deténgase aquí si el formulario no es válido
      if (this.registerFormCliente.invalid) {
          console.log('deténgase aquí si el formulario no es válido');
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: "Faltan Ingresar Datos..." });

          return;
      }

      //Verdadero si todos los campos están llenos
      if(this.submitted)
      {
          this.ordencompraService.prcClientes(this.registerFormCliente.getRawValue())
              .subscribe({
              next: (rpta:any) => {
                  console.log("rpta prcClientes : ", rpta);
                  if (rpta.procesoSwitch == 0){
                      this.messageService.add({severity: 'success', detail: "Operación exitosa" });
                      this.registerFormCliente.get('idpersona')?.setValue(rpta.resultProceso);
                      this.cerrar({...this.registerFormCliente.getRawValue()})
                      }else{
                          this.messageService.add({severity: 'error', detail: rpta.mensaje });
                      }
              },
              error:(err)=>{
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
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  listarItemsTabla() {
    this.ordencompraService.obtenerItemsTabla(115).subscribe({
        next: (rpta: any) => {
          let lista = rpta
          //this.lstRol = rpta;
  
          //this.lstRol = lista.filter((x: { coditem: string; }) => x.coditem !== this.param.idrolpersona);
          this.lstRol = lista.filter((x: { coditem: string; }) => x.coditem !== "CLI");
            
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

      getBuscarPersonaPAX() {
        const { idtipodoc, nrodocumento, tipopersona } = this.registerFormCliente.getRawValue();
        if (!idtipodoc) {
          this.messageService.add({ severity: 'info', summary: 'Aviso', detail: "Seleccione Tipo Documento" });
          return;
        }
    
        if (!nrodocumento) {
          this.messageService.add({ severity: 'info', summary: 'Aviso', detail: "Ingrese Número de Documento" });
          return;
        }
    
        const objeto = {
          idusuario: constantesLocalStorage.idusuario,
          idrolpersona: "",
          idpersona: 0,
          nrodocumento,
          tipodocumento: idtipodoc
        }
        const $personaTraerUnoTipoDoc = this.serviceReserva.personaTraerUnoTipoDoc(objeto)
          .subscribe({
            next: (rpta: any) => {
              console.log('rpta personaTraerUnoTipoDoc: ', rpta);
              const { idpersona, appaterno, apmaterno, nombres, razonsocial, direcresumen, telefresumen, email } = rpta;
              this.registerFormCliente.get('idpersona')?.setValue(idpersona);
    
              this.registerFormCliente.get('appaterno')?.setValue(appaterno);
              this.registerFormCliente.get('apmaterno')?.setValue(apmaterno);
              this.registerFormCliente.get('nombres')?.setValue(nombres);
              this.registerFormCliente.get('razonsocial')?.setValue(razonsocial);
              this.registerFormCliente.get('direcresumen')?.setValue(direcresumen);
              this.registerFormCliente.get('telefresumen')?.setValue(telefresumen);
              this.registerFormCliente.get('email')?.setValue(email);
              /*if (tipopersona === 'N') {
                this.registerFormCliente.get('appaterno')?.setValue(appaterno);
                this.registerFormCliente.get('apmaterno')?.setValue(apmaterno);
                this.registerFormCliente.get('nombres')?.setValue(nombres);
              } else {
                this.registerFormCliente.get('razonsocial')?.setValue(razonsocial);
              }*/
            },
            error: (err) => {
              this.serviceSharedApp.messageToast()
            },
            complete: () => { }
          });
        this.$listSubcription.push($personaTraerUnoTipoDoc)
      }
 
  listarTiposDoc(){
    const { tipopersona, idtipodoc } = this.registerFormCliente.controls;
    const $listartipodocumentotablasunat = this.serviceReserva.listartipodocumentotablasunat(tipopersona.value)
      .subscribe({
        next: (rpta: any) => {
          console.log('rpta listartipodocumentotablasunat: ', rpta);
          this.dropdownItemsTipNro = rpta;
          idtipodoc.setValue(tipopersona.value === 'J' ? 'RUC' : 'DNI');
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => { }
      });
    this.$listSubcription.push($listartipodocumentotablasunat)
  }

}
