import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { constantesLocalStorage } from '@constantes';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
@Component({
  selector: 'app-c-modalgastos',
  templateUrl: './c-modalgastos.component.html'
})
export class CModalGastosComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    param: any;
    headerTitle?: string; 
    idProgramacion: any;
    onlyRead: boolean = false;
    registerFormGasto!: FormGroup;
    lstProveedores: any[]=[];
    lstMonedas: any[]=[];
    errorMensaje: string = "";

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private serviceUtilitario: UtilitariosService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param Postores...', this.param);
    this.createForm();
    this.listaMonedas();

    if (this.param.iditempostor) {
        this.registerFormGasto.patchValue(this.param);
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createForm() {
    //Agregar validaciones de formulario
    this.registerFormGasto = this.formBuilder.group({
        idevento: [{ value: 0, disabled: false }],
        idgasto : [{ value: null, disabled: false }],
        fecgasto: [{ value: this.serviceUtilitario.obtenerFechaActual() , disabled: false }],
        tipnrodocum: [{ value: null, disabled: false }],
        descripcion: [{ value: null, disabled: false }],
        idmoneda: [{ value: null, disabled: false }],
        idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
        simbmoneda: [{ value: null, disabled: false }],
        mtogasto: [{ value: 0, disabled: false }],
    });
}

  guardar() {       
    console.log('guardar...', this.registerFormGasto.getRawValue());
    if (this.validarDatos())
    {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    const simbmoneda = this.lstMonedas.filter(x=>x.idmoneda == this.registerFormGasto.get('idmoneda')?.value)[0].simbmoneda;
    this.registerFormGasto.get('simbmoneda')?.setValue(simbmoneda);

    this.cerrar({...this.registerFormGasto.getRawValue()})      
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
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

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormGasto.value);

    if (this.registerFormGasto.value.fecgasto === '' || this.registerFormGasto.value.fecgasto === null)
      {
          this.errorMensaje="Ingresar Fecha...!";
          _error = true;
      }

      if (!_error && (this.registerFormGasto.value.tipnrodocum === null || this.registerFormGasto.value.tipnrodocum ===''))
        {
            this.errorMensaje="Ingresar Tipo y Número de Documento...!";
            _error = true;
        }

      if (!_error && this.registerFormGasto.value.idmoneda === null || this.registerFormGasto.value.idmoneda === '')
        {
              this.errorMensaje="Seleccionar Moneda...!";
              _error = true;
        } 

    if (!_error && (this.registerFormGasto.value.mtogasto === null || this.registerFormGasto.value.mtogasto ==='' || this.registerFormGasto.value.mtogasto === 0))
    {
        this.errorMensaje="Ingresar Monto...!";
        _error = true;
    }

    if (!_error && (this.registerFormGasto.value.comentario === null || this.registerFormGasto.value.comentario ==='' ))
      {
          this.errorMensaje="Ingresar Comentario...!";
          _error = true;
      }
       

    return _error;
    }
 
}
