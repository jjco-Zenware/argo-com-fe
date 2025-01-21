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
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';

@Component({
  selector: 'app-c-modal-programdet',
  templateUrl: './c-modal-programdet.component.html'
})
export class CModalProgramDetComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  registerFormRegistro!: FormGroup;
  headerTitle?: string;
  submitted?: boolean;  
  lstProyectos: any;
  idProgramacion: any;
  onlyRead: boolean = false; 
  lstMonedas: any;
  lstTipo:any[] = [
    {
      "codtipo": "PAG",
      "nomtipo": "PAGO",
    },
    {
      "codtipo": "COB",
      "nomtipo": "COBRO",
    }];
    idprogramacion:any;
    idprogramaciondet:any;

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
    private proyectosService: ProyectosService,
  ) { }


  get formRegistro() { return this.registerFormRegistro.controls; }

  ngOnInit(): void {
    console.log('this.config.data...', this.config.data);
    this.param = this.config.data;
    this.listaMonedas();
    this.createFrm();
    this.cargarDatos();    
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.registerFormRegistro = this.fb.group({
      idprogramacion: [{ value: this.idprogramacion, disabled: false }],
      idprogramaciondet: [{ value: this.idprogramaciondet, disabled: false }],
      codtipo: [{ value: '', disabled: false }],
      iddocumentoprc: [{ value: 0, disabled: false }],
      fechaprog :[{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
      montoprog: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idpersona: [{ value: 0, disabled: false }],
    })
  }

  cargarDatos(){
    this.idprogramacion = this.param[0].idprogramacion;
    this.idprogramaciondet =  this.param[0].idprogramaciondet;
    console.log('this.param.idprogramacion...', this.param[0].idprogramacion);
    console.log('this.param.idprogramaciondet...', this.param[0].idprogramaciondet);
    if (this.idprogramaciondet !== undefined) {
        this.registerFormRegistro.patchValue(this.param[0]);
    }else{
        this.idprogramaciondet = 0;
    }
  }


  guardarProg() {
    this.registerFormRegistro.get('idprogramacion')?.setValue(this.idprogramacion);
    this.registerFormRegistro.get('idprogramaciondet')?.setValue(this.idprogramaciondet);
    
    let fechaprog;
    fechaprog = this.registerFormRegistro.get('fechaprog')?.value;
    if (this.idprogramaciondet > 0) {
        if (fechaprog.toString().length === 10) {
            fechaprog = new Date(this.serviceUtilitario.formatFecha(fechaprog)); 
            this.registerFormRegistro.get('fechaprog')?.setValue(fechaprog)
        } 
      }

    console.log('guardarItem...', this.registerFormRegistro.value );
    if (this.registerFormRegistro.get('codtipo')?.value === '' || this.registerFormRegistro.get('codtipo')?.value === null) {
      this.messageService.add({severity: 'warn', summary: 'Validación...', detail: 'Seleccionar Tipo...'});
      return;
    }

    if (this.registerFormRegistro.get('idmoneda')?.value === 0 || this.registerFormRegistro.get('idmoneda')?.value === null) {
        this.messageService.add({severity: 'warn', summary: 'Validación...', detail: 'Ingresar Moneda...'});
        return;
    }

    if (this.registerFormRegistro.get('montoprog')?.value === 0 || this.registerFormRegistro.get('montoprog')?.value === null) {
      this.messageService.add({severity: 'warn', summary: 'Validación...', detail: 'Ingresar Monto...'});
      return;
    }

   
    
    this.grabarProgramacionDet();
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  grabarProgramacionDet() {
    const $grabarProyecto = this.tesoreriaService.prcProgramacionDet(this.registerFormRegistro.getRawValue()).subscribe({
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
 
  changeDatePicker(data:any): any {
    let fecha = this.datepipe.transform(data, 'dd/MM/yyyy');
    return fecha;
  }
 
}
