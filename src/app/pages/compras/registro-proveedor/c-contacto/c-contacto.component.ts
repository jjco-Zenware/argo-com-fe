import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, globalVariable, mensajesQuestion } from '@constantes';
import { SharedAppService } from '@sharedAppService';

@Component({
  selector: 'app-c-contacto',
  templateUrl: './c-contacto.component.html',
  styleUrls: ['./c-contacto.component.scss']
})
export class CContactoComponent {
  $listSubcription: Subscription[] = [];
  //@Input() IA_codigo: any;

  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  listaContacto: any;
  headerTitle!: string;
  modalvisible: boolean = false;
  submitted: boolean = false;
  registerFormContacto:any= FormGroup;
  lstTipoRol:any;

  constructor(
    private messageService: MessageService,
     private confirmationService: ConfirmationService,
     private formBuilder: FormBuilder,
     private comprasService: ComprasService,
     private serviceSharedApp: SharedAppService,
  ) {
    
  }

  get formContacto() { return this.registerFormContacto.controls; }

  ngOnInit(): void { 
    //console.log('this.IA_codigo...', this.IA_codigo);
    //this.IA_codigo = globalVariable.codigoId;
    this.createFormContacto();
    this.listarItemsTabla();
    this.getContactos();
  }

  createFormContacto(){
    this.registerFormContacto = this.formBuilder.group({
      idcontacto: [{ value: 0, disabled: false }, [Validators.required]],
      nombrecontacto: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      cargo: ['', [Validators.required]],
      tiporol: ['', [Validators.required]],
      });
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
    }

    listarItemsTabla() {
      this.comprasService.obtenerItemsTabla(103).subscribe({
          next: (rpta: any) => {
              console.log('listarItemsTabla', rpta);
          this.lstTipoRol = rpta;
          },
          error: (err) => {
          console.info('error : ', err);
          this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
      });
    
      }

  getContactos() {  
    const $personaProveedorlist = this.comprasService.ListaContactos(globalVariable.codigoId).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('next : ', rpta);
            this.listaContacto = rpta;
        },
        error: (err) => {
            this.setSpinner(false);
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

  agregarContacto(){
    this.submitted = false;
    this.registerFormContacto.reset();
    this.registerFormContacto.get('idcontacto').setValue(0);
    this.headerTitle= 'Nuevo Contacto' ;
    this.modalvisible = true;
  }
  
  vigenciaContacto(data:any) {
    console.log(data);
  
    this.confirmationService.confirm({
      key: 'confirm1',
      message: '¿Está seguro de Activar/Desactivar el contacto ' + '<b>'+ data.nombrecontacto +'</b>' + ' ?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.setSpinner(true);
        const objeto = {
            idcontacto: data.idcontacto,
            idusuario: constantesLocalStorage.idusuario,
        }
  
        this.comprasService.vigenciaContacto(objeto)
            .subscribe({
            next: (rpta:any) => {
                this.setSpinner(false);
                console.log("rpta vigenciaContacto : ", rpta);
                if (rpta.procesoSwitch == 0){
                    this.getContactos();
                    this.messageService.add({severity: 'success', detail: "Operación exitosa" });
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
      },
    });
  }
  
  EditarContacto(data: any)  {
    this.registerFormContacto.reset();
    console.log('EditarKanban...', data);
  
    this.headerTitle = 'Editar Contacto - ' + data.nombrecontacto;
    this.registerFormContacto.get('idcontacto').setValue(data.idcontacto);
    this.registerFormContacto.get('nombrecontacto').setValue(data.nombrecontacto);
    this.registerFormContacto.get('cargo').setValue(data.cargo);
    this.registerFormContacto.get('email').setValue(data.email);
    this.registerFormContacto.get('telefono').setValue(data.telefono);
  
    this.modalvisible = true;
  }

  guardarContacto() {
    console.log('guardarContacto...', this.registerFormContacto.value);
    this.submitted = true;
    // deténgase aquí si el formulario no es válido
    if (this.registerFormContacto.invalid) {
        return;
    }
    //Verdadero si todos los campos están llenos
    if(this.submitted)
    {
      const _nomtiporol =this.lstTipoRol.filter((x: { iditem: any; })=>x.iditem === this.registerFormContacto.value.tiporol)[0].valoritem;
  
        const objeto = {
            idcontacto: this.registerFormContacto.value.idcontacto,
            idpersona: globalVariable.codigoId,
            nomcontacto: this.registerFormContacto.get('nombrecontacto')?.value.toString(),
            cargo: this.registerFormContacto.get('cargo')?.value.toString(),
            email1: this.registerFormContacto.get('email')?.value.toString(),
            telf1: this.registerFormContacto.get('telefono')?.value.toString(),
            tiporol: this.registerFormContacto.value.tiporol,
            imagen: "amyelsner.png",
            nomtiporol:_nomtiporol
        }
        console.log('objeto...', objeto);
  
        this.comprasService.updateContacto(objeto)
            .subscribe({
            next: (rpta:any) => {
                console.log("rpta updateContacto : ", rpta);
                if (rpta.procesoSwitch == 0){
                    this.modalvisible = false;
                    this.messageService.add({severity: 'success', detail: "Operación exitosa" });
                    this.getContactos();
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

}
