import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, globalVariable, mensajesQuestion } from '@constantes';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-bancario',
  templateUrl: './c-bancario.component.html'
})
export class CBancarioComponent {
    $listSubcription: Subscription[] = [];
    //@Input() IA_codigo: any;
    
   
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    lstContractual: any;
    submittedCta = false;
    registerFormRegistro: any = FormGroup;
    IdCuenta: number = 0;
    headerTitle!: string;
    cuentaVisible: boolean = false;
    lstBanco: any;
    lstTipocuenta: any;
    lstMoneda: any;

    constructor(
        private messageService: MessageService,
         private confirmationService: ConfirmationService,
         private formBuilder: FormBuilder,
         private comprasService: ComprasService,
         private serviceSharedApp: SharedAppService,
      ) {
        
      }

      setSpinner(valor: boolean) {
        this.blockedDocument = valor;
        }

    get formRegistro() { return this.registerFormRegistro.controls; }

      ngOnInit(): void { 
        console.log('this.IA_codigo...', globalVariable.codigoId);
        this.personaProveedorlist();
        this.createFormRegistro();
      }

      createFormRegistro() {
        //Agregar validaciones de formulario
        this.registerFormRegistro = this.formBuilder.group({
        //fechavence: [{ value: new Date(), disabled: false }],
        //numregoportunidad: ['', [Validators.required]],
        idcuentaprov: [{ value: null, disabled: false }, [Validators.required]],
        idpersona: [{ value: globalVariable.codigoId, disabled: false }, [Validators.required]],
        idbanco: [{ value: null, disabled: false }, [Validators.required]],
        nomcuenta: [{ value: null, disabled: false }, [Validators.required]],
        nrocuenta: [{ value: null, disabled: false }, [Validators.required]],
        nrocci: [{ value: null, disabled: false }, [Validators.required]],
        idmoneda: [{ value: null, disabled: false }, [Validators.required]],
        //indactivo: [{ value: 1, disabled: false }, [Validators.required]],
        iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }, [Validators.required]],
        codtipocuenta: [{ value: null, disabled: false }],
        });
      }

      personaProveedorlist(){
        const $personaProveedorlist = this.comprasService.listaPersonaLinea(globalVariable.codigoId).subscribe({
          next: (rpta: any) => {
            console.log('lstContractual...', rpta);
           this.lstContractual= rpta;
            
          },
          error: (err) => {
            this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
        });
        this.$listSubcription.push($personaProveedorlist);
      }

      guardarCuenta() {
        console.log('this.registerFormRegistro...', this.registerFormRegistro.value);
        this.submittedCta = true;
        // deténgase aquí si el formulario no es válido
        if (this.registerFormRegistro.invalid) {
            return;
        }
        const objeto = {
          ...this.registerFormRegistro.value,
          indactivo: true
        }
        console.log('this.objeto...', objeto);
        //Verdadero si todos los campos están llenos
        if(this.submittedCta)
        {     
          const $listaTipo = this.comprasService.prcPersonaCuenta(objeto).subscribe({
            next: (rpta: any) => {
              console.log('guardarCuenta...', rpta);
              this.setSpinner(false);
              if (rpta.procesoSwitch === 0){
                this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
                this.personaProveedorlist()        ;
                this.cuentaVisible=false;
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
      }
      
      agregarCuenta(){
        this.submittedCta = false;
        this.registerFormRegistro.reset();
        this.registerFormRegistro.get('idcuentaprov').setValue(0);
        this.registerFormRegistro.get('idpersona').setValue(globalVariable.codigoId);
        this.registerFormRegistro.get('iduserreg').setValue(constantesLocalStorage.idusuario);
      
      
        this.listaTipoCuenta();
        this.listaBanco(); 
        this.listaMonedas();
        this.IdCuenta = 0;
        this.headerTitle = "Nueva Cuenta";
        this.cuentaVisible=true;
      }

      editarCuenta(objeto:any){
        console.log('editarLinea', objeto);
        this.submittedCta = false;
        this.registerFormRegistro.reset();
        this.listaTipoCuenta();
        this.listaBanco(); 
        this.listaMonedas();

        this.registerFormRegistro.get('idcuentaprov').setValue(objeto.idcuentaprov);
        this.registerFormRegistro.get('idpersona').setValue(globalVariable.codigoId);
        this.registerFormRegistro.get('iduserreg').setValue(constantesLocalStorage.idusuario);
        
        this.registerFormRegistro.get('idbanco').setValue(objeto.idbanco);
        this.registerFormRegistro.get('idmoneda').setValue(objeto.idmoneda);
        this.registerFormRegistro.get('idcuentaprov').setValue(objeto.idcuentaprov);
        this.registerFormRegistro.get('nomcuenta').setValue(objeto.nomcuenta);
        this.registerFormRegistro.get('nrocuenta').setValue(objeto.nrocuenta);
        this.registerFormRegistro.get('codtipocuenta').setValue(objeto.codtipocuenta);
        this.registerFormRegistro.get('nrocci').setValue(objeto.nrocci);    
        this.registerFormRegistro.get('indactivo').setValue(objeto.indactivo);        
       
        this.IdCuenta = objeto.idcuentaprov;
        this.headerTitle = "Editar Cuenta";
        this.cuentaVisible=true;
      }

      eliminarCuenta(objeto:any){
        console.log('eliminarLinea', objeto); 
        
        this.confirmationService.confirm({
          key: 'confirm1',
          header: 'Confirmación',
          //target: event.target || new EventTarget,
          message: '¿Desea eliminar la Cuenta del Banco : : '+ '<b>'+ objeto.nombanco +'</b>'+ '?',
          //icon: 'pi pi-exclamation-triangle text-6xl',
          accept: () => {
            const $guardarLinea = this.comprasService.PersonaCuentaDell(objeto.idcuentaprov).subscribe({
              next: (rpta: any) => {
                console.log('eliminarLinea...', rpta);        
                this.setSpinner(false);
                if (rpta.procesoSwitch === 0){
                  this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
                  this.personaProveedorlist(); 
                 }else{
                  this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
                 }
              },
              error: (err) => {
                this.serviceSharedApp.messageToast()
              },
              complete: () => {},
            });
            this.$listSubcription.push($guardarLinea);  
          }
      }); 

       
      }

      listaBanco() {
        let idtabla = 105;
        const $listaTipo = this.comprasService.obtenerTipoDocumento(idtabla).subscribe({
          next: (rpta: any) => {
            this.lstBanco = rpta;
          },
          error: (err) => {
            this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
        });
        this.$listSubcription.push($listaTipo);
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
      
}