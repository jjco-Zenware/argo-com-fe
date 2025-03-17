import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
@Component({
  selector: 'app-c-modalproveedor',
  templateUrl: './c-modalproveedor.component.html'
})
export class CModalProveedorComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    headerTitle?: string; 
    idProgramacion: any;
    onlyRead: boolean = false;
    registerFormProveedor!: FormGroup;
    lstProveedores: any[]=[];
    errorMensaje: string = "";
    listaPostores: any[] = []; 
    lstContacto: any[] = [];  

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private comprasService: ComprasService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param Postores...', this.param);    
    this.listaPostores = this.param.lista;
    this.createFormCliente();
    this.listaProveedores();    

    if (this.param.idpersona > 0) {
      this.getContactos(this.param.idpersona);    
      this.registerFormProveedor.patchValue(this.param);        
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFormCliente() {
    //Agregar validaciones de formulario
    this.registerFormProveedor = this.formBuilder.group({
        iditempostor: [{ value: 0, disabled: false }],
        idpersona : [{ value: null, disabled: false }],
        telefono: [{ value: '', disabled: false }],
        email: [{ value: null, disabled: false }],
        image: [{ value: '', disabled: false }],
        idarchivo: [{ value: null, disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
        cargo: [{ value: null, disabled: false }],
        nomcomercial: [{ value: '', disabled: false }],
        indseleccion: [{ value: false, disabled: false }],
        indvig: [{ value: true, disabled: false }],
        idcontacto: [{ value: 0, disabled: false }],
        nrodocumento: [{ value: null, disabled: false }],
        snombrecontacto: [{ value: null, disabled: false }],
        nombrecontacto: [{ value: null, disabled: false }]
    });
}

  guardarCliente() {       
    console.log('guardarCliente...', this.registerFormProveedor.getRawValue());
    if (this.validarDatos())
    {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    let lista = this.param.lista;
    const valor = lista.filter((x: { idcontacto: any; })=>x.idcontacto === this.registerFormProveedor.get('idcontacto')?.value);
    console.log('valor', valor);
    if (valor.length > 0 )
      {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'El Contacto ya se encuentra registrado...!' });
          return;
      }

    const nomcomercial = this.lstProveedores.filter(x=>x.idcliente === this.registerFormProveedor.get('idpersona')?.value)[0].nomcomercial;
    this.registerFormProveedor.get('nomcomercial')?.setValue(nomcomercial);

    const ruc = this.lstProveedores.filter(x=>x.idcliente === this.registerFormProveedor.get('idpersona')?.value)[0].nrodocumento;
    this.registerFormProveedor.get('nrodocumento')?.setValue(ruc);

    const snombrecontacto_ = this.lstContacto.filter(x=>x.idcontacto === this.registerFormProveedor.get('idcontacto')?.value)[0].nombrecontacto;
    this.registerFormProveedor.get('nombrecontacto')?.setValue(snombrecontacto_);

    const cargo_ = this.lstContacto.filter(x=>x.idcontacto === this.registerFormProveedor.get('idcontacto')?.value)[0].cargo;
    this.registerFormProveedor.get('cargo')?.setValue(cargo_);

    const telefono_ = this.lstContacto.filter(x=>x.idcontacto === this.registerFormProveedor.get('idcontacto')?.value)[0].telefono;
    this.registerFormProveedor.get('telefono')?.setValue(telefono_);

    const email_ = this.lstContacto.filter(x=>x.idcontacto === this.registerFormProveedor.get('idcontacto')?.value)[0].email;
    this.registerFormProveedor.get('email')?.setValue(email_);

    this.cerrar({...this.registerFormProveedor.getRawValue()})      
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  listaProveedores() {
    const $getClientes = this.proyectosService.obtenerClientes('CLI').subscribe({
      next: (rpta: any) => {
        this.lstProveedores = rpta;
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($getClientes);
  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormProveedor.value);

    if (this.registerFormProveedor.value.idpersona === '' || this.registerFormProveedor.value.idpersona === null)
      {
          this.errorMensaje="Seleccionar Proveedor...!";
          _error = true;
      }

      if (!_error && this.registerFormProveedor.value.idcontacto === null || this.registerFormProveedor.value.idcontacto === '')
        {
              this.errorMensaje="Seleccionar Contacto...!";
              _error = true;
        } 
       

    return _error;
    }

    getContactos(dato: any) {  
      const $personaProveedorlist = this.comprasService.ListaContactos(dato).subscribe({
          next: (rpta: any) => {
              this.lstContacto = rpta;
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
          complete: () => {},
      });
      this.$listSubcription.push($personaProveedorlist);
    }
  
 
}
