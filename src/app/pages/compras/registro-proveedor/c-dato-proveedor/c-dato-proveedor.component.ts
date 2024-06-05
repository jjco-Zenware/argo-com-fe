import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, globalVariable, mensajesQuestion, respuestaProceso } from '@constantes';
import { Cliente, I_RespuestaProceso, TablaDetalle } from '@interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComprasService } from '../../Service/compraServices';
import { Subscription } from 'rxjs';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-dato-proveedor',
  templateUrl: './c-dato-proveedor.component.html',
  styleUrls: ['./c-dato-proveedor.component.scss']
})
export class CDatoProveedorComponent implements  OnChanges, OnDestroy{
  $listSubcription: Subscription[] = [];
  @Input() IA_data: any;
  @Output() OB_back = new EventEmitter<any>();
  
  cliente!: Cliente;
  headerTitle: any;
  registerFormCliente: any = FormGroup;
  submitted = false;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  personaNatural: boolean = false;
  idCliente: number = 0;
  lstTipoDocumento: TablaDetalle[] = []; 
  visibleDocument: boolean = true;
  lstMoneda: any;
  //codigoParam: any;
  dataLegal: any;
  dataAdjunto: any;
  terminopago: any;

  dropdownItemsTipPer = [
    { name: 'Jurídica', code: 'J' },
    { name: 'Natural', code: 'N' }
];

dropdownItemsNac = [
    { name: 'Extranjero', code: '0' },
    { name: 'Peruano', code: '1' }
];

dropdownItemsTipNro = [
    { name: 'RUC', code: 'RUC' },
    { name: 'DNI', code: 'DNI' }
];
dropdownItemsSector = [
  { name: 'GOBIERNO', code: 'GOB' },
  { name: 'PRIVADO', code: 'PRI' }
];

constructor(
  private messageService: MessageService,
   private confirmationService: ConfirmationService,
   private formBuilder: FormBuilder,
   private comprasService: ComprasService,
   private serviceSharedApp: SharedAppService,
) {
  this.comprasService.emitirEvento(0);
}

setSpinner(valor: boolean) {
  this.blockedDocument = valor;
  }

ngOnDestroy() {
  if (this.$listSubcription != undefined) {
    this.$listSubcription.forEach((sub) => sub.unsubscribe());
  }
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['IA_data']) {
    console.log('this.IA_data...', this.IA_data);
    if (this.IA_data !== 0) {
      this.idCliente = this.IA_data.idcliente;
      this.terminopago = this.IA_data.nomterminopago;
      this.comprasService.emitirEvento(this.IA_data.idcliente);
      //globalVariable.codigoId = this.IA_data.idcliente;
    }
    
    this.createFormCliente();
    this.cambioTipoPer('J');
    this.cargarData();
    this.listaTipoDocumento();
    this.listaMonedas();
    
    this.dataLegal ={
      idCliente: this.idCliente,
      codtipoproc: 6
    }
    this.dataAdjunto ={
      idCliente: this.idCliente,
      codtipoproc: 5
    }
  }
}

get formCliente() { return this.registerFormCliente.controls; }

createFormCliente() {
  this.registerFormCliente = this.formBuilder.group({
  idrolpersona: [{ value: 'CLI', disabled: false }],
  tipopersona :  [{ value: 'J', disabled: false }, [Validators.required]],
  tipoalta : [{ value: 'NOR', disabled: false }],
  indnacionalidad: [{ value: null, disabled: false }, [Validators.required]],
  idpais: [{ value: '1', disabled: false }],
  idtipodoc: [{ value: null, disabled: false }, [Validators.required]],
  nrodocumento: [{ value: null, disabled: false }, [Validators.required]],
  appaterno: [{ value: null, disabled: false }, [Validators.required]],
  apmaterno: [{ value: null, disabled: false }, [Validators.required]],
  apcasada: [{ value: null, disabled: false }],
  nombres: [{ value: null, disabled: false }, [Validators.required]],
  razonsocial: [{ value: null, disabled: false }, [Validators.required]],
  nomcomercial: [{ value: null, disabled: false }],
  direcresumen: [{ value: null, disabled: false }, [Validators.required]],
  telefresumen: [{ value: null, disabled: false }],
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
  });
}

