import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { CModalPersonaComponent } from 'src/app/pages/compras/registro-compra/modalPersona/c-modalpersona.component';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
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
  registerFormRegistro!: FormGroup;
  lstProveedores: any[]=[];
  lstMonedas: any[]=[];
  errorMensaje: string = "";
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  minimaFechaDesde!: Date;
  maximaFechaDesde: Date = this.serviceUtilitario.obtenerFechaFinMesTotal();
  minimaFechaHasta!: Date;
  maximaFechaHasta: Date = this.serviceUtilitario.obtenerFechaFinMesTotal();
  lstTermino:any
  
  lstComprobante:any[]=[];

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private serviceUtilitario: UtilitariosService,
        private ordencompraService: OrdencompraService,
            private comprasService: ComprasService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param Postores...', this.param);
    this.createFormRegistro();
    this.listaMonedas();    
    this.listaProveedores();
    this.listarItemsTabla(); 
    this.listarItemsTablaComprobante() ;

    if (this.param.idordencompra > 0) {
        this.traerUno();
    }
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }


  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: 7, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd:[{ value: '', disabled: false }],
      fechaingreso: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      idordencompra: [{ value: 0, disabled: true }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: '', disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      idcontacto: [{ value: 0, disabled: false }],
      codtipodoc: [{ value: 'OPO', disabled: false }],
      tiempoentrega: [{ value: 0, disabled: false }],
      codformapago: [{ value: 118, disabled: false }],
      validezoferta: [{ value: 0, disabled: false }],
      lugarentrega: [{ value: '', disabled: false }],
      garantia: [{ value: 0, disabled: false }],
      servicionombre: [{ value: '', disabled: false }],
      ref01: [{ value: '', disabled: false }],
      ref02: [{ value: '', disabled: false }],
      ref03: [{ value: '', disabled: false }],
      codtipoorden:[{ value: 'OC', disabled: false }],
      codigonroorden:[{ value: '', disabled: true }],
      nomproyecto:[{ value: '', disabled: false }],
      nrodocumento:[{ value: '', disabled: false }],
      fecemision: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      tc:[{ value: '', disabled: false }],
      tipodoc_ctb:[{ value: '', disabled: false }],
      nroserie_ctb:[{ value: '', disabled: false }],
      nrodocumento_ctb:[{ value: '', disabled: false }],
      fecvencimiento: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      nrocuotas:[{ value: 0, disabled: false }],
      porc_detraccion:[{ value: 0, disabled: false }],
      s_monto_detraccion_mn_CTB:[{ value: 0, disabled: false }],
      s_monto_detraccion_CTB:[{ value: 0, disabled: false }],
      s_monto_valor_venta_CTB:[{ value: 0, disabled: false }],
      s_monto_igv_CTB:[{ value: 0, disabled: false }],
      monto:[{ value: 0, disabled: false }],
      montoTotal:[{ value: 0, disabled: false }],
      nrocontrato_ctb:[{ value: '', disabled: false }],
      nroexpediente_ctb:[{ value: '', disabled: false }],
      codunidadejecutora_ctb:[{ value: null, disabled: false }],
      nroprocesoseleccion_ctb:[{ value: null, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      nrodias:[{ value: 0, disabled: false }],
      idordencompra_origen_ctb:[{ value: 0, disabled: false }],
      monto_pen_pago:[{ value: 0, disabled: false }],
      idcentrocosto:[{ value: 0, disabled: false }],
      s_monto_neto_CTB:[{ value: 0, disabled: false }],
      direccion:[{ value: null, disabled: false }],
      simbmoneda:[{ value: null, disabled: false }],
      razonsocial:[{ value: null, disabled: false }],
      destipodoc:[{ value: null, disabled: false }],
      estado:[{ value: 'PEN', disabled: false }],
    });

    
  }

  traerUno(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto ={
      idordencompra: this.param.idordencompra,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);    
          this.registerFormRegistro.patchValue(rpta.ordencompra[0]); 
          this.registerFormRegistro.get('tipodoc_ctb')?.setValue(parseInt(rpta.ordencompra[0].tipodoc_ctb));
          this.getBusquedaRUC();
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

  guardar() {       
    console.log('guardar...', this.registerFormRegistro.getRawValue());
    if (this.validarDatos())
    {
        this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
        return;
    }

    // const simbmoneda = this.lstMonedas.filter(x=>x.idmoneda == this.registerFormRegistro.get('idmoneda')?.value)[0].simbmoneda;
    // this.registerFormRegistro.get('simbmoneda')?.setValue(simbmoneda);

    // const razonsocial = this.lstProveedores.filter(x=>x.idproveedor == this.registerFormRegistro.get('idproveedor')?.value)[0].razonsocial;
    // this.registerFormRegistro.get('razonsocial')?.setValue(razonsocial);

    // const destipodoc = this.lstComprobante.filter(x=>x.iditem == this.registerFormRegistro.get('tipodoc_ctb')?.value)[0].valoritem;
    // this.registerFormRegistro.get('destipodoc')?.setValue(destipodoc);

    let fechaingreso;
    let fecemision;
    let fecvencimiento;
    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecemision = this.registerFormRegistro.value.fecemision;
    fecvencimiento = this.registerFormRegistro.value.fecvencimiento;
  
    if (this.param.idordencompra > 0) {
      if (fechaingreso.toString().length === 10) {
        fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso)); 
      }
      if (fecemision.toString().length === 10) {
        fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));    
      } 
      if (fecvencimiento.toString().length === 10) {
        fecvencimiento = new Date(this.serviceUtilitario.formatFecha(fecvencimiento));    
      }         
    }
  
    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      items: [],
      fechaingreso,
      fecemision,
      fecvencimiento,
      tipodoc_ctb : (this.registerFormRegistro.value.tipodoc_ctb).toString(),
      cuotas: []
    }

    this.cerrar({...objeto})      
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
    console.log('this.formValue...', this.registerFormRegistro.value);
   
    if (!_error && (this.registerFormRegistro.value.nrodocumento === null ||this.registerFormRegistro.value.nrodocumento ==='' ))
    {
        this.errorMensaje="Ingresar RUC...!";
        _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.idproveedor === null || this.registerFormRegistro.value.idproveedor === ''))
    {
        this.errorMensaje="Buscar Proveedor por RUC...!";
        _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.tipodoc_ctb === '' || this.registerFormRegistro.value.tipodoc_ctb === null))
    {
        this.errorMensaje="Seleccionar Tipo de Documento...!";
        _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.nroserie_ctb === '' || this.registerFormRegistro.value.nroserie_ctb === null))
    {
        this.errorMensaje="Ingresar Serie de Documento...!";
        _error = true;
    }
  
    if (!_error && (this.registerFormRegistro.value.nrodocumento_ctb === '' || this.registerFormRegistro.value.nrodocumento_ctb === null))
    {
        this.errorMensaje="Ingresar Número de Documento...!";
        _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.monto === '' || this.registerFormRegistro.value.monto === null || this.registerFormRegistro.value.monto === 0))
    {
        this.errorMensaje="Ingresar Monto...!";
        _error = true;
    }  

    if (!_error && this.registerFormRegistro.value.idmoneda === null)
    {
          this.errorMensaje="Seleccionar Moneda...!";
          _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.tc === null || this.registerFormRegistro.value.tc === ''|| this.registerFormRegistro.value.tc === 0))
    {
          this.errorMensaje="Ingresar Tipo Cambio...!";
          _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.codformapago === '' || this.registerFormRegistro.value.codformapago === null))
    {
        this.errorMensaje="Ingresar Forma de Pago...!";
        _error = true;
    }


   

      
    

    return _error;
  }

  getBusquedaRUC(){
    const _nro =  this.registerFormRegistro.get('nrodocumento')?.value;
    console.log('getBusquedaRUC...', _nro); 

    if(_nro === null || _nro === ''){
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail:'Ingresar Ruc...' });
      return;
    }
    console.log('length...', _nro.length); 
    if(_nro.length < 11){
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail:'Ruc no Valido...' });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = 'Buscando...!';

    const objet = {
      nrodocumento: _nro
    }

    this.ordencompraService.buscarporRUC(objet).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.log('rpta...', rpta); 
        if(rpta.length === 0){
          this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail:'Proveedor no encontrado...' });
          return;
        }
        this.registerFormRegistro.get('idproveedor')?.setValue(rpta[0].idcliente);
        this.registerFormRegistro.get('direccion')?.setValue(rpta[0].direcresumen);
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

    NuevoPersona(){
      const objet = {
        idrolpersona:'CLI'
            }
      const refItem = this.dialogService.open(CModalPersonaComponent, {
        data: objet,
        header: "Agregar Proveedor",
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '40%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        
        console.log('onClose',rpta);
        if (rpta != undefined) {
          this.listaProveedores();
          this.registerFormRegistro.get('nrodocumento')?.setValue(parseInt(rpta.objeto.nrodocumento));
          this.registerFormRegistro.get('idproveedor')?.setValue(parseInt(rpta.objeto.idpersona));      
          this.registerFormRegistro.get('direccion')?.setValue(parseInt(rpta.objeto.direcresumen));         
        }
      });
    }

    listaProveedores() {

      const $getClientes = this.proyectosService.obtenerClientes('PRO').subscribe({
        next: (rpta: any) => {
          this.lstProveedores = rpta;
          console.log('this.lstProveedores', this.lstProveedores);
        },
        error: (err) => {
          this.serviceSharedApp.messageToast()
        },
        complete: () => { },
      });
      this.$listSubcription.push($getClientes);
  
    }

    changeMoneda(value:any){
      console.log('changeProyecto...', value);
      if (value === 1) {
        this.registerFormRegistro.get('tc')?.disable()
      }else{
        this.registerFormRegistro.get('tc')?.enable();
      }
      
    }

    
  changeFechaDesde(event: Date) {
    console.log('this.registerFormRegistro.value.fecvencimiento', new Date(this.registerFormRegistro.value.fecvencimiento));
    console.log('this.registerFormRegistro.value.fecemision', this.registerFormRegistro.value.fecemision);

    this.minimaFechaHasta = event;
    let emision = new Date(this.registerFormRegistro.get('fecemision')?.value);
    let vencimiento = new Date(this.registerFormRegistro.get('fecvencimiento')?.value);
    console.log('emision', emision);
    console.log('vencimiento', vencimiento);
    let inicio = emision.getTime();
    let fin = vencimiento.getTime();
    // console.log('inicio', inicio);
    // console.log('fin', fin);
    var diff = fin - inicio;
    console.log('nro dias', diff/(1000*60*60*24));
    console.log('changeFechaDesde diff', diff);
    let numerDiff = diff/(1000*60*60*24);
    this.registerFormRegistro.get('nrodias')?.setValue( Math.round(numerDiff));
  }

  changeFechaHasta(event: Date) {
    // console.log('this.registerFormRegistro.value.fecvencimiento', this.registerFormRegistro.value.fecvencimiento.getTime());
    // console.log('this.registerFormRegistro.value.fecemision', this.registerFormRegistro.value.fecemision.getTime());
    this.maximaFechaDesde = event;
    let emision = new Date(this.registerFormRegistro.get('fecemision')?.value);
    let vencimiento = new Date(this.registerFormRegistro.get('fecvencimiento')?.value);
    console.log('emision', emision, 'vencimiento', vencimiento);
    let inicio = emision.getTime();
    let fin = vencimiento.getTime();
    // console.log('inicio', inicio);
    // console.log('fin', fin);
    var diff = fin - inicio;
    console.log('nro dias', diff/(1000*60*60*24));
    console.log('changeFechaDesde diff', diff);
    let numerDiff = diff/(1000*60*60*24);
    this.registerFormRegistro.get('nrodias')?.setValue( Math.round(numerDiff));
  }

  addDays(date: Date, days: number): Date {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }


  addDiasFec(){
    let fecha = this.addDays(this.registerFormRegistro.value.fecemision, parseInt(this.registerFormRegistro.value.nrodias));
    this.registerFormRegistro.get('fecvencimiento')?.setValue( fecha );
  }



  listarItemsTablaComprobante() {
    this.comprasService.obtenerItemsTabla(112).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTablaComprobante : ', rpta);
            this.lstComprobante = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });    
  }

  listarItemsTabla() {
    this.comprasService.obtenerItemsTabla(114).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstTermino = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }
}
