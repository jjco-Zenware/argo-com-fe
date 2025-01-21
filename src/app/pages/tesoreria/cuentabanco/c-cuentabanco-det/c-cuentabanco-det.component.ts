import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, globalVariable, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TesoreriaService } from '../../service/tesoreriaServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';

@Component({
  selector: 'app-c-cuentabanco-det',
  templateUrl: './c-cuentabanco-det.component.html',
  styleUrls: ['./c-cuentabanco-det.component.scss']
})

export class CCuentaBancoDetComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  lstMonedas: any;
  lstCuentas: any;
  registerFormRegistro!: FormGroup;
  lstTipocuenta: any;
  IdCuenta: number = 0;
  headerTitle!: string;
  lstBancos: any;
  errorMensaje: string = "";
  idPersona: number =0;

  constructor(
      private fb: FormBuilder,
      private utilitariosService: UtilitariosService,
      public refDatoItem: DynamicDialogRef,
      public config: DynamicDialogConfig,
      public dialogService: DialogService  ,
      private confirmationService: ConfirmationService,  
      private serviceSharedApp: SharedAppService,
      private messageService: MessageService,
      private tesoreriaService: TesoreriaService, 
      private proyectosService: ProyectosService,
      private comprasService: ComprasService,
      
    ){    
      
  }

  ngOnInit(): void{
    this.createFrm();
    this.listaTipoCuenta();
    this.listaMonedas();
    this.listaBanco();
    console.log('mostrarBotones', this.IA_data);
    this.idPersona = this.IA_data.idpersona;
    this.mostrarRegistro();
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFrm(){
      this.registerFormRegistro = this.fb.group({          
        idcuentaprov: [{ value: 0, disabled: false }, [Validators.required]],
        idpersona: [{ value: this.idPersona, disabled: false }],
        idbanco: [{ value: null, disabled: false }, [Validators.required]],
        nomcuenta: [{ value: null, disabled: false }, [Validators.required]],
        nrocuenta: [{ value: null, disabled: false }, [Validators.required]],
        nrocci: [{ value: null, disabled: false }, [Validators.required]],
        idmoneda: [{ value: null, disabled: false }, [Validators.required]],
        iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
        codtipocuenta: [{ value: null, disabled: false }],
      })
    }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  mostrarRegistro(){
    let _idcuentaprov = this.IA_data.idpersona;
    if (_idcuentaprov > 0) {
      this.registerFormRegistro.patchValue(this.IA_data);
    }
  }
  
  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
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

  listaTipoCuenta() {
    let idtabla = 106;
    const $listaTipo = this.comprasService.obtenerTipoDocumento(idtabla).subscribe({
      next: (rpta: any) => {
        this.lstTipocuenta = rpta;
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listaTipo);
  }

  listaBanco(){    
    const $listaBanco = this.tesoreriaService.listarBanco()
      .subscribe({
        next: (rpta:any) => {
            this.lstBancos = rpta;
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
        }
      });
    this.$listSubcription.push($listaBanco)
  }
  

  guardarCuenta() {
    // deténgase aquí si el formulario no es válido
    if (this.validarDatos())
        {
            this.setSpinner(false);
            this.messageService.add({severity: 'warn', summary: 'Aviso', detail: this.errorMensaje });
            return;
        }
  
      this.setSpinner(true);
      this.mensajeSpinner = 'Guardando...!';

    const objeto = {
      ...this.registerFormRegistro.value,
      indactivo: true,
      idpersona: this.idPersona
    }
    console.log('this.objeto...', objeto);
       
      const $listaTipo = this.comprasService.prcPersonaCuenta(objeto).subscribe({
        next: (rpta: any) => {
          console.log('guardarCuenta...', rpta);
          this.setSpinner(false);
          if (rpta.procesoSwitch === 0){
            this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
           }else{
            this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
           }
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
      });
      this.$listSubcription.push($listaTipo);
        
    
  }
  
  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

    if (this.registerFormRegistro.value.idbanco === " " || this.registerFormRegistro.value.idbanco === null)
      {
          this.errorMensaje="Seleccionar Banco...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.idmoneda === '' || this.registerFormRegistro.value.idmoneda === null))
      {
          this.errorMensaje="Seleccionar Moneda...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.codtipocuenta === '' || this.registerFormRegistro.value.codtipocuenta === null))
      {
          this.errorMensaje="Seleccionar Tipo de Cuenta...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.nrocuenta === '' || this.registerFormRegistro.value.nrocuenta === null))
      {
          this.errorMensaje="Ingresar N° de Cuenta...!";
          _error = true;
      }  

    if (!_error && (this.registerFormRegistro.value.nrocci === '' || this.registerFormRegistro.value.nrocci === null))
      {
          this.errorMensaje="Ingresar N° de CCI...!";
          _error = true;
      } 

       return _error;
     }

  // getPersona(data:any){
  //   const persona:number =this.lstBancos.filter((x: { idbanco: any; })=>x.idbanco == data)[0].idpersona;
  //   console.log('persona...', persona);
  //   this.registerFormRegistro.get('idpersona')?.setValue(persona);
  // }
}
