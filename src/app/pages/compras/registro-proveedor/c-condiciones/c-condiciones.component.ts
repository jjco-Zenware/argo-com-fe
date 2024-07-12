import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, globalVariable, mensajesQuestion } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { CAdjuntosComponent } from '../c-adjuntos/c-adjuntos.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-c-condiciones',
  templateUrl: './c-condiciones.component.html',
  styleUrls: ['./c-condiciones.component.scss']
}) 
export class CCondicionesComponent {
    $listSubcription: Subscription[] = [];
    //@Input() IA_codigo: any;    
    @Input() IA_TerPag: any;
    
    lstCredito: any;
    submittedLinea: boolean = false;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    IdLinea: number = 0;
    registerFormLinea: any = FormGroup;
    lineaVisible: boolean = false;
    headerTitle: string = "";
    lstMoneda: any;
    idestado!: string ;
    lstTermino: any;

 

    constructor(
        private messageService: MessageService,
         private confirmationService: ConfirmationService,
         private formBuilder: FormBuilder,
         private comprasService: ComprasService,
         private serviceSharedApp: SharedAppService,
         public dialogService: DialogService,
      ) {
        
      }

      get formLinea() { return this.registerFormLinea.controls; }
      setSpinner(valor: boolean) {
        this.blockedDocument = valor;
        }

      ngOnInit(): void { 
        //console.log('this.IA_codigo...', this.IA_codigo);
        console.log('this.IA_TerPag...', this.IA_TerPag);
        this.lineaProveedorlist();
        this.createFormLinea();        
        this.listaMonedas();
        this.listarItemsTabla();
      }

      createFormLinea() {
        this.registerFormLinea = this.formBuilder.group({
        idlineaprov: [{ value: null, disabled: false }, [Validators.required]],
        idpersona: [{ value: globalVariable.codigoId, disabled: false }, [Validators.required]],
        nomlinea: [{ value: null, disabled: false }, [Validators.required]],
        fechavcto: [{ value: new Date(), disabled: false }, [Validators.required]],
        idmoneda: [{ value: null, disabled: false }, [Validators.required]],
        montolinea: [{ value: 0, disabled: false }, [Validators.required]],
        estado: [{ value: 'ACT', disabled: false }],
        saldo: [{ value: 0, disabled: false }, [Validators.required]],
        iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }, [Validators.required]],
        });
      }

      lineaProveedorlist(){
        const $lineaProveedorlist = this.comprasService.lineaProveedorlist(globalVariable.codigoId).subscribe({
          next: (rpta: any) => {
            console.log('lstCredito...', rpta);
           this.lstCredito= rpta;
            
          },
          error: (err) => {
            this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
        });
        this.$listSubcription.push($lineaProveedorlist);
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

      agregarLinea(){
        this.submittedLinea = false;
        this.registerFormLinea.reset();
        this.registerFormLinea.get('idlineaprov').setValue(0);
        this.registerFormLinea.get('idpersona').setValue(globalVariable.codigoId);
        this.registerFormLinea.get('iduserreg').setValue(constantesLocalStorage.idusuario);
        this.registerFormLinea.get('estado').setValue('ACT');
      
        this.IdLinea = 0;
        this.headerTitle = "Nueva Linea";
        this.lineaVisible=true;
      }

      editarLinea(objeto:any){
        console.log('editarLinea', objeto);
        this.submittedLinea = false;
        this.registerFormLinea.reset();
        this.registerFormLinea.get('idlineaprov').setValue(objeto.idlineaprov);
        this.registerFormLinea.get('idpersona').setValue(globalVariable.codigoId);
        this.registerFormLinea.get('iduserreg').setValue(constantesLocalStorage.idusuario);
        this.registerFormLinea.get('estado').setValue('ACT');        
        this.registerFormLinea.get('nomlinea').setValue(objeto.nomlinea);
        this.registerFormLinea.get('idmoneda').setValue(objeto.idmoneda);
        this.registerFormLinea.get('montolinea').setValue(objeto.montolinea);
        this.registerFormLinea.get('saldo').setValue(objeto.saldo);
        this.registerFormLinea.get('fechavcto').setValue(objeto.fechavcto);
      
        this.IdLinea = objeto.idlineaprov;
        this.headerTitle = "Editar Linea";
        this.lineaVisible=true;
      }

      eliminarLinea(objeto:any){
        console.log('eliminarLinea', objeto); 
        
        this.confirmationService.confirm({
          key: 'confirm1',
          header: 'Confirmación',
          //target: event.target || new EventTarget,
          message: '¿Estás seguro eliminar : '+ '<b>'+ objeto.nomlinea +'</b>'+ '?',
          //icon: 'pi pi-exclamation-triangle text-6xl',
          accept: () => {
            const $guardarLinea = this.comprasService.lineaproveedorDel(objeto.idlineaprov).subscribe({
              next: (rpta: any) => {
                console.log('eliminarLinea...', rpta);        
                this.setSpinner(false);
                if (rpta.procesoSwitch === 0){
                  this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
                  this.lineaProveedorlist(); 
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
      
      guardarLinea(){
        console.log('this.registerFormLinea...', this.registerFormLinea.value);
        this.submittedLinea = true;
        // deténgase aquí si el formulario no es válido
        if (this.registerFormLinea.invalid) {
            return;
        }
        this.setSpinner(true);
        //Verdadero si todos los campos están llenos
        if(this.submittedLinea)
        {     
          const $guardarLinea = this.comprasService.prcProveedorLinea(this.registerFormLinea.value).subscribe({
            next: (rpta: any) => {
              console.log('guardarLinea...', rpta);        
              this.setSpinner(false);
              if (rpta.procesoSwitch === 0){
                this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
                this.lineaProveedorlist();        
                this.lineaVisible=false;
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
          this.$listSubcription.push($guardarLinea);
            
        }
      }

      saveTerminoPago(codigo: any){
        console.log('saveTerminoPago', codigo);
        this.setSpinner(true);
        this.mensajeSpinner="Cargando...!";

        const objeto = {
          idpersona: globalVariable.codigoId,
          idusuario: constantesLocalStorage.idusuario,
          codterminopago: codigo
        }

        const $guardarLinea = this.comprasService.prcTerminoPago(objeto).subscribe({
          next: (rpta: any) => {
            console.log('saveTerminoPago...', rpta);        
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
        this.$listSubcription.push($guardarLinea);
      }

      listarItemsTabla() {
        this.comprasService.obtenerItemsTabla(104).subscribe({
            next: (rpta: any) => {
                console.log('listarItemsTabla', rpta);
                this.lstTermino = rpta;
                this.idestado = this.IA_TerPag;
            },
            error: (err) => {
            console.info('error : ', err);
            this.serviceSharedApp.messageToast()
            },
            complete: () => {       
            },
        });
      
        }

    agregarAdjunto(data: any) {
      console.log('agregarAdjunto', globalVariable.codigoId);
      const dataLegal ={
        idCliente: data.idlineaprov,
        codtipoproc: 8
      }
      //console.log('dataxxxxxxx...', data);
      const ref = this.dialogService.open(CAdjuntosComponent, {
          data: dataLegal,
          header: 'Adjuntos de la Línea: ' + data.nomlinea,
          closeOnEscape: false,
          styleClass: 'testDialog',
          width: '80%',
          height: '50%'
      });
  }
      
}