import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../Service/compraServices';
import { SharedAppService } from '@sharedAppService';
import { constantesLocalStorage } from '@constantes';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-c-detalle',
  templateUrl: './c-detalle.component.html',
  styleUrls: ['./c-detalle.component.scss']
})
export class DetalleComponent implements OnInit, OnDestroy{
  
    @Input() IA_data: any;
    $listSubcription: Subscription[] = [];
    registerFormRegistro!: FormGroup;
    idRegla: number = 0;
    lstDetalle: any[]=[];
    lstFlujo: any;
    lstPerfil:any;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    verbtnAgregar: boolean= true;
    resolutorVisible: boolean= false;
    registerFormResolutor!: FormGroup;
    lstMonedas: any;  
    errorMensaje: string = "";

  constructor(
    private formBuilder: FormBuilder,    
    private comprasService: ComprasService  ,
    private serviceSharedApp: SharedAppService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    ){     

      }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  ngOnInit(): void{
    this.idRegla = this.IA_data; 
    this.createFormRegistro();
    this.createFormResolutor();
    this.cargarFlujo();
    this.cargarPerfil();
    this.listaMonedas();
    if (this.idRegla > 0) {
        this.traerUno();
    }
  }

  get formRegistro() { return this.registerFormRegistro.controls; }
  get formResolutor() { return this.registerFormResolutor.controls; }

  createFormResolutor() {
    //Agregar validaciones de formulario
    this.registerFormResolutor = this.formBuilder.group({
    idresolutor: [{ value: 0, disabled: true }],
    idperfil: [{ value: 1, disabled: false }, [Validators.required]],
    idperfil2: ['']
    });
}

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
        idregla: [{ value: 0, disabled: true }],
        idflujo: [{ value: 0, disabled: false }],
        descripcion: [{ value: '', disabled: false }],
        montoini: [{ value: 0, disabled: false }],
        montofin: [{ value: 0, disabled: false }],
        indvig: [{ value: 1, disabled: false }],
        idusuario: [{value: constantesLocalStorage.idusuario, disabled: false}],
        idtrx: [{ value: 0, disabled: false }],
        idmoneda: [{ value: '', disabled: false }]
    });
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  listaMonedas() {
    const $listaMonedas = this.comprasService.obtenerMonedas()
    .subscribe({
      next: (rpta: any) => {
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

  cargarFlujo(){
    const $cargarFlujo = this.comprasService.listarFlujo()
      .subscribe({
        next: (rpta:any) => {
            this.lstFlujo = rpta
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($cargarFlujo)
  }

  cargarPerfil(){
    const objeto ={

    }
    const $cargarPerfil = this.comprasService.listarPerfil(objeto)
    .subscribe({
      next: (rpta:any) => {
        console.log('cargarPerfil', rpta);
          this.lstPerfil = rpta
      },
      error:(err)=>{
          this.serviceSharedApp.messageToast()
      },
      complete:() => {
      }
    });
  this.$listSubcription.push($cargarPerfil)
  }

  grabarRegla(){
    this.setSpinner(true);
    this.mensajeSpinner='Agregando...';

    if (this.validarDatos())
        {
            this.setSpinner(false);
            this.messageService.add({severity: 'info', summary: 'Validación', detail: this.errorMensaje });
            return;
        }

    console.log('grabarRegla', this.registerFormRegistro.getRawValue());
    const $grabarRegla = this.comprasService.grabarRegla(this.registerFormRegistro.getRawValue())
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            this.verbtnAgregar = false;
            console.log('grabarRegla', rpta);
            this.registerFormRegistro.get('idregla')?.setValue(rpta.resultProceso);
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($grabarRegla)
  }

  traerUno(){
    this.setSpinner(true);
    const $traerUno = this.comprasService.traerUnoReglaFlujo(this.idRegla)
      .subscribe({
        next: (rpta:any) => {
                  
            this.verbtnAgregar = false;
            console.log('traerUno', rpta);
            this.registerFormRegistro.patchValue(rpta[0]);
            this.listarResolutor();
            //this.registerFormRegistro.get('idregla')?.setValue(rpta[0].idregla);
            this.setSpinner(false);      
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($traerUno)
   }

   eliminarResolutor(data:any){
    const objeto ={
        idresolutor: data.idresolutor,
        idusuario: constantesLocalStorage.idusuario
    }
    
    this.confirmationService.confirm({
        key: 'confirm1',
        header: 'Confirmación',
        message:  '¿Desea Eliminar ' + '<b>' + data.nomperfil + '</b>' + '?' ,
        accept: () => {
            console.log('eliminarResolutor',objeto);
        const $listarResolutor = this.comprasService.eliminarResolutor(objeto)
        .subscribe({
            next: (rpta:any) => {  
                this.listarResolutor(); 
            },
            error:(err)=>{
                this.serviceSharedApp.messageToast()
            },
            complete:() => {
            }
        });
        this.$listSubcription.push($listarResolutor)
        }
    });

   }

   agregarResolutor(){
    this.registerFormResolutor.patchValue({
        idresolutor: 0,
        idperfil: 0,
        idperfil2: 0
      });
      this.resolutorVisible = true;
   }

   editarResolutor(data:any){
   
    this.registerFormResolutor.patchValue({
        idresolutor: data.idresolutor,
        idperfil: data.idperfil,
        idperfil2: data.idperfil2
      });
      this.resolutorVisible = true;
   }

  grabarResolutor(){
    if (this.registerFormResolutor.value.idperfil === 0) {
        this.messageService.add({ severity: 'info', summary: 'Validación...', detail: 'Debe Ingresar Perfil Aprobador.' });
        return;
    }
    this.setSpinner(true);
    const objeto ={
        ...this.registerFormResolutor.getRawValue(),
        idregla: this.idRegla,
        idusuario: constantesLocalStorage.idusuario
    }

    console.log('grabarResolutor', objeto)
    const $agregarResolutor = this.comprasService.agregarResolutor(objeto)
      .subscribe({
        next: (rpta:any) => {  
            this.setSpinner(false);  
            this.listarResolutor();                    
            console.log('agregarResolutor', rpta);
            this.resolutorVisible = false;
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($agregarResolutor)
  }

  listarResolutor(){    
    const $listarResolutor = this.comprasService.listarResolutor(this.idRegla)
      .subscribe({
        next: (rpta:any) => {  
            this.lstDetalle = rpta;                     
            console.log('listarResolutor', rpta);
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($listarResolutor)
  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

       if (this.registerFormRegistro.value.idflujo === null)
       {
            this.errorMensaje="Seleccionar Flujo...!";
            _error = true;
       }

       if (!_error && this.registerFormRegistro.value.idmoneda === '')
       {
            this.errorMensaje="Seleccionar Moneda...!";
            _error = true;
       }

       if (!_error && (this.registerFormRegistro.value.montoini === 0 ))
        {
            this.errorMensaje="Ingresar Monto Inicial...";
            _error = true;
        }

        if (!_error && (this.registerFormRegistro.value.montofin === 0 ))
            {
                this.errorMensaje="Ingresar Monto Final...";
                _error = true;
            }

       if (!_error && (this.registerFormRegistro.value.descripcion === "" ))
       {
            this.errorMensaje="Ingresar Descripción...!";
            _error = true;
       }

       //this.formValue.taskList?.tasks
       return _error;
     }
}