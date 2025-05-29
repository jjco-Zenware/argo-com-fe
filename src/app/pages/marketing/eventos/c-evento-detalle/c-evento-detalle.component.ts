import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Assignees, TablaDetalle, TareaAsignado, TaskList, Tasks } from '@interfaces';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { DialogService } from 'primeng/dynamicdialog';
import { MarketingService } from '../../service/marketingServices';
import { CModalProveedorComponent } from '../modal-proveedor/c-modalproveedor.component';
import { CModalGastosComponent } from '../modal-gastos/c-modalgastos.component';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { CAdjuntosComponent } from 'src/app/pages/compras/registro-proveedor/c-adjuntos/c-adjuntos.component';


@Component({
  selector: 'app-c-evento-detalle',
  templateUrl: './c-evento-detalle.component.html',
  styleUrls: ['./c-evento-detalle.component.scss']
})
export class CEventoDetalleComponent implements OnInit, OnDestroy{
  $listSubcription: Subscription[] = [];
  @Input() IA_data: any;
  @Output() OB_back = new EventEmitter<any>();
  @ViewChild('inputTaskList') inputTaskList!: ElementRef;
  
  headerTitle: any;
  registerForm: any = FormGroup;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  idCodigo: number = 0;
  lstTipoDocumento: TablaDetalle[] = []; 
  visibleDocument: boolean = false;
  visibleDocumentGasto: boolean = true;
  errorMensaje!: string;
  verAdjunto: boolean = true;
  dataAdjunto: any;
  lstProveedores: any[]=[];
  lstResponsable: any[]=[];
  onlyRead: boolean = false;
  //lstTareas: any[] = [];
  minDateValueTarea: any;
  taskContent: any;
  newTask: { idtarea: number; sidtarea: string; text: any; completed: boolean; fechafin: string; fechaini: string; nroorden: number; asignados: { idasignado: number; name: string; image: string; idtarea: number; }[]; } | undefined;
  timeout: any
  progress!: number;
  lstParticipantes: any[]=[];
  idEvento: any;
  filteredAssignees: Assignees[] = [];
  assignees: Assignees[] = [];
  lstAssignees: any[] = [];
  lstGastos: any[]=[];
  horas: any[] = [];
  lstMonedas: any;
  taskList: TaskList={id:0, title:'', tasks:[]};
  lstProyectos: any;
  lstCategoria: any;
  idtarea: number =0;
  asignadosTareas: any[] = [];
  private _nroorden: number = 0;
  asignadosTareaVisible: boolean = false;
  headerTarea!: string;
  filteredAsignadosTareas: TareaAsignado[] = [];
  assigneesTarea: TareaAsignado[] = [];
  lstConfirmados: any[]=[];
  lstParticipantesext: any[]=[];
  tipoparticipante!: string;

  lstClientes: any[]=[];
  verCliente: boolean = false;
  verUbicacion: boolean = false;
  verPais: boolean = false;
  verLugar: boolean = false;
  verDireccion: boolean = false;
  verOrganizador: boolean = false;
  verbtnPreliminar: boolean = false;
  verExterior: boolean = true;
  verbtnEmail: boolean = false;
  lstPais: any[]=[
    { id: 'PER', name: 'PERU' },
    { id: 'ECU', name: 'ECUADOR' },
    { id: 'COL', name: 'COLOMBIA' },
    { id: 'BOL', name: 'BOLIVIA' },
    { id: 'ARG', name: 'ARGENTINA' },
    { id: 'CHI', name: 'CHILE' },
    { id: 'PAR', name: 'PARAGUAY' },
    { id: 'URU', name: 'URUGUAY' },
    { id: 'BRA', name: 'BRASIL' },
    { id: 'VEN', name: 'VENEZUELA' },
    { id: 'PAN', name: 'PANAMA' },
    { id: 'CRI', name: 'COSTA RICA' },
    { id: 'HND', name: 'HONDURAS' },
    { id: 'NIC', name: 'NICARAGUA' },
    { id: 'SAL', name: 'EL SALVADOR' },
    { id: 'GUA', name: 'GUATEMALA' },
    { id: 'MEX', name: 'MEXICO' },
    { id: 'USA', name: 'ESTADOS UNIDOS' }
  ];


