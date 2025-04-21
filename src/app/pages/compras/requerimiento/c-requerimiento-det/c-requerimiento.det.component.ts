
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { ConfirmationService,  MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ComprasService } from '../../Service/compraServices';
import { OrdencompraService } from '../../orden-compra-servicio/service/ordencompra.service';
import { OrdenCompraItem } from '@interfaces';
import { CModalPropuestaComponent } from '../modal-propuesta/c-modalpropuesta.component';
import { CItemCotizacionComponent } from '../c-item-cotizacion/c-item-cotizacion.component';
import { CModalComentarioComponent } from '../modal-comentario/c-modalcomentario.component';
import { CModalProveedorComponent } from '../modal-proveedor/c-modalproveedor.component';
import { CAdjuntosCotComponent } from '../c-adjuntos-cot/c-adjuntos-cot.component';

@Component({
  selector: 'app-c-requerimiento-det',
  templateUrl: './c-requerimiento-det.component.html',
  styleUrls: ['./c-requerimiento-det.component.scss']
})
export class RequerimientoDetComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  //visibleDocument: boolean = true;
  dataAdjunto: any;
  registerFormRegistro!: FormGroup;  
  idtipoproyecto: any;
  lstProyectos: any;
  annio: Date = new Date;
  //submitted = false;
  headerTitle: string = '';
  //montoTotal: number = 0;
  lstOrigen: any;
  idOrdenC: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  verbtnGrabar: boolean = false;
  verbtnPreliminar: boolean = false;
  verbtnOrden: boolean = false;
  verbtnAcciones: boolean = false;
  verItems: boolean = true;
  ordenCompra: any;
  
  visibleDocument: boolean = true;
  ExcelData: any;
  idtipoprod: any;
  lstTipoProducto:any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  errorMensaje: string = "";
  lstCentroCosto:any;
  lstMonedas: any;
  lstItemOC: OrdenCompraItem[] = [];
  lstPostores: any[] = [];
  selectedPro: any[] = [];
  lstUsuarios: any[] = [];  
  onlyReadLugar: boolean = true;
  lstClientes: any[] = []; 
  verPdfMail: boolean = false;

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private proyectosService: ProyectosService,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private ordencompraService: OrdencompraService,
    private comprasService: ComprasService,
  ) { }

  ngOnInit(): void {
    this.idOrdenC = this.IA_data.idordencompra;

    this.createFormRegistro();
    this.listaProyectoTipo();
    this.listarCentroCosto();
    this.listaMonedas();
    this.listaUsuarios();
    this.servicioGenerico();
    this.listaProveedores();
    
    if (this.idOrdenC > 0) {   
      if (this.IA_data.paramReg === 'V') {
        this.dataAdjunto ={
          idCliente: this.idOrdenC,
          codtipoproc: 2, //adjuntos compras
          veracciones: 1
        }
      }  else{
        this.dataAdjunto ={
          idCliente: this.idOrdenC,
          codtipoproc: 2,
          veracciones: 0
        }
      }  
      this.visibleDocument = true;      
      this.traerUno();
    }else{
      this.dataAdjunto ={
        idCliente: 0,
        codtipoproc: 2,
        veracciones: 0
      }     
      this.mostrarBotones('NVO');
      this.getOrigen('OPO');
    }       
  }

  

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: 2, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd:[{ value: '', disabled: false }],
      fechaingreso: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      idordencompra: [{ value: this.idOrdenC, disabled: true }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: 0, disabled: false }],
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
      tc:[{ value: 0, disabled: false }],
      tipodoc_ctb:[{ value: '', disabled: false }],
      nroserie_ctb:[{ value: '', disabled: false }],
      nrodocumento_ctb:[{ value: '', disabled: false }],
      fecvencimiento: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false, }],
      nrocuotas:[{ value: '', disabled: false }],
      porc_detraccion:[{ value: 0, disabled: false }],
      s_monto_detraccion_mn_CTB:[{ value: 0, disabled: false }],
      s_monto_detraccion_CTB:[{ value: 0, disabled: false }],
      s_monto_valor_venta_CTB:[{ value: 0, disabled: false }],
      s_monto_igv_CTB:[{ value: 0, disabled: false }],
      s_monto_total_CTB:[{ value: 0, disabled: false }],
      montoTotal:[{ value: 0, disabled: false }],
      nrocontrato_ctb:[{ value: null, disabled: false }],
      nroexpediente_ctb:[{ value: null, disabled: false }],
      codunidadejecutora_ctb:[{ value: null, disabled: false }],
      nroprocesoseleccion_ctb:[{ value: null, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      nrodias:[{ value: 0, disabled: false }],
      idordencompra_origen_ctb:[{ value: 0, disabled: false }],
      monto_pen_pago:[{ value: 0, disabled: false }],
      idcentrocosto:[{ value: 0, disabled: false }],
      s_monto_neto_CTB:[{ value: 0, disabled: false }],
      fecentrega: [{value: '' ,disabled: false,}],
      idusersolicita:[{ value: null, disabled: false }],
      terminosdepago:[{ value: '', disabled: false }],
      idpersona:[{ value: 0, disabled: false }],
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

  mostrarBotones(data:any){
    console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
    switch (data) {
      case 'REG':
        this.verbtnGrabar = true;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        this.onlyRead = false;
      break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.verbtnPreliminar= false;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        this.onlyRead = false;
      break;      
      case 'EMT':
        this.verbtnGrabar = true;
        this.verbtnPreliminar= true;
        this.verbtnOrden = true;
        this.verbtnAcciones = true;
        this.verItems = true;
        this.onlyRead = false;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= false;
        this.verbtnOrden = true;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = false;
      break;
      case 'ELI':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = false;
      break;
      case 'PAG':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        this.onlyRead = true;
      break;
    
      default:
        break;
    }

    if (this.IA_data.paramReg === 'V') {
      console.log('entro', this.IA_data.paramReg);
      this.verbtnGrabar = false;
      this.verbtnPreliminar= this.idOrdenC === 0 ? true : false;
      this.verbtnOrden = this.idOrdenC === 0 ? false : true;
      this.verbtnAcciones = false;
      this.verItems = false;
      this.onlyRead = true;
    }
    
  }

  traerUno(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto ={
      idordencompra: this.idOrdenC,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
            this.ordenCompra = rpta.ordencompra[0];     
            
            if (rpta.ordencompra[0].items !== undefined) {
              this.lstItemOC = rpta.ordencompra[0].items;
            } 

            if (rpta.ordencompra[0].postores !== undefined) {
              this.lstPostores = rpta.ordencompra[0].postores;
            }

          this.cargarProyectos(rpta.ordencompra[0].idtipoproyecto);  
          this.visibleDocument = false; 
          this.verPdfMail = true;

          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          //this.montoTotal = rpta.ordencompra[0].s_monto_total;
          this.mostrarBotones(rpta.ordencompra[0].estado);           
          this.setSpinner(false);
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
 
  guardarOC(){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }


    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
    let fecentrega;
    let fechaingreso;
    let fecemision;
    let fecvencimiento;
    fecentrega = this.registerFormRegistro.value.fecentrega;
    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecemision = this.registerFormRegistro.value.fecemision;
    fecvencimiento = this.registerFormRegistro.value.fecvencimiento;

    if (this.idOrdenC > 0) {
      if (fechaingreso.toString().length === 10) {
        fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso)); 
      }
      if (fecemision.toString().length === 10) {
        fecemision = new Date(this.serviceUtilitario.formatFecha(fecemision));    
      } 
      if (fecvencimiento.toString().length === 10) {
        fecvencimiento = new Date(this.serviceUtilitario.formatFecha(fecvencimiento));    
      }    
      if (fecentrega.toString().length === 10) {
        fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega));    
      }      
    }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      items: this.lstItemOC,
      fechaingreso,
      fecemision,
      fecentrega,
      fecvencimiento,
      tipodoc_ctb : (this.registerFormRegistro.value.tipodoc_ctb).toString(),
      cuotas: [],
      nrocuotas: 0,
      postores: this.lstPostores
    }

    console.log('guardarOC...', objeto);
    
    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          
          if (this.idOrdenC === 0) {
            this.idOrdenC = rpta.resultProceso;  
            this.registerFormRegistro.get('idordencompra')?.setValue(rpta.resultProceso);
            this.registerFormRegistro.get('codigonroorden')?.setValue(rpta.resultProceso);            
           
            this.dataAdjunto ={
              idCliente: this.idOrdenC,
              codtipoproc: 2,
              veracciones: 0
            }   
            this.visibleDocument = true;  
          }
          this.traerUno();
          
          
         
        //this.visibleDocument = false;
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

  listaProyectoTipo(){
    this.ordencompraService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
      this.lstOrigen = rpta;
      const objeto = {
        idtipoproyecto: 4,
        nomtipoproyecto: 'Otros',
        codproceso:'OTR'
      }
      this.lstOrigen.unshift(objeto);
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
   
  getOrigen(data:any){
    console.log('getOrigen...', data);
    this.registerFormRegistro.get('idcentrocosto')?.setValue('');
    switch (data) {
      case 'OPO':
        this.cargarProyectos(1);
        break;
      case 'REQ':
      case 'OTR':
        this.cargarProyectos(4);
        break;  
    }    

  }

  cargarProyectos(dato:any){
    this.ordencompraService.portipoProyectoList(dato).subscribe({
      next: (rpta: any) => {
      this.lstProyectos = rpta;
      console.log('cargarProyectos...',this.lstProyectos);
      this.changeProyecto(this.registerFormRegistro.value.idproyecto);
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
 
  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

    if (this.registerFormRegistro.value.idproyecto === '' || this.registerFormRegistro.value.idproyecto === null)
      {
          this.errorMensaje="Seleccionar Proyecto...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.servicionombre === null ||this.registerFormRegistro.value.servicionombre ==='' ))
    {
        this.errorMensaje="Ingresar Titulo...!";
        _error = true;
    }

    if (!_error && (this.registerFormRegistro.value.idmoneda === null ||this.registerFormRegistro.value.idmoneda ==='' ))
      {
          this.errorMensaje="Seleccionar Moneda...!";
          _error = true;
      }

    if (!_error && (this.registerFormRegistro.value.idusersolicita === null ||this.registerFormRegistro.value.idusersolicita ==='' ))
      {
          this.errorMensaje="Seleccionar Solicitante...!";
          _error = true;
      }

    if (!_error && this.registerFormRegistro.value.idmoneda === null)
      {
            this.errorMensaje="Seleccionar Moneda...!";
            _error = true;
      }   
      
      if (!_error && (this.registerFormRegistro.value.fecentrega === null ||this.registerFormRegistro.value.fecentrega ==='' ))
        {
            this.errorMensaje="Ingresar Fecha Entrega...!";
            _error = true;
        }

    return _error;
    }

  listarCentroCosto(){    
    this.setSpinner(true);
      this.mensajeSpinner = 'Cargando...!';

    const $getListarOrdenCompra = this.comprasService.listarCentroCosto()
      .subscribe({
        next: (rpta:any) => {
            this.lstCentroCosto = rpta;
            console.log('listarCentroCosto...', this.lstCentroCosto);
            this.setSpinner(false);
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {
            this.setSpinner(false);
        }
      });
    this.$listSubcription.push($getListarOrdenCompra)
  }

  listaMonedas() {
    const $listaMonedas = this.proyectosService.obtenerMonedas().subscribe({
      next: (rpta: any) => {
        console.log('listaMonedas', rpta);
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

  listaUsuarios() {
    const $listaUsuarios = this.proyectosService.listarUsuarios([]).subscribe({
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
        complete: () => {
        },
    });
    this.$listSubcription.push($listaUsuarios);
  }

  changeProyecto(value:any){
    let _codcentrocosto = this.lstProyectos.filter((x: { idproyecto: number; }) => x.idproyecto === value);
    this.registerFormRegistro.get('idcentrocosto')?.setValue(_codcentrocosto[0].idcentrocosto);
  }
  
  getItem(data: any,index: number) {
      data.nroindex = index;
      data.idordencompra = this.idOrdenC;
      data.origenreg = 'RC';
      console.log('CItemOrdenesComponent', data);
      const refItem = this.dialogService.open(CItemCotizacionComponent, {
        data: data,
        header: data.length == 0 ? "Agregar Detalle" : "Editar Detalle - " + data.idordencompraitem,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '30%'
      });
      refItem.onClose.subscribe((rpta: any) => {
        
        console.log('onClose',rpta);
        if (rpta != undefined) {
            const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == index))
            if (_posAll != -1) {
              this.lstItemOC.splice(_posAll, 1)
            }
            console.log('getItem',rpta.objeto);
          this.lstItemOC.push(rpta.objeto);
          console.log('this.lstItemOC',this.lstItemOC);
        }
      });
    }

    eliminarItem(data: any) {
      this.confirmationService.confirm({
        key: 'confirm1',
        header: 'Confirmación',
        message:  '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?' ,
        accept: () => {
          if (data.idcotizaitem > 0) {
            const _posAll: number = this.lstItemOC.findIndex((x => x.idordencompraitem == data.idordencompraitem))
            if (_posAll != -1) {
            this.lstItemOC.splice(_posAll, 1)
            }
        }else{
            const _posAll: number = this.lstItemOC.findIndex((x => x.idnvoitem == data.idnvoitem))
            if (_posAll != -1) {
            this.lstItemOC.splice(_posAll, 1)
            }
        }
        //this.recalcularRegistro(this.registerFormRegistro.get('porc_detraccion')?.value);
        }
    });
    }

    agregarCotizacion(data: any,index: number){
      data.nroindex = index;
      data.idordencompra = this.idOrdenC;
      data.idmoneda = this.registerFormRegistro.value.idmoneda;
      data.lista =  this.lstPostores;
      const refPostor = this.dialogService.open(CModalPropuestaComponent, {
        data: data,
        header: data.length == 0 ? "Agregar Cotización" : "Editar Cotización - " + data.nomcomercial,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '35%'
      });
      refPostor.onClose.subscribe((rpta: any) => {
        console.log('onClose index',index);
        if (rpta != undefined) {
            const _posAll: number = this.lstPostores.findIndex(((x: { nroindex: number; }) => x.nroindex == index))
            if (_posAll != -1) {
              this.lstPostores.splice(_posAll, 1)
            }
          this.lstPostores.push(rpta.objeto);
          console.log('this.lstPostores',this.lstPostores);
        }
      });
    }

    eliminarCotizacion(data: any) {
      this.confirmationService.confirm({
        key: 'confirm1',
        header: 'Confirmación',
        message:  '¿Desea Eliminar Item ' + '<b>' + data.nomcomercial + '</b>' + '?' ,
        accept: () => {
          if (data.iditempostor > 0) {
            const _posAll: number = this.lstPostores.findIndex((x => x.iditempostor == data.iditempostor))
            if (_posAll != -1) {
            this.lstPostores.splice(_posAll, 1)
            }
        }else{
            const _posAll: number = this.lstPostores.findIndex((x => x.idnvoitem == data.idnvoitem))
            if (_posAll != -1) {
            this.lstPostores.splice(_posAll, 1)
            }
        }
        //this.recalcularRegistro(this.registerFormRegistro.get('porc_detraccion')?.value);
        }
    });
    }

    anexos(dato: any, param: string) {
      console.log("anexos : ", dato);
      const refMensaje = this.dialogService.open(CAdjuntosCotComponent, {
          data: { idoportunidad: 0 , 
            codtipoproc: 2, 
            idnroproceso: 0, 
            parametro: param, 
            idCliente: dato.iditempostor, 
            proveedor: dato.razonsocial, 
            nroreq: dato.iddocumentoprc
          },
          header: 'Cotización',
          styleClass: 'testDialog',
          closeOnEscape: false,
          closable: false,
          width: '50%'
      });
      refMensaje.onClose.subscribe((rpta: any) => {
        if (rpta.objeto.param === 'G') {
         for (let i = 0; i < this.lstPostores.length; i++) {
          if (this.lstPostores[i].iditempostor === rpta.objeto.iditempostor) {
            this.lstPostores[i].monto = rpta.objeto.monto;
            this.lstPostores[i].idmoneda = rpta.objeto.idmoneda;
            this.lstPostores[i].simbmoneda = rpta.objeto.simbmoneda;
            this.lstPostores[i].comentario = rpta.objeto.comentario;
            this.lstPostores[i].estado = rpta.objeto.estado;
          }          
         }      
         this.guardarOC();    
        }else{
          for (let i = 0; i < this.lstPostores.length; i++) {
            if (this.lstPostores[i].iditempostor === rpta.objeto.iditempostor) {
              this.lstPostores[i].estado = rpta.objeto.estado;
            }          
           } 
           this.guardarOC(); 
        }
        });
  }

  checkEvent(dato: any){
    console.log('checkEvent', dato);
  

        this.lstPostores.forEach(item => {
        if (item.iditempostor === dato.iditempostor) {
          item.indseleccion = dato.indseleccion;
      }else{
        item.indseleccion = false;
      }
      });
   
  }

  mensajeCoti(data:any){
    const refMensaje = this.dialogService.open(CModalComentarioComponent, {
      data: data,
      header: 'Cotización Ganadora ' +  data.nomcomercial,
      styleClass: 'testDialog',
      closeOnEscape: false,
      closable: true,
      width: '40%'
  });
  refMensaje.onClose.subscribe((rpta: any) => {
    console.log('onClose mensajeCoti',rpta);
    if (rpta != undefined) {
      console.log('objeto objeto',rpta.objeto);
      this.traerUno();
    }
  });
  
  }

  EnviarMail(data:any){
    this.setSpinner(true);
    this.mensajeSpinner = 'Enviando Correo...!';
    
    const obj = {
      emailDestino: data.email1,
    }
    
    this.proyectosService.enviarEmailRequerimiento(obj).subscribe({
      next: (rpta: any) => {      
        this.setSpinner(false);     
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
        this.setSpinner(false);
      },
  });
  }

  agregarProveedor(data: any,index: number){
    data.nroindex = index;
    data.idordencompra = this.idOrdenC;
    data.idmoneda = this.registerFormRegistro.value.idmoneda;
    data.lista =  this.lstPostores;
    const refMensaje = this.dialogService.open(CModalProveedorComponent, {
      data: data,
      header: data.length == 0 ? "Agregar Proveedor" : "Editar Proveedor - " + data.nomcomercial, //'Selección de Cotización de ' +  data.nomcomercial,
      styleClass: 'testDialog',
      closeOnEscape: false,
      closable: true,
      width: '30%'
  });
  refMensaje.onClose.subscribe((rpta: any) => {
    console.log('onClose index',index);
    if (rpta != undefined) {
        const _posAll: number = this.lstPostores.findIndex(((x: { nroindex: number; }) => x.nroindex == index))
        if (_posAll != -1) {
          this.lstPostores.splice(_posAll, 1)
        }
      this.lstPostores.push(rpta.objeto);
      console.log('this.lstPostores',this.lstPostores);
    }
  });

  // refMensaje.onClose.subscribe((rpta: any) => {
  //   console.log('onClose mensajeCoti',rpta);
  //   if (rpta != undefined) {
  //     //this.traerUno();
  //   }
  // });
  }

  vistaPreliminar(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando...!';

    const objeto = {
      idusuario : constantesLocalStorage.idusuario,
      iddocumentoprc: this.idOrdenC,
      codtipoprc: 2
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumentoDet(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);      

        console.log('vistaPreliminar', rpta);
        
        const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = 'COTI_' + this.idOrdenC;  
  
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

  onVerDetalle(data: any) {
    console.log('onVerDetalle...', data);
        
        this.setSpinner(true);
      this.mensajeSpinner = 'Descargando Detalle...!';
  
      const objeto = {
        idusuario : constantesLocalStorage.idusuario,
        iddocumentoprc: this.idOrdenC,
        codtipoprc: 2,
        idplantilla: 0,
        idpersona: data.idpersona
      }
  
      const $cargarOrdenC = this.ordencompraService.prcDocumentoDet2(objeto).subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);      
          
          const mediaType = 'application/pdf';
            const blob = new Blob([rpta.body], { type: mediaType });
            const filename = 'COTI_' + this.idOrdenC;
    
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

servicioGenerico(){
  
  this.comprasService.obtenerItemsTabla(109).subscribe({
    next: (rpta: any) => {
      console.info('servicioGenerico : ', rpta);

      let _terminosdepago = rpta.filter((x: { iditem: number; }) => x.iditem === 135);
      this.registerFormRegistro.get('terminosdepago')?.setValue(_terminosdepago[0].valoritem);
    },
    error: (err) => {
    console.info('error : ', err);
    this.serviceSharedApp.messageToast()
    },
    complete: () => {
    },
});
}

listaProveedores() {
  const $getClientes = this.proyectosService.obtenerClientes('CLI').subscribe({
    next: (rpta: any) => {
      this.lstClientes = rpta;
      console.log('this.lstClientes...' , this.lstClientes );
    },
    error: (err) => {
      this.serviceSharedApp.messageToast()
    },
    complete: () => { },
  });
  this.$listSubcription.push($getClientes);
}
getDireccion(data:any){

  const direccion = this.lstClientes.filter(x =>x.idcliente === data)[0].direcresumen;
  this.registerFormRegistro.get('lugarentrega')?.setValue(direccion);
}

async download(data: any) {
  console.log('download...', data);
 
      this.confirmationService.confirm({
          key: 'confirm1',
          header: 'Confirmación',
          message: '¿Estás seguro de Descargar el Adjunto?...',
          accept: () => {
              const objeto = {
                idoportunidad: data.idnroproceso,
                urlasset: data.nomasset
                }
                const $downloadArchivo = this.comprasService.downloadArchivo(objeto)
                .subscribe({
                    next: (rpta: any) => {
                    console.log("download archivo : ", rpta);
            
                    const mediaType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                    const blob = new Blob([rpta.body], { type: mediaType });
                    const filename = data.nomasset;
            
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.target = '_blank';
                    a.click();
            
                    setTimeout(() => {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 100);
                    },
                    error: (err) => {
                    //this.setSpinner(false);
                    this.serviceSharedApp.messageToast();
                    },
                    complete: () => { }
                });
                this.$listSubcription.push($downloadArchivo)
              }
          });
      
}

}
