import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { constantesLocalStorage } from '@constantes';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
@Component({
  selector: 'app-c-modalpropuesta',
  templateUrl: './c-modalpropuesta.component.html'
})
export class CModalPropuestaComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    headerTitle?: string; 
    idProgramacion: any;
    onlyRead: boolean = false;
    registerFormPropuesta!: FormGroup;
    lstProveedores: any[]=[];
    lstMonedas: any[]=[];
    errorMensaje: string = "";
    listaPostores: any;

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param Postores...', this.param);
    this.listaPostores = this.param.lista;
    this.createFormCliente();
    this.listaMonedas();
    this.listaProveedores();

    if (this.param.iditempostor) {
        this.registerFormPropuesta.patchValue(this.param);
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFormCliente() {
    //Agregar validaciones de formulario
    this.registerFormPropuesta = this.formBuilder.group({
        iditempostor: [{ value: 0, disabled: false }],
        idpersona : [{ value: null, disabled: false }],
        idmoneda: [{ value: this.param.idmoneda, disabled: false }],
        monto: [{ value: 0, disabled: false }],
        comentario: [{ value: null, disabled: false }],
        idarchivo: [{ value: null, disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
        simbmoneda: [{ value: null, disabled: false }],
        nomcomercial: [{ value: null, disabled: false }],
        indseleccion: [{ value: false, disabled: false }],
        indvig: [{ value: true, disabled: false }],
        idcontacto: [{ value: this.param.idcontacto, disabled: false }],
        nrodocumento: [{ value: this.param.nrodocumento, disabled: false }],
        snombrecontacto: [{ value: this.param.snombrecontacto, disabled: false }],
    });
}

  guardarCliente() {       
    console.log('guardarCliente...', this.registerFormPropuesta.getRawValue());
    if (this.validarDatos())
    {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    let lista = this.param.lista;
    const valor = lista.filter((x: { idpersona: any; })=>x.idpersona === this.registerFormPropuesta.get('idpersona')?.value);
    console.log('valor', valor);
    if (valor.length > 0 && this.registerFormPropuesta.get('iditempostor')?.value === 0)
      {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'El Proveedor ya se encuentra registrado...!' });
          return;
      }

    const nomcomercial = this.lstProveedores.filter(x=>x.idcliente === this.registerFormPropuesta.get('idpersona')?.value)[0].nomcomercial;
    this.registerFormPropuesta.get('nomcomercial')?.setValue(nomcomercial);

    const simbmoneda = this.lstMonedas.filter(x=>x.idmoneda == this.registerFormPropuesta.get('idmoneda')?.value)[0].simbmoneda;
    this.registerFormPropuesta.get('simbmoneda')?.setValue(simbmoneda);

    this.cerrar({...this.registerFormPropuesta.getRawValue()})      
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  listaProveedores() {
    const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
      next: (rpta: any) => {
        console.log('lstProveedores', rpta);
        this.lstProveedores = rpta;
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($getClientes);
  }

  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        console.log('listaMonedas', rpta);
        this.lstMonedas = rpta;       
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaMonedas);
  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormPropuesta.value);

    if (this.registerFormPropuesta.value.idpersona === '' || this.registerFormPropuesta.value.idpersona === null)
      {
          this.errorMensaje="Seleccionar Proveedor...!";
          _error = true;
      }

      if (!_error && this.registerFormPropuesta.value.idmoneda === null || this.registerFormPropuesta.value.idmoneda === '')
        {
              this.errorMensaje="Seleccionar Moneda...!";
              _error = true;
        } 

    if (!_error && (this.registerFormPropuesta.value.monto === null || this.registerFormPropuesta.value.monto ==='' || this.registerFormPropuesta.value.monto === 0))
    {
        this.errorMensaje="Ingresar Monto...!";
        _error = true;
    }

    if (!_error && (this.registerFormPropuesta.value.comentario === null || this.registerFormPropuesta.value.comentario ==='' ))
      {
          this.errorMensaje="Ingresar Comentario...!";
          _error = true;
      }
       

    return _error;
    }
 
}