  url = 'http://localhost:58329/auth/';
  //url = 'https://sigzenware.com/evento/auth/';

  destinatario = constantesLocalStorage.nombreUsuario;
  cco: string[] = [] ;
  asunto = '';
  cuerpo = '';


constructor(
  private messageService: MessageService,
  private formBuilder: FormBuilder,
  private comprasService: ComprasService,
  private serviceSharedApp: SharedAppService,
  private serviceUtilitario: UtilitariosService,
  public dialogService: DialogService,
  private marketingService: MarketingService,
  private confirmationService: ConfirmationService,
  private ordencompraService: OrdencompraService,
  private proyectosService: ProyectosService,  
) {
  this.comprasService.emitirEvento(0);
}

ngOnInit(): void {
  console.log('this.IA_data', this.IA_data);
      if (this.IA_data !== 0) {
        this.idCodigo = this.IA_data.id;           
        this.dataAdjunto ={
          idCliente: this.IA_data.id,
          codtipoproc: 0,
          veracciones: 0
        }   
        this.verAdjunto = true;  
      }

    this.createForm();
    this.cargarData();
}

setSpinner(valor: boolean) {
  this.blockedDocument = valor;
  }

ngOnDestroy() {
  if (this.$listSubcription != undefined) {
    this.$listSubcription.forEach((sub) => sub.unsubscribe());
  }
}

get formCliente() { return this.registerForm.controls; }

createForm() {
  //Agregar validaciones de formulario
  this.registerForm = this.formBuilder.group({
    id: [{ value: '0', disabled: false }],
    idlista: [{ value: 8, disabled: false }],
    idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    idcliente: [{ value: '', disabled: false }],
    title: [{ value: '', disabled: false }],
    description: [{ value: '', disabled: false }],
    idresponsable: [{ value: 38, disabled: false }],
    progreso: [{ value: 0, disabled: false }],
    indcompleto: [{ value: false, disabled: false }],
    startDate: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
    dueDate: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
    horareg: [{ value: '00:00', disabled: false }],
    idmoneda: [{ value: 0, disabled: false }],
    monto:[{ value: 0, disabled: false }],
    indvig:[{ value: true, disabled: false }],
    idtrack: [{ value: 0, disabled: false }],
    codproyecto: [{ value: '', disabled: false }],
    tc:[{ value: 0, disabled: false }],
    lugarevento: [{ value: '', disabled: false }],
    idproyecto:[{ value: 0, disabled: false }],
    horafin: [{ value: '00:00', disabled: false }],
    codcategoria:[{ value: 410, disabled: false }],
    codubicacion: [{ value: 'NAC', disabled: false }],
    codpais: [{ value: '', disabled: false }],
    idproveedor: [{ value: '', disabled: false }],
    direvento: [{ value: '', disabled: false }],
  });
  
}

cargarData(){
  this.asignadosTareas = [];
  this.listaAsignados();
  this.listaProveedores();  
  this.listaUsuarios();  
  this.cargarHoras();
  this.listaMonedas();
  this.listarItemsTabla()
  this.listaClientes();

  if (this.idCodigo > 0) {
    console.log('this.constantesLocalStorage', constantesLocalStorage);
    this.mostrarBotones(this.IA_data.codcategoria);
    this.registerForm.patchValue(this.IA_data); 
    this.taskList = this.IA_data.taskList;
    this.lstAssignees = this.IA_data.assignees;
    this.lstParticipantes = this.IA_data.contactos.filter((x: { tipocontacto: string; }) => x.tipocontacto == 'C');
    this.lstParticipantesext = this.IA_data.contactos.filter((x: { tipocontacto: string; }) => x.tipocontacto == 'E');
    this.asunto = this.IA_data.title;

    this.calculateProgress();    
    if (this.IA_data.idlista != 8) {
      this.visibleDocumentGasto = false;
      this.verbtnEmail = true;
    }
    this.getListarGasto();
      this.getListarConfirmados();
    this.verbtnPreliminar = true;
    this.lstParticipantes.forEach(element => {
      this.cco.push(element.email);
    });
    this.cuerpo = this.url + this.idCodigo;
  }else{
    //this.addTaskNew();
    this.mostrarBotones(410);
  }
  
}

guardar() {
  if (this.validarDatos())
    {
        this.setSpinner(false);
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    if (this.registerForm.value.codcategoria === 410 || this.registerForm.value.codcategoria === 416)
      {
          this.registerForm.get('idcliente')?.setValue(0);
      }else{
          this.registerForm.get('idproveedor')?.setValue(0);
      }

    if (this.registerForm.value.codcategoria === 417 )
      {
          this.registerForm.get('idcliente')?.setValue(0);
          this.registerForm.get('idproveedor')?.setValue(0);
      }

    let startDate;
    startDate = this.registerForm.value.startDate;
    if (this.idCodigo > 0) {
      if (startDate.toString().length === 10) {
        startDate = new Date(this.serviceUtilitario.formatFecha(startDate)); 
      }        
    }

    let dueDate;
    dueDate = this.registerForm.value.dueDate;
    if (this.idCodigo > 0) {
      if (dueDate.toString().length === 10) {
        dueDate = new Date(this.serviceUtilitario.formatFecha(dueDate)); 
      }        
    }

    let objectPriority ={
      color : "",
      title : "",
  }

  for (let i = 0; i < this.taskList.tasks.length; i++) {
    this.taskList.tasks[i].nroorden = i + 1;
}

let listaConcatena = this.lstParticipantes.concat(this.lstParticipantesext);
    console.log('this.listaConcatena', listaConcatena);

  const objeto = {
    ...this.registerForm.getRawValue(),
    progress: this.progress,
    startDate: startDate,
    dueDate: dueDate,
    priority:objectPriority,
    taskList:this.taskList,
    assignees: this.lstAssignees,
    contactos: listaConcatena
  };  

  const _objeto={
    evento : objeto,
    idusuario : constantesLocalStorage.idusuario,
  }

  //Verdadero si todos los campos están llenos 
    this.setSpinner(true);
    this.mensajeSpinner="Guardando...!";
      console.log('objeto...', _objeto);
     const $guardar = this.marketingService.prcEventos(_objeto)
          .subscribe({
          next: (rpta:any) => {
            this.setSpinner(false);
              console.log("rpta prcClientes : ", rpta);
              if (rpta.procesoSwitch === 0){
                  this.messageService.add({severity: 'success', detail: "Operación exitosa" });
                  //this.visibleDocument = false;
                  //this.visibleDocumentGasto = false; 
                  //this.idCliente = rpta.resultProceso;
                  if (this.idCodigo === 0) {
                    this.comprasService.emitirEvento(rpta.resultProceso);
                  }
                  
                  //this.OB_back.emit(this.IA_data);
                }else{
                    this.messageService.add({severity: 'error', detail: rpta.mensaje });
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
          complete:() => {
            this.setSpinner(false);
          }
          });
          this.$listSubcription.push($guardar);

  
}

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerForm.value);

    if (this.registerForm.value.codcategoria === '' || this.registerForm.value.codcategoria === null)
      {
          this.errorMensaje="Seleccionar Categoría...!";
          _error = true;
      }

    if (!_error && (this.registerForm.value.codcategoria === 411 || this.registerForm.value.codcategoria === 415 || this.registerForm.value.codcategoria === 414)) 
      {
                
        if (this.registerForm.value.idcliente === '' || this.registerForm.value.idcliente === null)
          {
              this.errorMensaje="Seleccionar Cliente...!";
              _error = true;
          }
      }

    if (!_error && (this.registerForm.value.title === '' || this.registerForm.value.title === null))
      {
          this.errorMensaje="Ingresar Nombre del Evento...!";
          _error = true;
      }

    if (!_error && (this.registerForm.value.startDate === null ||this.registerForm.value.startDate ==='' ))
    {
        this.errorMensaje="Ingresar Fecha Inicial...!";
        _error = true;
    }

    if (!_error && (this.registerForm.value.dueDate === null || this.registerForm.value.dueDate === ''))
    {
        this.errorMensaje="Ingresar Fecha Final...!";
        _error = true;
    }

    // if (!_error && (this.registerForm.value.horareg === null || this.registerForm.value.horareg === '' || this.registerForm.value.horareg === '00:00'))
    //   {
    //       this.errorMensaje="Ingresar Hora Inicial...!";
    //       _error = true;
    //   }

    //   if (!_error && (this.registerForm.value.horafin === null || this.registerForm.value.horafin === '' || this.registerForm.value.horafin === '00:00'))
    //     {
    //         this.errorMensaje="Ingresar Hora Final...!";
    //         _error = true;
    //     }

    if (!_error && (this.registerForm.value.lugarevento === '' || this.registerForm.value.lugarevento === null))
      {
          this.errorMensaje="Ingresar Lugar ...!";
          _error = true;
      }

    if (!_error && (this.registerForm.value.codcategoria === 416 || this.registerForm.value.codcategoria === 410)) 
      {            
        if (this.registerForm.value.idproveedor === '' || this.registerForm.value.idproveedor === null)
        {
            this.errorMensaje="Seleccionar Organizador...!";
            _error = true;
        }
      }
    

    if (!_error && (this.registerForm.value.idresponsable === '' || this.registerForm.value.idresponsable === null))
    {
        this.errorMensaje="Seleccionar Responsable...!";
        _error = true;
    }    
    if (!_error && this.registerForm.value.idmoneda === null || this.registerForm.value.idmoneda === '')
    {
          this.errorMensaje="Seleccionar Moneda...!";
          _error = true;
    } 

    if (!_error && (this.registerForm.value.monto === null || this.registerForm.value.monto ==='' || this.registerForm.value.monto === 0))
    {
        this.errorMensaje="Ingresar Presupuesto...!";
        _error = true;
    }
  
    // if (!_error && (this.registerForm.value.descripcion === '' || this.registerForm.value.descripcion === null))
    // {
    //     this.errorMensaje="Ingresar Descripción...!";
    //     _error = true;
    // }       

    return _error;
    }

    addTask(event: Event) {
      event.preventDefault();
      const desdeStr = this.serviceUtilitario.obtenerFechaActualFormat();
      this.minDateValueTarea = this.serviceUtilitario.obtenerFechaActual();
      console.log('this.minDateValueTarea...', this.minDateValueTarea);
      console.log('desdeStr...', desdeStr);

      const inroorden = this.taskList.tasks.length + 1;

      if (this.taskContent.trim().length > 10) {
          this.newTask = { idtarea:0, sidtarea:'', text: this.taskContent, completed: false, fechafin: desdeStr,fechaini: desdeStr, nroorden:inroorden,  asignados: [ ] };
          this.taskList.tasks.unshift(this.newTask);
          this.taskContent = '';
          this.calculateProgress();
      }else{
          this.messageService.add({severity: 'info', detail: "Debe Ingresar más de 10 Carácteres." });
      }
  }

  addTaskNew() {
    //event.preventDefault();
    const desdeStr = this.serviceUtilitario.obtenerFechaActualFormat();
    this.minDateValueTarea = this.serviceUtilitario.obtenerFechaActual();
    console.log('this.minDateValueTarea...', this.minDateValueTarea);
    console.log('desdeStr...', desdeStr);

    const inroorden = this.taskList.tasks.length + 1;
    this.newTask = { idtarea:0, sidtarea:'', text: 'Verificar los pendientes para el Evento...!', completed: false, fechafin: desdeStr,fechaini: desdeStr, nroorden:inroorden,  asignados: [ { idasignado: constantesLocalStorage.idusuario, name: constantesLocalStorage.nombreUsuario, image:constantesLocalStorage.imagen, idtarea:0 }] };
    this.taskList.tasks.unshift(this.newTask);
    this.calculateProgress();
}

  removeTask(index:number) {
    this.taskList.tasks.splice(index, 1);
    //this.taskList.tasks.emit(lstTareas);
    this.calculateProgress();
  }

  focus() {
    this.timeout = setTimeout(
      () => this.inputTaskList.nativeElement.focus(),
      1
  );
  }

  calculateProgress() {
    console.log('Cálculo...');
    if (this.taskList.tasks) {
        let completed = this.taskList.tasks.filter(
            (t: { completed: any; }) => t.completed
        ).length;

        if (this.taskList.tasks.length == 0) {
            this.progress = 0;
        } else {
            this.progress = Math.round(
                100 * (completed / this.taskList.tasks.length)
            );
            //console.log('Cálculo...' , completed / this.formValue.taskList.tasks.length);
        }

       //console.log('completas...' ,completed);
       //console.log('tareas...' ,this.formValue.taskList.tasks.length);
       //console.log('Cálculo...' , completed / this.formValue.taskList.tasks.length);
    }
}

AsignarTarea(task: Tasks)  {
  console.log('task...' ,task);
  this.asignadosTareas=[];
  this.idtarea = task.idtarea;
  this._nroorden = task.nroorden;
  this.asignadosTareas = task.asignados;
  this.headerTitle= 'Asignados de la Tarea';
  this.headerTarea= 'Tarea: ' + task.text;
  this.asignadosTareaVisible = true;
}

aceptarAsignado()  {
  console.log(' this.asignadosTareas.length....', this.asignadosTareas.length);
  if (this.asignadosTareas.length === 0) {
      this.messageService.add({severity: 'info', detail: "Como mínimo la tarea debe tener un Asignado" });
      return;
  }
  for (let x = 0; x < this.taskList.tasks.length; x++) {
      if (this.taskList.tasks[x].idtarea == this.idtarea
       && this.taskList.tasks[x].nroorden == this._nroorden)
       {    //identificamos la tarea
          this.taskList.tasks[x].asignados=[]; //limpiamos array de asigandos de la tarea
          for (let z = 0; z < this.asignadosTareas.length; z++) {
              this.taskList.tasks[x].asignados.unshift(this.asignadosTareas[z]); //agregamos asignados a la tarea
          }
      }
  }
  console.log('this.formValue.taskList?.tasks....',this.taskList.tasks);
  this.asignadosTareaVisible = false;
}



filterAsignadoTarea(event: any) {
  let filtered: TareaAsignado[] = [];
  let query = event.query;
  //this.lstAssignees

  for (let i = 0; i < this.lstAssignees.length; i++) {
      let asignadotar = this.lstAssignees[i];
      if (
          asignadotar.name &&
          asignadotar.name.toLowerCase().indexOf(query.toLowerCase()) == 0
      ) {
          filtered.push(asignadotar);
      }
  }
  this.filteredAsignadosTareas = filtered;
}

draggedBlock : any;
    starter: number = 0;

    dragStart(task: any, i:  number) {
        this.draggedBlock = task;
        this.starter = i;
        console.log("Start: " + i);
    }

    dragEnd() {
        this.draggedBlock = null;
    }

    drop(event: any,  i:  number) {
        console.log("Drop: " + i);
        this.taskList.tasks.splice(this.starter, 1);
        this.taskList.tasks.splice(i, 0, this.draggedBlock);
    }


setFechaMaxTarea(event: Date){
  this.minDateValueTarea = event;
}

 agregarProveedor(data: any,index: number){
  if (this.verCliente && this.registerForm.get('idcliente').value == 0) {
    this.messageService.add({severity: 'info', detail: "Seleccionar Cliente...!" });
    return;
    
  }
    data.nroindex = index;
    data.idcliente = this.registerForm.get('idcliente').value;
    data.idordencompra = this.idEvento;
    data.tipocontacto = "C";
    data.lista =  this.lstParticipantes;
    const refMensaje = this.dialogService.open(CModalProveedorComponent, {
      data: data,
      header: data.length == 0 ? "Agregar Participante" : "Editar Participante - " + data.nomcomercial, //'Selección de Cotización de ' +  data.nomcomercial,
      styleClass: 'testDialog',
      closeOnEscape: false,
      closable: true,
      width: '30%'
  });
  refMensaje.onClose.subscribe((rpta: any) => {
    console.log('onClose index',index);
    if (rpta != undefined) {
        const _posAll: number = this.lstParticipantes.findIndex(((x: { nroindex: number; }) => x.nroindex == index))
        if (_posAll != -1) {
          this.lstParticipantes.splice(_posAll, 1)
        }
      this.lstParticipantes.push(rpta.objeto);
      console.log('this.lstParticipantes',this.lstParticipantes);
      this.cco = [];
      
      this.lstParticipantes.forEach(element => {
        this.cco.push(element.email);
      });
    }
  });
  }

  eliminarCotizacion(data: any) {
    console.log('onClose data',data);
    this.confirmationService.confirm({
      key: 'confirm1',
      header: 'Confirmación',
      message:  '¿Desea Eliminar Item ' + '<b>' + data.nomcomercial + '</b>' + '?' ,
      accept: () => {
        if (data.iditempostor > 0) {
          const _posAll: number = this.lstParticipantes.findIndex(((x: { iditempostor: any; }) => x.iditempostor == data.iditempostor))
          if (_posAll != -1) {
          this.lstParticipantes.splice(_posAll, 1)
          }
      }else{
          const _posAll: number = this.lstParticipantes.findIndex(((x: { idcontacto: any; }) => x.idcontacto == data.idcontacto))
          if (_posAll != -1) {
          this.lstParticipantes.splice(_posAll, 1)
          }
      }
      this.cco = [];
      
      this.lstParticipantes.forEach(element => {
        this.cco.push(element.email);
      });
      }
  });
  }

  agregarProveedorExt(data: any,index: number){
  if (this.verCliente && this.registerForm.get('idcliente').value == 0) {
    this.messageService.add({severity: 'info', detail: "Seleccionar Cliente...!" });
    return;
    
  }
    data.nroindex = index;
    data.idcliente = this.registerForm.get('idcliente').value;
    data.idordencompra = this.idEvento;
    data.tipocontacto = "E";
    data.lista =  this.lstParticipantesext;
    const refMensaje = this.dialogService.open(CModalProveedorComponent, {
      data: data,
      header: data.length == 0 ? "Agregar Participante Externo" : "Editar Participante Externo- " + data.nomcomercial, //'Selección de Cotización de ' +  data.nomcomercial,
      styleClass: 'testDialog',
      closeOnEscape: false,
      closable: true,
      width: '30%'
  });
  refMensaje.onClose.subscribe((rpta: any) => {
    console.log('onClose index',index);
    if (rpta != undefined) {
        const _posAll: number = this.lstParticipantesext.findIndex(((x: { nroindex: number; }) => x.nroindex == index))
        if (_posAll != -1) {
          this.lstParticipantesext.splice(_posAll, 1)
        }
      this.lstParticipantesext.push(rpta.objeto);
      console.log('this.lstParticipantesext',this.lstParticipantesext);
      this.cco = [];
      
      this.lstParticipantesext.forEach(element => {
        this.cco.push(element.email);
      });
    }
  });

  }

  eliminarCotizacionExt(data: any) {
    console.log('onClose data',data);
    this.confirmationService.confirm({
      key: 'confirm1',
      header: 'Confirmación',
      message:  '¿Desea Eliminar Item ' + '<b>' + data.nomcomercial + '</b>' + '?' ,
      accept: () => {
        if (data.iditempostor > 0) {
          const _posAll: number = this.lstParticipantesext.findIndex(((x: { iditempostor: any; }) => x.iditempostor == data.iditempostor))
          if (_posAll != -1) {
          this.lstParticipantesext.splice(_posAll, 1)
          }
      }else{
          const _posAll: number = this.lstParticipantesext.findIndex(((x: { idcontacto: any; }) => x.idcontacto == data.idcontacto))
          if (_posAll != -1) {
          this.lstParticipantesext.splice(_posAll, 1)
          }
      }
       this.cco = [];
      
      this.lstParticipantesext.forEach(element => {
        this.cco.push(element.email);
      });
      }
  });
  }

  filterAssignees(event: any) {
    let filtered: Assignees[] = [];
    let query = event.query;

    for (let i = 0; i < this.assignees.length; i++) {
        let assignee = this.assignees[i];
        if (
            assignee.name &&
            assignee.name.toLowerCase().indexOf(query.toLowerCase()) == 0
        ) {
            filtered.push(assignee);
        }
    }

    this.filteredAssignees = filtered;
    console.log('this.filteredAssignees...', this.filteredAssignees);
}

listaAsignados() {
  this.marketingService.obtenerUsuarios().subscribe({
      next: (rpta: any) => {
          this.assignees = rpta;
          console.log('this.assignees...', this.assignees);
          this.assigneesTarea = rpta;
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

agregarGastos(data: any,index: number){
  data.nroindex = index;
  data.idproyecto = this.registerForm.get('idproyecto').value;
  const refMensaje = this.dialogService.open(CModalGastosComponent, {
    data: data,
    header: data.length == 0 ? "Agregar Gasto" : "Editar Gasto", 
    styleClass: 'testDialog',
    closeOnEscape: false,
    closable: true,
    width: '40%'
});
refMensaje.onClose.subscribe((rpta: any) => {
  console.log('onClose index',index);
  if (rpta != undefined) {

    this.guardarGasto(rpta.objeto);
  }
});

}

eliminarGastos(data: any) {
  console.log('onClose data',data);
  this.confirmationService.confirm({
    key: 'confirm1',
    header: 'Confirmación',
    message:  '¿Desea Eliminar ' + '<b>' + data.nomempresa + '</b>' + '?' ,
    accept: () => {
    this.estadoGasto(data);
    }
});
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

listaUsuarios() {
  const $listaUsuarios = this.marketingService.listarUsuarios([]).subscribe({
      next: (rpta: any) => {
      console.info('listaUsuarios : ', rpta);
      this.lstResponsable = rpta;
      
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
  this.$listSubcription.push($listaUsuarios);
}

cargarHoras() {
  const arrHoras = [];
  // for (let i = 0; i <= 49; i++) {
  //   const hora = Math.floor(i / 2);
  //   const minuto = i % 2 === 0 ? '00' : '30';
  //   const tiempo = `${hora.toString().padStart(2, '0')}:${minuto}`;
  //   arrHoras.push({ name: tiempo });
  // }
   for (let i = 0; i <= 96; i++) {
    const hora = Math.floor(i / 4);
    let minuto;
    if (i % 4 === 0) {minuto = '00'}
    if (i % 4 === 1) {minuto = '15'}
    if (i % 4 == 2) {minuto = '30'}
    if (i % 4 === 3) {minuto = '45'}
    
    const tiempo = `${hora.toString().padStart(2, '0')}:${minuto }`;
    arrHoras.push({ name: tiempo });
  }
  this.horas = [...arrHoras];
}

listaMonedas() {
  const $listaMonedas = this.marketingService.obtenerMonedas().subscribe({
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

// cargarProyectos(dato:any){
//   this.ordencompraService.portipoProyectoList(dato).subscribe({
//     next: (rpta: any) => {
//     this.lstProyectos = rpta;
//     this.registerForm.get('idproyecto').setValue(this.lstProyectos[0].idproyecto);
  
//     console.log('cargarProyectos...',this.lstProyectos);

//         },

//     error: (err) => {
//     this.messageService.clear();
//     this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: mensajesQuestion.msgErrorGenerico,
//         });
//     },
//     complete: () => {
//     },
// });
// } 

guardarGasto(objeto:any){


  this.setSpinner(true);
  this.mensajeSpinner = 'Guardando...!'; 

  const obj = {
    ...objeto,
    idproyecto: this.registerForm.get('idproyecto').value,
    idtipodocprc: 7
  }

  console.log('guardarOC...', obj);
  
  this.ordencompraService.ordenDocumentoprc(obj).subscribe({
    next: (rpta: any) => {
      this.setSpinner(false);
      if (rpta.procesoSwitch === 0){
        this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
                 
         this.getListarGasto();
          // this.dataAdjunto ={
          //   idCliente: this.idOrdenC,
          //   codtipoproc: 8,
          //   veracciones: 0
          // }   

       
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

getListarGasto(){
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    
    const objeto = {
      //...this.frmDatos.value,
      idproyecto: this.registerForm.get('idproyecto').value,
      idtipodocprc: 7,
      idusuario: constantesLocalStorage.idusuario
    }

    const $getListarOrdenCompra = this.proyectosService.ordenCompraListGasto(objeto)
      .subscribe({
        next: (rpta:any) => {
            this.setSpinner(false);
            console.log('rpta getListar', rpta);
            this.lstGastos = rpta.ordenescompra
        },
        error:(err)=>{
            this.setSpinner(false);
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($getListarOrdenCompra)
  }

  estadoGasto(data:any){
    const objeto ={
      idordencompra: data.idordencompra,
      estado: 'ANU'
    }

    const $cargarOrdenC = this.proyectosService.ordenCompraUpdEstado(objeto)
      .subscribe({next: (rpta:any) => { 
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });     
         this.getListarGasto();
        }else{
          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
        }
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
          
        }
      });
    this.$listSubcription.push($cargarOrdenC)
  }

   anexos(dato: any, param: string) {
        console.log("anexos : ", dato);
        const refMensaje = this.dialogService.open(CAdjuntosComponent, {
            data: { idoportunidad: 0 , 
              codtipoproc: 2, 
              idnroproceso: 0, 
              parametro: param, 
              idCliente: dato.idordencompra
            },
            header: 'Adjuntos de ' + dato.nomempresa,
            styleClass: 'testDialog',
            closeOnEscape: false,
            closable: true,
            width: '50%'
        });
        refMensaje.onClose.subscribe((rpta: any) => {
          
          });
    }

    listarItemsTabla() {
      this.comprasService.obtenerItemsTabla(127).subscribe({
          next: (rpta: any) => {
            console.info('listarItemsTabla : ', rpta);
              this.lstCategoria = rpta;
          },
          error: (err) => {
          console.info('error : ', err);
          this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
      });  
    }

    changeUbicacion(value:any){
      console.log('changeUbicacion...', value);
      if (value === 'NAC') {	
        this.registerForm.get('codpais')?.disable()
        this.registerForm.get('codpais')?.setValue('');
      }else{
        this.registerForm.get('codpais')?.enable();
      }
      
    }

    listaClientes() {
      const $getClientes = this.marketingService.obtenerClientes('CLI').subscribe({
        next: (rpta: any) => {
          this.lstClientes = rpta.filter((x: { idcliente: number; }) => x.idcliente != 0);
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => { },
      });
      this.$listSubcription.push($getClientes);
    }

    mostrarBotones(data:any){
      console.log( '..mostrarBotones...', data);
      this.registerForm.get('idcliente')?.setValue(0);
      switch (data) {
        case 410: //GENERACIÓN DE DEMANDA
          this.verCliente = false;
          this.verUbicacion = false;
          this.verPais = false;
          this.verLugar = true;
          this.verDireccion = true;
          this.verOrganizador = true;
          this.verExterior = true;
        break;
        case 411: //CUSTOMER DAY
          this.verCliente = true;
          this.verUbicacion = false;
          this.verPais = false;
          this.verLugar = true;
          this.verDireccion = true;
          this.verOrganizador = false;
          this.verExterior = true;
        break;      
        case 414://INTERNO 
          this.verCliente = true;
          this.verUbicacion = false;
          this.verPais = false;
          this.verLugar = true;
          this.verDireccion = true;
          this.verOrganizador = false;
          this.verExterior = true;
          
        break;
        case 415://WORKSHOP
          this.verCliente = true;
          this.verUbicacion = false;
          this.verPais = false;
          this.verLugar = true;
          this.verDireccion = true;
          this.verOrganizador = false;
          this.verExterior = true;
          
        break;
        case 416://EXTERIOR
          this.verCliente = false;
          this.verUbicacion = false;
          this.verPais = true;
          this.verLugar = true;
          this.verDireccion = true;
          this.verOrganizador = true;
          this.verExterior = false
        break;
        case 417://RESPONSABLE SOCIAL
          this.verCliente = false;
          this.verUbicacion = true;
          this.verPais = false;
          this.verLugar = true;
          this.verDireccion = true;
          this.verOrganizador = false;
          this.verExterior = true;
        break;
      }
      
    }

    get mailtoLink() {      
      return `mailto:${this.destinatario}?bcc=${this.cco}&subject=${encodeURIComponent(this.asunto)}&body=${encodeURIComponent(this.cuerpo)}`;
    }
  
  vistaPreliminar(){

    console.info('listarItemsTabla : ', this.idCodigo);
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Detalle...!';

    const objeto = {
      idEvento: this.idCodigo,
      idproyecto: this.IA_data.idproyecto,  
      idtipodocprc: 7,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.comprasService.descargarInformeEvento(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);      
        
        const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = 'EVENTO-' + this.idCodigo;
  
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.target = '_blank';
          a.click();

          window.open(url);

          setTimeout(() => {
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
          }, 100);
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
    this.$listSubcription.push($cargarOrdenC)
  }

  getListarConfirmados() {
      const $getClientes = this.marketingService.obtenerConfirmados(this.idCodigo).subscribe({
        next: (rpta: any) => {
          console.log('this.lstConfirmados...', rpta);
          this.lstConfirmados = rpta;
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => { },
      });
      this.$listSubcription.push($getClientes);
    }

}