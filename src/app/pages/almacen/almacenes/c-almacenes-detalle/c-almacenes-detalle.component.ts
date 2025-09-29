
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlmacenService } from '../../service/almacenServices';
import { CModalUbicacionComponent } from '../c-modal-ubicacion/c-modalubicacion.component';

@Component({
  selector: 'app-c-almacenes-detalle',
  templateUrl: './c-almacenes-detalle.component.html',
  styleUrls: ['./c-almacenes-detalle.component.scss']
})
export class CAlmacenesDetalleComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  registerFormRegistro!: FormGroup;
  submitted = false;
  headerTitle: string = '';
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  verbtnGrabar: boolean = false;  
  onlyRead: boolean = false;
  errorMensaje: string = "";
  idAlmacen: any;
  param:any;
  files!: TreeNode[];
  selectedFiles!: TreeNode[];
  verbtnUbicacion: boolean = false; 
  file: any; 
  visUbicacion: boolean = true;
  lstUsuarios:any;
  lstTipoAlma:any;
  events: any[] = [];
  verAdjunto: boolean = false;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private almacenService: AlmacenService,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) { }

  ngOnInit(): void {
    console.log('this.config', this.IA_data);
    this.idAlmacen = this.IA_data.idalmacen;
    this.param = this.IA_data.paramReg;
    this.createFormRegistro(); 
    this.listarTipoAlmacen();
    this.listaUsuarios();

     this.events = [
            { status: 'Zona', icon: 'pi pi-arrow-right', color: '#9C27B0' },
            { status: 'Sector', icon: 'pi pi-arrow-right', color: '#673AB7' },
            { status: 'Fila', icon: 'pi pi-arrow-right', color: '#FF9800' },
            { status: 'Estante/Rack', icon: 'pi pi-arrow-right', color: '#607D8B' },
            { status: 'Nivel/Casillero', icon: 'pi pi-arrow-right', color: '#673AB7' }
        ];

    if (this.idAlmacen > 0) {      
      this.traerUno();
      // if (this.files.length = 0) {        
      //   this.verbtnUbicacion = true;
      // }else{        
      //   this.verbtnUbicacion = false;
      // }

      
    }   
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idalmacen: [{ value: 0, disabled: true }],
      idofi: [{ value: 0, disabled: false }],
      nomalmacen: [{ value: '', disabled: false }],
      diralmacen: [{ value: '', disabled: false }],
      estado: [{ value: 'REG', disabled: false }],
      codUsuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idresponsable: [{ value: '', disabled: false }],
      tipoalmacen: [{ value: '', disabled: false }],

    });
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  listarTipoAlmacen(){  
    const $getListar = this.almacenService.obtenerItemsTabla(129)
      .subscribe({
        next: (rpta:any) => {

            this.lstTipoAlma = rpta
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => { 
        }
      });
    this.$listSubcription.push($getListar)
  }

 listaUsuarios() {
         const $listaUsuarios = this.almacenService
             .listarUsuarios([])
             .subscribe({
                 next: (rpta: any) => {
                     console.info('listaUsuarios : ', rpta);
                     this.lstUsuarios = rpta;
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
         this.$listSubcription.push($listaUsuarios);
     }


  traerUno(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';

    const $cargarOrdenC = this.almacenService.almacenTraeruno(this.idAlmacen)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta', rpta);

          this.idAlmacen = rpta.idalmacen
            this.setSpinner(false);
            this.registerFormRegistro.patchValue(rpta);  
            this.visUbicacion = false;   
            this.TraerUbicacion();           
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);
          
        }
      });
    this.$listSubcription.push($cargarOrdenC)
  }

  guardar(){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';

  

    console.log('guardarOC...', this.registerFormRegistro.getRawValue());
    
    this.almacenService.GrabarAlamcen(this.registerFormRegistro.getRawValue()).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idAlmacen === 0) {
            this.idAlmacen = rpta.resultProceso; 
            this.registerFormRegistro.value.idalmacen =  rpta.resultProceso; 
          }
          this.visUbicacion = false;
          //this.cerrar();
          this.traerUno();
         
        }else{
        this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
        }
      },
      error: (err) => {
        this.setSpinner(false);
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
 
  cerrar() {    
    this.refDatoItem.close();
  }
  

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

      if (this.registerFormRegistro.value.tipoalmacen === '' || this.registerFormRegistro.value.tipoalmacen === null )
      {
          this.errorMensaje="Seleccionar Tipo de Almacén...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.idresponsable === '' || this.registerFormRegistro.value.idresponsable === null) )
      {
          this.errorMensaje="Seleccionar Responsable...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.nomalmacen === '' || this.registerFormRegistro.value.nomalmacen === null) )
      {
          this.errorMensaje="Ingresar Nombre de Almacen...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.diralmacen === '' || this.registerFormRegistro.value.diralmacen === null) )
        {
            this.errorMensaje="Ingresar Dirección de Almacen...!";
            _error = true;
        }

       return _error;
     }

  TraerUbicacion(){
    const $TraerUbicacion = this.almacenService.traerUbicaciones(this.idAlmacen)
    .subscribe({
      next: (rpta:any) => {
          console.log('TraerUbicacion', rpta)
          this.files = rpta;
          this.files.forEach((node) => {
            this.expandRecursive(node, true);
        });
      },
      error:(err)=>{
          this.serviceSharedApp.messageToast()
      },
      complete:() => { 
      }
    });
  this.$listSubcription.push($TraerUbicacion)
  }

  nodeSelect(event: any) {
    //this.verbtnUbicacion = true;
    console.log('nodeSelect', event)
    //this.file = event.node;
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
        node.children.forEach((childNode) => {
            this.expandRecursive(childNode, isExpand);
        });
    }
}

accionUbicacion(event: any, dato:any){
  console.log('accionUbicacion',  event)
  let file_ = event
  let title = '';

  switch (dato) {
    case 0:
      title = file_.key === '0' ? 'Nueva Ubicación' : 'Agregar Ubicación a ' + event.label;
      file_.idubicacionpadre = file_.key;
      file_.nomubicacion = '';
      file_.key = 0;
      
    break;
    case 1:
      title = 'Editar ' + file_.label;
      file_.nomubicacion = file_.label;
    break;
  }

  const ref = this.dialogService.open(CModalUbicacionComponent, {
            data: file_,
            header: title,
            closeOnEscape: false,
            styleClass: 'testDialog',
            width: '30%'
        });
    
        ref.onClose.subscribe(() => {
            this.TraerUbicacion();
            this.verbtnUbicacion = false;
          });
}

  eliminarUbicacion(node:any){
    console.log('eliminar...', node);
    console.log('eliminarUbicacion...', node.children);
    if (node.children !== undefined){
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: "No se puede eliminar, porque tiene Ubicaciones dependientes..." });
      return;
    }

    this.confirmationService.confirm({
        message: mensajesQuestion.msgPreguntaInactivar,
        key: "confirm1",
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.setSpinner(true);
          this.mensajeSpinner = 'Eliminando...!';
          const objeto = {
            idubicacion: node.key,
          }

            const $TraerUbicacion = this.almacenService.delUbicaciones(objeto)
            .subscribe({
            next: (rpta:any) => {
                if (rpta.procesoSwitch === 0){
                    this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });   
                    this.TraerUbicacion();
                  }else{
                  this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
                  }
            },
            error:(err)=>{
                this.serviceSharedApp.messageToast()
            },
            complete:() => { 
              this.setSpinner(false);
            }
            });
        this.$listSubcription.push($TraerUbicacion)
        }
    });

  }
}
