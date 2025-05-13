import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { MarketingService } from '../../service/marketingServices';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
@Component({
  selector: 'app-c-modal-fondo',
  templateUrl: './c-modal-fondo.component.html'
})
export class CModalFondoComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    headerTitle?: string; 
    idProgramacion: any;
    onlyRead: boolean = false;
    registerForm!: FormGroup;
    lstProveedores: any[]=[];
    errorMensaje: string = "";
    lstContacto: any[] = [];  
    lstMonedas: any[] = []; 

    lstQ = [
        { id: 0, desQ: 'TODOS' },
        { id: 1, desQ: 'Q1' },
        { id: 2, desQ: 'Q2' },
        { id: 3, desQ: 'Q3' },
        { id: 4, desQ: 'Q4' }
    ];
  idCodigo: number = 0;

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private marketingService: MarketingService,
    private utilitariosService: UtilitariosService, 
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param Postores...', this.param);
    this.idCodigo = this.param.idfondotrim;   
    this.createForm();
    this.listaProveedores();  
    this.listaMonedas();  

    if (this.param.idfondotrim > 0) {
      this.getContactos(this.param.idproveedor);    
      this.registerForm.patchValue(this.param);        
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
        idfondotrim: [{ value: this.param.idfondotrim, disabled: false }],
        idq: [{ value: 0, disabled: false }],
        fecactivoini : [{ value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
        fecactivofin : [{ value: this.utilitariosService.obtenerFechaFinMes(), disabled: false }],
        idproveedor: [{ value: null, disabled: false }],
        idcontacto: [{ value: 0, disabled: false }],
        idmoneda: [{ value: null, disabled: false }],
        monto: [{ value: 0, disabled: false }],
        descripcion: [{ value: '', disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
        saldomonto: [{ value: 0, disabled: true }],
    });
}

listaMonedas() {
    const $listaMonedas = this.marketingService.obtenerMonedas().subscribe({
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

  guardar() {       
    console.log('guardarCliente...', this.registerForm.getRawValue());
    if (this.validarDatos())
    {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    let fecactivoini;
    let fecactivofin;
    fecactivoini = this.registerForm.value.fecactivoini;
    fecactivofin = this.registerForm.value.fecactivofin;

    if (this.idCodigo > 0) {
      if (fecactivoini.toString().length === 10) {
        fecactivoini = new Date(this.utilitariosService.formatFecha(fecactivoini)); 
      }   
      
      if (fecactivofin.toString().length === 10) {
        fecactivofin = new Date(this.utilitariosService.formatFecha(fecactivofin)); 
      } 
    }

    const objeto = {
      ...this.registerForm.getRawValue(),
      fecactivoini: fecactivoini, 
      fecactivofin: fecactivofin,
    }



    const $guardar = this.marketingService.prcFondosTrimestrales(objeto).subscribe({
      next: (rpta: any) => {
        if (rpta.procesoSwitch === 0){
          this.cerrar({...this.registerForm.getRawValue()})  
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });    
        }else{
        this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
        return;
        }
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($guardar);


       
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  listaProveedores() {
    const $getClientes = this.marketingService.obtenerClientes('PRO').subscribe({
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

    getContactos(dato: any) {  
      const $personaProveedorlist = this.marketingService.ListaContactos(dato).subscribe({
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
  

    validarDatos():boolean{
        let _error = false;
        this.errorMensaje="";
        console.log('this.formValue...', this.registerForm.value); 
        
        if (this.registerForm.value.fecregistroini === '' || this.registerForm.value.fecregistroini === null )
        {
            this.errorMensaje="Seleccionar Fecha Inicial...!";
            _error = true;
        } 
        if (!_error && (this.registerForm.value.fecregistrofin === '' || this.registerForm.value.fecregistrofin === null ))
        {
            this.errorMensaje="Seleccionar Fecha Final...!";
            _error = true;
        }

        if (!_error && (this.registerForm.value.idq === '' || this.registerForm.value.idq === null || this.registerForm.value.idq === 0))
        {
            this.errorMensaje="Seleccionar Trimestre...!";
            _error = true;
        }
    
        if (!_error && (this.registerForm.value.idproveedor === '' || this.registerForm.value.idproveedor === null))
        {
            this.errorMensaje="Seleccionar Proveedor...!";
            _error = true;
        }
    
        if (!_error && (this.registerForm.value.idcontacto === null || this.registerForm.value.idcontacto === ''))
        {
            this.errorMensaje="Seleccionar Contacto...!";
            _error = true;
        } 
    
        if (!_error && (this.registerForm.value.idmoneda === null || this.registerForm.value.idmoneda === ''))
        {
            this.errorMensaje="Seleccionar Moneda...!";
            _error = true;
        } 
    
        if (!_error && (this.registerForm.value.monto === null || this.registerForm.value.monto === '' || this.registerForm.value.monto === 0))
        {
            this.errorMensaje="Ingresar Monto ...!";
            _error = true;
        } 
           
    
        return _error;
        }
    
        onValueChange(event:any){
          this.registerForm.get('saldomonto')?.setValue(event);
        }
}
