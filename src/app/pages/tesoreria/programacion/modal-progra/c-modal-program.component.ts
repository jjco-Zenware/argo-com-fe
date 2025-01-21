import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Marca, TipoProducto } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { TesoreriaService } from '../../service/tesoreriaServices';

@Component({
  selector: 'app-c-modal-program',
  templateUrl: './c-modal-program.component.html'
})
export class CModalProgramComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  registerFormRegistro!: FormGroup;
  headerTitle?: string;
  submitted?: boolean;  
  lstProyectos: any;
  idProgramacion: any;
  lstOrigen: any;
  onlyRead: boolean = false;

  constructor(
    private fb: FormBuilder,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    private messageService: MessageService,
    public datepipe: DatePipe,
    private ordencompraService: OrdencompraService,
    private tesoreriaService: TesoreriaService, 
  ) { }


  get formRegistro() { return this.registerFormRegistro.controls; }

  ngOnInit(): void {
    this.param = this.config.data;
    this.createFrm();
    this.listaProyectoTipo();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.registerFormRegistro = this.fb.group({
      idprogramacion: [{ value: 0, disabled: true }],
      fecha :[{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idproyecto: [{ value: 0, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    })
  }

  guardarProyecto() {
    console.log('guardarItem...', this.registerFormRegistro.value );
    if (this.registerFormRegistro.get('idtipoproyecto')?.value === 0 || this.registerFormRegistro.get('idtipoproyecto')?.value === null) {
      this.messageService.add({severity: 'warn', summary: 'Validación...', detail: 'Seleccionar Origen'});
      return;
    }
    if (this.registerFormRegistro.get('idproyecto')?.value === 0 || this.registerFormRegistro.get('idproyecto')?.value === null) {
      this.messageService.add({severity: 'warn', summary: 'Validación...', detail: 'Seleccionar Proyecto'});
      return;
    }
    this.grabarProyecto();
    //this.cerrar({...this.registerFormRegistro.getRawValue()})
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  grabarProyecto() {

    const $grabarProyecto = this.tesoreriaService.prcProgramacion(this.registerFormRegistro.getRawValue()).subscribe({
      next: (rpta: any) => {
        console.log('this.grabarProyecto', rpta);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          this.cerrar({...this.registerFormRegistro.getRawValue()})
        }else{
        this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
        }
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => { },
    });
    this.$listSubcription.push($grabarProyecto);

  }

  listaProyectoTipo(){
    this.ordencompraService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
        console.log('listaProyectoTipo', rpta);
      this.lstOrigen = rpta;
      },
      error: (err) => {
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

  changeDatePicker(data:any): any {
    let fecha = this.datepipe.transform(data, 'dd/MM/yyyy');
    return fecha;
  }

  getOrigen(data:any){
    console.log('getOrigen', data);
    this.cargarProyectos(data); 
  }

  cargarProyectos(dato:any){
    console.log('cargarProyectos', dato);
    this.ordencompraService.portipoProyectoList(dato).subscribe({
      next: (rpta: any) => {
      this.lstProyectos = rpta;
      console.log('lstProyectos',rpta);

      if (this.idProgramacion > 0) {       
        this.changeProyecto(this.idProgramacion);
      }

      },

      error: (err) => {
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

  changeProyecto(idproyecto : any){
    console.log('changeProyecto',idproyecto);
    if (this.registerFormRegistro.value.idtipoproyecto === 1) {  
      const idoportunidad = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == idproyecto)[0].idoportunidad;
      //this.oportunidadTraerUno(idoportunidad);     
    }   
  }

  


 
}
