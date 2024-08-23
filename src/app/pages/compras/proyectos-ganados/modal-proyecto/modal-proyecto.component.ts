import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cliente, KanbanCard } from '@interfaces';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProyectosService } from '../service/proyectos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-proyecto',
  templateUrl: './modal-proyecto.component.html',
  styleUrls: ['./modal-proyecto.component.scss']
})
export class ModalProyectoComponent {

  $listSubcription: Subscription[] = [];
  registerFormRegistro: any= FormGroup;
  //submitted = false;
  lstOportunidad: KanbanCard[]=[];
  lstCliente: Cliente []=[];
  annio: Date = new Date;
  verOpor: boolean = false;
  verInter: boolean = false;
  verVent: boolean = false;
  errorMensaje!: string;
  onEditar: boolean = false;
  blockedDocument: boolean = false;
    mensajeSpinner: string = "Cargando...!";
    lstOrigen: any;

  constructor(
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    public refDatoItem: DynamicDialogRef,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public config: DynamicDialogConfig

) {}


get formRegistro() { return this.registerFormRegistro.controls; }


ngOnInit(): void {  
  console.log('codigop ver...',this.config.data);
  this.onEditar = this.config.data.indEditar;
  this.listaProyectoTipo();
  this.listaClientes();
  this.createFormRegistro();
  //this.verControles();
  if (this.config.data.idproyecto > 0) {
    this.traerunoProyecto();
  }else{
    this.verControles(2);
  }
}

setSpinner(valor: boolean) {
  this.blockedDocument = valor;
}

changeOrigen(dato:any){
  console.log('changeOrigen', dato);
  this.registerFormRegistro.patchValue({
        idcliente:0,
        idoportunidad: 0,
        nomproyecto:'',
        idrequerimiento:0,
        descripcion:''
});
  this.verControles(dato);
}

verControles(data:any){
  switch (data) {
    case 1:
      this.verOpor = true;
      this.verInter = false;
      this.verVent = false;
    break;
    case 2:
      this.verOpor = false;
      this.verInter = true;
      this.verVent = false;
    break;
  }
}

traerunoProyecto(){
  this.setSpinner(true);
  const objet = {
    idproyecto: this.config.data.idproyecto
  }
  const $listarOportunidad = this.proyectosService.proyectotraeruno(objet)
  .subscribe({
      next: (rpta:any) => {
        console.log('traerunoProyecto...', rpta);
        this.cargarOportunidades(rpta[0].idcliente);
        //this.registerFormRegistro.patchValue(rpta[0]);
        this.registerFormRegistro.get('idproyecto').setValue(rpta[0].idproyecto);
        this.registerFormRegistro.get('idtipoproyecto').setValue(rpta[0].idtipoproyecto);
        this.registerFormRegistro.get('idcliente').setValue(rpta[0].idcliente);
        this.registerFormRegistro.get('nomproyecto').setValue(rpta[0].nomproyecto);
        this.registerFormRegistro.get('idrequerimiento').setValue(rpta[0].idrequerimiento);
        this.registerFormRegistro.get('descripcion').setValue(rpta[0].descripcion);
        this.registerFormRegistro.get('idoportunidad').setValue(rpta[0].idoportunidad.toString());

        this.verControles(rpta[0].idtipoproyecto);
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
      complete:() => {
        this.setSpinner(false);
       }
  });
  this.$listSubcription.push($listarOportunidad);
}

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: this.config.data.idtipoproyecto, disabled: false }],
      idcliente: [{ value: 0, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      nomproyecto: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      descripcion: [{ value: '', disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      codtipodoc: [{ value: '', disabled: false }],
    });
}

prcProyecto(){
  if (this.config.data.idproyecto > 0) {
    this.actualizarRegistro();
  }else{
    this.guardarRegistro();
  }
}

actualizarRegistro() {
  if (this.validarDatos())
    {
        console.log("errorMensaje : ", this.errorMensaje);
        this.messageService.add({severity: 'info', summary: 'Validación', detail: this.errorMensaje });
        return;
    }

  if (this.registerFormRegistro.value.idoportunidad > 0) {
    const _nomoportunidad =this.lstOportunidad.filter((x: { id: any; })=>x.id === this.registerFormRegistro.value.idoportunidad)[0].title;
    this.registerFormRegistro.get('nomproyecto').setValue(_nomoportunidad);
  }

  this.proyectosService.updProyecto(this.registerFormRegistro.value).subscribe({
    next: (rpta: any) => {
    //this.lstProyecto = rpta;
    if (rpta.procesoSwitch === 0) {
      console.info('lstProyecto : ', rpta );
      this.refDatoItem.close();
    }else{
      this.messageService.add({severity: 'info', summary: 'Validación', detail: rpta.mensaje});
    }
    
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
}

guardarRegistro() {
  if (this.validarDatos())
    {
        console.log("errorMensaje : ", this.errorMensaje);
        this.messageService.add({severity: 'info', summary: 'Validación', detail: this.errorMensaje });
        return;
    }

  console.log('this.guardarRegistro...', this.registerFormRegistro.value);

  if (this.registerFormRegistro.value.idoportunidad > 0) {
    const _nomoportunidad =this.lstOportunidad.filter((x: { id: any; })=>x.id === this.registerFormRegistro.value.idoportunidad)[0].title;
    this.registerFormRegistro.get('nomproyecto').setValue(_nomoportunidad);
  }

  this.proyectosService.newProyecto(this.registerFormRegistro.value).subscribe({
    next: (rpta: any) => {
    //this.lstProyecto = rpta;
    if (rpta.procesoSwitch === 0) {
      console.info('lstProyecto : ', rpta );
      this.refDatoItem.close();
    }else{
      this.messageService.add({severity: 'info', summary: 'Validación', detail: rpta.mensaje});
    }
    
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

  //   this.confirmationService.confirm({
  //     key: 'confirm1',
  //     header: 'Confirmación',
  //     message: '<b>'+'¿Desea Crear el Proyecto...?'+'</b>',
  //     //message: '¿Desea Crear el Proyecto de la Oportunidad: '+ '<b>'+ _nomoportunidad +'</b>'+ ' del Cliente: '+'<b>'+ _nomcliente +'</b>'+'?',
  //     acceptLabel: 'Si',
  //     rejectLabel: 'No',
  //     icon:'pi pi-exclamation-triangle text-6xl p-2 text-orange-600',
  //     rejectButtonStyleClass:'modalBtnRed',
  //     acceptButtonStyleClass:'modalBtnGreen',
  //     accept: () => {
  //         //Verdadero si todos los campos están llenos
         
          
  //     }
  // }); 
}

listaClientes() {
  let tiporol ="CLI";
  this.proyectosService.obtenerClientes(tiporol).subscribe({
      next: (rpta: any) => {
      //console.info('next : ', rpta);
      this.lstCliente = rpta;
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
}

cargarOportunidades(data: any){

  const objeto = {
    idusuario: constantesLocalStorage.idusuario,
    idvendedor: 0,
    idpreventa: 0,
    idtipoprod: 0,
    idcliente: data,
    idlista: 0,
    annio: this.annio.getFullYear(),
    q: 0,
    idproveedor: 0
  }

  
  console.log('objeto...', objeto);

    const $listarOportunidad = this.proyectosService.obtenerOportunidadCliente(objeto)
      .subscribe({
          next: (rpta:any) => {
            console.log('cargarOportunidades...', rpta);
            this.lstOportunidad = rpta;

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
           }
      });
      this.$listSubcription.push($listarOportunidad);

}

validarDatos():boolean{
  let _error = false;
  this.errorMensaje="";
  console.log('validarDatos',this.registerFormRegistro.value)

     if ((this.registerFormRegistro.value.idcliente === 0 || this.registerFormRegistro.value.idcliente === null) && this.registerFormRegistro.value.idtipoproyecto === 1)
     {
          this.errorMensaje="Debe Seleccionar Cliente...!";
          _error = true;
     }

     if (!_error && (this.registerFormRegistro.value.idoportunidad === 0 || this.registerFormRegistro.value.idoportunidad === null) && this.registerFormRegistro.value.idtipoproyecto === 1)
     {
          this.errorMensaje="Debe Seleccionar Oportunidad CRM...!";
          _error = true;
     }

     if (!_error && (this.registerFormRegistro.value.nomproyecto === "" && this.registerFormRegistro.value.idtipoproyecto === 2))
      {
          this.errorMensaje="Ingresar Nombre de Proyecto...";
          _error = true;
      }

      // if (!_error && (this.registerFormRegistro.value.idrequerimiento === "" && this.config.data === 2 ))
      //   {
      //       this.errorMensaje="Ingresar N° Requerimiento...";
      //       _error = true;
      //   }
     
     return _error;
   }

   listaProyectoTipo(){
    this.proyectosService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
        this.lstOrigen = rpta;
      console.info('listaProyectoTipo : ', this.lstOrigen);
      //this.itemsNvoPro = rpta;

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
  }

}
