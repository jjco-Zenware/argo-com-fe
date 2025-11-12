
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { OrdencompraService } from 'src/app/pages/compras/orden-compra-servicio/service/ordencompra.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { AlmacenService } from '../../service/almacenServices';
import { CItemOrdenesComponent } from '../../items-ordenes/c-items-ordenes.component';
import { CModalExcAlmacenComponent } from 'src/app/pages/compras/orden-compra-servicio/modal-exc-almacen/modal-exc-almacen.component';
import { CItemCotizacionComponent } from 'src/app/pages/compras/proyectos-ganados/c-item-cotizacion/c-item-cotizacion.component';
import { CModalUbicacionComponent } from '../../modal-ubicacion/modal-ubicacion.component';

@Component({
  selector: 'app-c-detallemovtras',
  templateUrl: './c-detallemovtras.component.html',
  styleUrls: ['./c-detallemovtras.component.scss']
})
export class CDetalleMovTrasladoComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  visibleDocument: boolean = true;
  dataAdjunto: any;
  registerFormRegistro: any= FormGroup;
  lstProyectos: any;
  lstCliente: Cliente []=[];
  lstProveedores: Cliente[] = [];
  submitted = false;
  headerTitle: string = '';
  registerFormCliente: any = FormGroup;
  lstMonedas: Moneda[] = [];
  lstItemOC: any[] = [];
  montoTotal: number = 0;
  lstOrdenC: any;
  lstOrigen: any;
  idMovimiento: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  verbtnGrabar: boolean = false;
  verbtnAcciones: boolean = false;
  verItems: boolean = true;
  ordenCompra: any;
  verCotizacion: boolean = true;
  lstTipo = [
    { name: 'COMPRA', code: 'OC' },
    { name: 'SERVICIO', code: 'OS' }
  ];
  lstTermino: any;
  lstQuotes: any[]=[];
  verAdjunto: boolean = false;
  ExcelData: any;
  verImportar: boolean = true;
  onlyRead: boolean = false;
  verReferencia: boolean = false;
  errorMensaje: string = "";
  s_monto:number = 0;
  s_igv:number = 0;
  s_monto_total:number = 0;
  activeIndex: number = 0;
  lstAlmacen: any;
  selectedItems: any;
  lstTransacciones: any[]=[];
  listadoArchivos: any[]=[];

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
    private almacenService: AlmacenService, 
  ) { }

  ngOnInit(): void {
    this.idMovimiento = this.IA_data.idcodigo;
    console.log('idMovimiento...', this.idMovimiento);

    this.createFrm();
    this.createFormRegistro();
    this.ListarAlamcen();  
    this.listaClientes();
    this.listaProveedores();
    this.listarItemsTabla(); 
    //this.getOcproveedor(0);     
    
    if (this.idMovimiento > 0) {   
      // if (this.IA_data.paramReg === 'V') {
      //   this.dataAdjunto ={
      //     idCliente: this.idMovimiento,
      //     codtipoproc: 7,
      //     veracciones: 1
      //   }
      // }  else{
      //   this.dataAdjunto ={
      //     idCliente: this.idMovimiento,
      //     codtipoproc: 7,
      //     veracciones: 0
      //   }
      // }     
      this.traerUnoOrdenC();
      this.listarTransacciones();
    }
    else{
      this.dataAdjunto ={
        idCliente: 0,
        codtipoproc: 7,
        veracciones: 0
      }     
      this.mostrarBotones('NVO');
      this.servicioGenerico();
    }   
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      idtipodocprc: [{ value: this.IA_data.idtipodocprc, disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd:[{ value: '', disabled: false }],
      fechaingreso: [{value: this.serviceUtilitario.obtenerFechaFormateadoDMA(),disabled: false,}],
      idordencompra: [{ value: this.idMovimiento, disabled: true }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 1, disabled: false }],
      labelnrodocumento: [{ value: '', disabled: true }],
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
      fecentrega: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false,}],
      terminosdepago:[{ value: '', disabled: false }],
      idalmacen:[{ value: 0, disabled: false }],
      alm_idordencompra:[{ value: 0, disabled: false }],
      idprod: [{ value: 0, disabled: false }],      
      alm_idalmacen_destino: [{ value: 0, disabled: false }]
    });
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatosCab = this.fb.group({
      idcotiza: [{ value: 0, disabled: true }],
      fechaingreso: [{ value: '', disabled: true }],
      observacion: [{ value: '', disabled: false }],
    })
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  mostrarBotones(data:any){
    console.log('mostrarBotones', this.IA_data.paramReg, '..data...', data);
    switch (data) {
      case 'PEN':
      case 'OBS':
        this.verbtnGrabar = true;
        this.verbtnAcciones = true;
        this.onlyRead = false;
      break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.verbtnAcciones = false;
        this.onlyRead = false;
      break;
      case 'PRC':
        this.verbtnGrabar = false;
        this.verbtnAcciones = true;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'EMI':
        this.verbtnGrabar = false;
        this.verbtnAcciones = true;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'ELI':
        this.verbtnGrabar = false;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'REC':
        this.verbtnGrabar = false;
        this.verbtnAcciones = true;
        this.onlyRead = true;
      break;
    
      default:
        break;
    }

    if (this.IA_data.paramReg === 'V') {
      console.log('entro', this.IA_data.paramReg);
      this.verbtnGrabar = false;
      this.verbtnAcciones = false;
      this.verItems = false;
      this.onlyRead = true;
    }
    
  }

  traerUnoOrdenC(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto ={
      idordencompra: this.idMovimiento,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.proyectosService.ordenCompraTraeruno(objeto)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.ordencompra[0]', rpta.ordencompra[0]);
            this.setSpinner(false);
            this.ordenCompra = rpta.ordencompra[0]; 
            
            if (rpta.ordencompra[0].items !== undefined) {
              this.lstItemOC = rpta.ordencompra[0].items;
            }  
            if (rpta.ordencompra[0].quotes !== undefined) {
              this.lstQuotes =  rpta.ordencompra[0].quotes; 
            }         
          this.visibleDocument = false;

          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          this.cargarMenu(rpta.ordencompra[0].acciones);
          this.mostrarBotones(rpta.ordencompra[0].estado);   
          this.getOcproveedor(rpta.ordencompra[0].idproveedor);   
          
          
            this.dataAdjunto ={
              idCliente: rpta.ordencompra[0].alm_idordencompra,
              codtipoproc: 7,
              veracciones: 0
            }            
            this.verAdjunto = true;  
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

  listarTransacciones() {
    const $lstTransacciones = this.proyectosService.listarTrasacciones(this.idMovimiento).subscribe({
      next: (rpta: any) => {
        console.log('lstTransacciones', rpta);
        this.lstTransacciones = rpta;       
      },
      error: (err) => {
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($lstTransacciones);

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
    let fechaingreso;
    let fecentrega;
    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecentrega = this.registerFormRegistro.value.fecentrega;

    if (fechaingreso.toString().length === 10) {
      fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso)); 
    }
    if (fecentrega.toString().length === 10) {
      fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega)); 
    } 

    for (let i = 0; i < this.lstItemOC.length; i++) {      
      if (this.lstItemOC[i].cantidad.toString() === '') {
        this.lstItemOC[i].cantidad = 0;
      }    
      if (this.lstItemOC[i].preciocosto.toString() === '') {
        this.lstItemOC[i].preciocosto = 0;
      }
    }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      items: this.lstItemOC,
      fechaingreso,
      fecentrega,
      quotes: this.lstQuotes
    }

    console.log('guardarOC...', objeto);
    
    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idMovimiento === 0) {
            this.idMovimiento = rpta.resultProceso;  
            this.registerFormRegistro.get('idordencompra').setValue(rpta.resultProceso);
            this.registerFormRegistro.get('codigonroorden').setValue(rpta.resultProceso);  

            this.dataAdjunto ={
              idCliente: this.idMovimiento,
              codtipoproc: 7,
              veracciones: 0
            }   
            this.verAdjunto = true; 

            //preguntar si desea agregar adjuntos
            this.confirmationService.confirm({
              key: 'confirm1',
              header: 'Confirmación',
              message:  '¿Desea Agregar Adjuntos ',
              accept: () => {
                this.activeIndex = 2;
              }
          });
          }
          this.traerUnoOrdenC();
         
        this.visibleDocument = false;
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
  servicioGenerico(){    
    this.comprasService.obtenerItemsTabla(109).subscribe({
      next: (rpta: any) => {
        console.info('servicioGenerico : ', rpta);
        let _terminosdepago = rpta.filter((x: { iditem: number; }) => x.iditem === 135);
        this.registerFormRegistro.get('terminosdepago').setValue(_terminosdepago[0].valoritem);
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
    this.comprasService.obtenerItemsTabla(104).subscribe({
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

  listaClientes() {
    let tiporol ="CLI";
    this.proyectosService.obtenerClientes(tiporol).subscribe({
        next: (rpta: any) => {
        this.lstCliente = rpta;
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

  // eliminarItem(data: any) {
  //   console.log('eliminarItem',data);
  //   this.confirmationService.confirm({
  //     key: 'confirm1',
  //     header: 'Confirmación',
  //     message:  '¿Desea Eliminar Item ' + '<b>' + data.descripcion + '</b>' + '?' ,
  //     accept: () => {
  //       if (data.idordencompra > 0) {
  //         const _posAll: number = this.lstItemOC.findIndex((x => x.idordencompraitem == data.idordencompraitem))
  //         if (_posAll != -1) {
  //         this.lstItemOC.splice(_posAll, 1)
  //         }
  //     }else{
  //         const _posAll: number = this.lstItemOC.findIndex((x => x.idnvoitem == data.idnvoitem))
  //         if (_posAll != -1) {
  //         this.lstItemOC.splice(_posAll, 1)
  //         }
  //     }
  //     //this.calcularTotales();
  //     }
  // });
  // }

  getOcproveedor(dato: any) {  
    const objeto = {
      idusuario: constantesLocalStorage.idusuario,
      idtipodocprc: 12,
      idpersona: dato,
      estado:"EMI"
    }
    this.lstOrdenC = []
    const $personaProveedorlist = this.ordencompraService.documentoPrcTipoDocPrcLista(objeto).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('next : ', rpta);
            this.lstOrdenC = rpta;
            this.registerFormRegistro.get('alm_idordencompra')?.setValue(this.ordenCompra.alm_idordencompra); 
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

  cargarMenu(data: any) {
    this.menuItems = [];
    data.forEach((item: any) => {
        this.menuItems.push({
            label: item.nomtrx,
            icon: 'pi pi-cog',
            command: () => this.onAccion(item)
        })
    });
  }
  onAccion(item: any) {
    this.getListaArchivos(item);
      console.log('onAccion', item);
  // this.ordenCompra.idtrx = item.idtrx;
  // console.log('onAccion', item);
  // const ref = this.dialogService.open(CModalExcAlmacenComponent, {
  //     data: this.ordenCompra,
  //     header: item.nomtrx,
  //     closeOnEscape: false,
  //     styleClass: 'testDialog',
  //     width: '40%'
  // });

  // ref.onClose.subscribe(() => {
  //     this.getListar();
  //   });
  }

  getListaArchivos(valor:any) {
  
    const objeto = {
      idoportunidad: 0,
      codtipoproc: 7 , 
      idnroproceso: this.ordenCompra.alm_idordencompra, 
    }
    console.log('this.objeto ...', objeto );
  
  const $listarArchivos = this.comprasService.ListarAdjuntoProc(objeto)
    .subscribe({
      next: (rpta: any) => {
        this.listadoArchivos = rpta;
        console.log('this.listadoArchivos ...', this.listadoArchivos );

        const total = this.lstItemOC.filter((item: any) => item.indcompleto === true).length;
        if (total === 0) {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items sin Seleccionar...!' });
            return;
        }

        for (let i = 0; i < this.lstItemOC.length; i++) {
          if (this.lstItemOC[i].indcompleto === true && this.lstItemOC[i].idubicacion === 0) {
            this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items Confirmados sin Ubicación...!' });
            return;
          }

          if (this.lstItemOC[i].codtipoexistencia === 0) {
            this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items Confirmados sin Tipo de Existencia...!' });
            return;
          }

          if (this.lstItemOC[i].indcompleto === true &&((this.lstItemOC[i].servicetag === '' ||this.lstItemOC[i].servicetag === null )
            && (this.lstItemOC[i].serialnumber === ''|| this.lstItemOC[i].serialnumber === null))) {
            this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Existen Items Confirmados sin Service Tag o Serial Number...!' });
            return;
          }
      }

        if (this.listadoArchivos.length === 0) {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: 'Debe Ingresar Guia de Remisión...!' });
              return;
        }else{
          this.guardarOC2(valor);
        }
      },
      error: (err) => {
        this.serviceSharedApp.messageToast();
      },
      complete: () => { }
    });
  this.$listSubcription.push($listarArchivos)
  }

  guardarOC2(item:any){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Procesando...!';
    let fechaingreso;
    let fecentrega;
    fechaingreso = this.registerFormRegistro.value.fechaingreso;
    fecentrega = this.registerFormRegistro.value.fecentrega;

    if (this.idMovimiento > 0) {
      fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso));   
      fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega));    
    }

    for (let i = 0; i < this.lstItemOC.length; i++) {      
      if (this.lstItemOC[i].cantidad.toString() === '') {
        this.lstItemOC[i].cantidad = 0;
      }    
      if (this.lstItemOC[i].preciocosto.toString() === '') {
        this.lstItemOC[i].preciocosto = 0;
      }
    }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      items: this.lstItemOC,
      fechaingreso,
      fecentrega,
      quotes: this.lstQuotes
    }

    console.log('guardarOC...', objeto);
    
    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          //this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          this.ordenCompra.idtrx = item.idtrx;
          const ref = this.dialogService.open(CModalExcAlmacenComponent, {
              data: this.ordenCompra,
              header: item.nomtrx,
              closeOnEscape: false,
              styleClass: 'testDialog',
              width: '40%'
          });
          ref.onClose.subscribe(() => {
              this.traerUnoOrdenC();
              this.listarTransacciones();
            });
         
        this.visibleDocument = false;
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
  
  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

      if (this.registerFormRegistro.value.idalmacen === null || this.registerFormRegistro.value.idalmacen === 0)
      {
          this.errorMensaje="Seleccionar Almacen Ingreso...!";
          _error = true;
      }

      // if (!_error && (this.registerFormRegistro.value.sustentodoc === null || this.registerFormRegistro.value.sustentodoc === ''))
      //   {
      //       this.errorMensaje="Ingresar Guia...!";
      //       _error = true;
      //   }

      // if (!_error && (this.registerFormRegistro.value.alm_idordencompra === null || this.registerFormRegistro.value.alm_idordencompra === ''))
      // {
      //     this.errorMensaje="Seleccionar Documento...!";
      //     _error = true;
      // }

      // if (!_error && (this.registerFormRegistro.value.alm_idordencompra === 0 || this.registerFormRegistro.value.alm_idordencompra === null))
      // {
      //     this.errorMensaje="Seleccionar Orden Compra...!";
      //     _error = true;
      // }

      // if (!_error && (this.registerFormRegistro.value.codtipodoc === 'REQ' && this.registerFormRegistro.value.sustentodoc === '') )
      // {
      //     this.errorMensaje="Ingresar N° de Referencia...!";
      //     _error = true;
      // }

      // if (!_error && this.registerFormRegistro.value.idmoneda === null)
      // {
      //       this.errorMensaje="Seleccionar Moneda...!";
      //       _error = true;
      // }

      // if (!_error && this.registerFormRegistro.value.codformapago === null)
      // {
      //       this.errorMensaje="Seleccionar Termino de Pago...!";
      //       _error = true;
      // }

      // if (!_error && (this.registerFormRegistro.value.condicionescomerciales === " " || this.registerFormRegistro.value.condicionescomerciales === null))
      // {
      //     this.errorMensaje="Ingresar Condiciones Comerciales...!";
      //     _error = true;
      // }
       return _error;
     }
     
     ListarAlamcen(){
      const objeto = {
        idalmacen:0,
        idofi: 0
      }
      const $getListar = this.almacenService.ListarAlamcen(objeto)
        .subscribe({
          next: (rpta:any) => {
              console.log('rpta lstAlmacen', rpta);
              this.lstAlmacen = rpta
          },
          error:(err)=>{
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
          }
        });
      this.$listSubcription.push($getListar)
    }

    getOCtraerItems(dato: any) {  
      console.info('dato : ', dato);
      //this._alm_idordencompra = dato;
      this.lstItemOC = []
      this.selectedItems=[];
      const objeto ={
        idordencompra: dato,
        idusuario: constantesLocalStorage.idusuario
      }
      const $personaProveedorlist = this.proyectosService.ordenCompraTraeruno(objeto).subscribe({
          next: (rpta: any) => {
              this.setSpinner(false);
              console.info('getOCtraerItems : ', rpta);                

              if (rpta.ordencompra[0].items !== undefined) {
                this.registerFormRegistro.get('alm_idalmacen_destino').setValue(rpta.ordencompra[0].idalmacen);

                const data = rpta.ordencompra[0].items.map((item: any) => ({
                  ...item,
                  idordencompraitem: 0,    
                  idordencompra: this.idMovimiento, 
                  coditem: 1  ,
                }))
                this.lstItemOC = data;
              }
              console.info('lstItemOC : ', this.lstItemOC);  
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

    selectCheckbox(dato: any){
      console.log('selectCheckbox...', dato);
      console.log('selectCheckbox...', this.selectedItems);

      const data = this.lstItemOC.map((item: any) => ({
        ...item,
        indcompleto: dato.checked === true ? true : false,
      }))

      this.lstItemOC = data;
    }
 verUbicacion(dato:any, producto:any){
          console.log('verUbicacion', dato);
          dato.idalmacen = this.registerFormRegistro.value.idalmacen;
          dato.iddocumentoprcitem_trx = producto.iddocumentoprcitem_trx
          const ref = this.dialogService.open(CModalUbicacionComponent, {
            data: dato,
            header: 'Ubicaciones del Almacén ' ,
            closeOnEscape: false,
            styleClass: 'testDialog',
            width: '40%'
        });
    
        ref.onClose.subscribe((rpta: any) => {
          console.log('verUbicacion',rpta.objeto);
          console.log('this.lstItemOC', this.lstItemOC);
            //this.traerUnoOrdenC();
            for (let i = 0; i < this.lstItemOC.length; i++) {
                // if (this.lstItemOC[i].idordencompraitem === rpta.objeto.idordencompraitem) {
                //   this.lstItemOC[i].idubicacion = parseInt(rpta.objeto.idubicacion)
                //   this.lstItemOC[i].rutaubicacion = rpta.objeto.rutaubicacion
                // }
                if (this.lstItemOC[i].idordencompraitem === 0) {
                  if (this.lstItemOC[i].iddocumentoprcitem_trx === rpta.objeto.iddocumentoprcitem_trx) {
                    this.lstItemOC[i].idubicacion = parseInt(rpta.objeto.idubicacion)
                  this.lstItemOC[i].rutaubicacion = rpta.objeto.rutaubicacion
                  }
                }else{            
                  if (this.lstItemOC[i].idordencompraitem === rpta.objeto.idordencompraitem) {
                    this.lstItemOC[i].idubicacion = parseInt(rpta.objeto.idubicacion)
                  this.lstItemOC[i].rutaubicacion = rpta.objeto.rutaubicacion
                  }
                }
            }
          });
        }
}