listaMonedas() {
  const $listaTipo = this.comprasService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
      this.lstMoneda = rpta;
      console.log('listaMonedas...', rpta);
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
  this.$listSubcription.push($listaTipo);
}

listaTipoDocumento() {
  let idtabla = 101;
  const $listaTipo = this.comprasService.obtenerTipoDocumento(idtabla).subscribe({
    next: (rpta: any) => {
      this.lstTipoDocumento = rpta;
    },
    error: (err) => {
      this.serviceSharedApp.messageToast()
    },
    complete: () => {
    },
  });
  this.$listSubcription.push($listaTipo);
}

cambioTipoPer(dato: any) {
  // const marcaPub:string= this.frmNvaPropuesta.get('marcaPublicitar').value;
 if (dato === 'J') {
   this.personaNatural = false;
   this.registerFormCliente.get('razonsocial')?.clearValidators();
   this.registerFormCliente.get('razonsocial')?.setValidators(Validators.required);
   this.registerFormCliente.get('razonsocial')?.updateValueAndValidity();

   this.registerFormCliente.get('nombres')?.clearValidators();
   //this.registerFormCliente.get('nombres')?.setValidators(Validators.required);
   this.registerFormCliente.get('nombres')?.updateValueAndValidity();

   this.registerFormCliente.get('appaterno')?.clearValidators();
   //this.registerFormCliente.get('appaterno')?.setValidators(Validators.required);
   this.registerFormCliente.get('appaterno')?.updateValueAndValidity();

   this.registerFormCliente.get('apmaterno')?.clearValidators();
   //this.registerFormCliente.get('apmaterno')?.setValidators(Validators.required);
   this.registerFormCliente.get('apmaterno')?.updateValueAndValidity();

      }else{
   this.personaNatural = true;

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
   //this.registerFormCliente.get('razonsocial')?.setValidators(Validators.required);
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

nroDoc() {
  console.log('nroDoc');
}

cargarData(){
  this.registerFormCliente.patchValue(this.IA_data);
  this.personaNatural = this.IA_data.tipopersona == "N" ? true: false;
  if (this.IA_data === 0) {
    this.visibleDocument = true;
  }else{
    this.visibleDocument = false;
  }
}

guardar() {
  this.submitted = true;
  this.cliente = this.registerFormCliente.getRawValue();

  this.cliente.idrolpersona = 'PRO',
  this.cliente.tipoalta = 'NOR',
  this.cliente.indestado = '1',
  this.cliente.idpais = '1',
  this.cliente.indmigrado = false,
  this.cliente.indvig = true,
  this.cliente.fechaact = new Date(),
  this.cliente.iduseract = constantesLocalStorage.idusuario,
  this.cliente.fechareg = new Date(),
  this.cliente.iduserreg = constantesLocalStorage.idusuario
  

  if (this.idCliente > 0) {
      this.cliente.idpersona = this.idCliente
  }else{
      this.cliente.idpersona = 0;
  }

  // deténgase aquí si el formulario no es válido
  if (this.registerFormCliente.invalid) {
      //console.log('invalid...', this.registerFormCliente.invalid);
      return;
  }

  console.log('guardar...', this.cliente);

  //Verdadero si todos los campos están llenos
  if(this.submitted)
  {
    this.setSpinner(true);
    this.mensajeSpinner="Guardando...!";
      console.log('this.cliente', this.cliente);
      const $guardar = this.comprasService.prcClientes(this.cliente)
          .subscribe({
          next: (rpta:any) => {
            this.setSpinner(false);
              console.log("rpta prcClientes : ", rpta);
              if (rpta.procesoSwitch === 0){
                  this.messageService.add({severity: 'success', detail: "Operación exitosa" });
                  this.visibleDocument = false;
                  //this.idCliente = rpta.resultProceso;
                  if (this.idCliente === 0) {
                    this.comprasService.emitirEvento(rpta.resultProceso);
                  }
                  
                  //this.OB_back.emit(this.IA_data);
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
          complete:() => {
            this.setSpinner(false);
          }
          });
          this.$listSubcription.push($guardar);

  }
}











}
