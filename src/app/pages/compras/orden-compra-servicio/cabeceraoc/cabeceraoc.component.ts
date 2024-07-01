
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Cliente, Moneda, OrdenCompraItem } from '@interfaces';
import { Subscription } from 'rxjs';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CItemCotizacionComponent } from '../../proyectos-ganados/c-item-cotizacion/c-item-cotizacion.component';
import { OrdencompraService } from '../service/ordencompra.service';
import { CModalExcTransacComponent } from '../modal-exc-transac/modal-exc-transac.component';
import { ComprasService } from '../../Service/compraServices';
import * as  XLSX  from 'xlsx';

@Component({
  selector: 'app-c-cabeceraoc',
  templateUrl: './cabeceraoc.component.html',
  styleUrls: ['./cabeceraoc.component.scss']
})
export class CabeceraocComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  frmDatosCab!: FormGroup;
  visibleDocument: boolean = true;
  dataAdjunto: any;
  registerFormRegistro: any= FormGroup;
  // verOpor: boolean = false;
  // verInter: boolean = false;
  // verVent: boolean = false;
  // verOtro: boolean = false;
  idtipoproyecto: any;
  lstProyectos: any;
  lstCliente: Cliente []=[];
  lstProveedores: Cliente[] = [];
  annio: Date = new Date;
  submitted = false;
  headerTitle: string = '';
  registerFormCliente: any = FormGroup;
  registerFormContacto: any= FormGroup;
  lstMonedas: Moneda[] = [];
  lstItemOC: OrdenCompraItem[] = [];
  montoTotal: number = 0;
  lstContacto: any;
  lstOrigen: any;
  idOrdenC: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  verbtnGrabar: boolean = false;
  verbtnPreliminar: boolean = false;
  verbtnOrden: boolean = false;
  verbtnAcciones: boolean = false;
  verItems: boolean = true;
  ordenCompra: any;
  dataCT:any = {id:0, razonsocial:'', description:'', nommoneda:'', startDate:'', nomcreador:'', tipocambio:'', idlista:'', quotes:[]};
  verCotizacion: boolean = true;
  lstTipo = [
    { name: 'COMPRA', code: 'OC' },
    { name: 'SERVICIO', code: 'OS' }
  ];
  lstTermino: any;
  lstQuotes: any[]=[];
  verAdjunto: boolean = false;
  contactoVisible: boolean = false;
  itemVisible: boolean = false;
  ExcelData: any;
  idtipoprod: any;
  idmarca: any;
  lstMarcas:any;
  lstTipoProducto:any;
  verImportar: boolean = true;
  onlyRead: boolean = false;

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

    this.createFrm();
    this.createFormRegistro();
    this.createFormContacto();
    this.listaProyectoTipo();
    this.listaClientes();
    this.listaProveedores();
    this.listaMonedas();  
    this.listarItemsTabla();  
    
    if (this.idOrdenC > 0) {   
      if (this.IA_data.paramReg === 'V') {
        this.dataAdjunto ={
          idCliente: this.idOrdenC,
          codtipoproc: 7,
          veracciones: 1
        }
      }  else{
        this.dataAdjunto ={
          idCliente: this.idOrdenC,
          codtipoproc: 7,
          veracciones: 0
        }
      }  
      this.verAdjunto = true;     
      this.traerUnoOrdenC();
    }else{
      //this.verControles('NOA');
      this.cargarProyectos(1); 
      this.dataAdjunto ={
        idCliente: 0,
        codtipoproc: 7,
        veracciones: 0
      }     
      this.mostrarBotones('NVO');
    }   
  }

  get formRegistro() { return this.registerFormRegistro.controls; }
  get formContacto() { return this.registerFormContacto.controls; }

  createFormContacto() {
    //Agregar validaciones de formulario
    this.registerFormContacto = this.formBuilder.group({
      nomcontacto: ['', [Validators.required]],
      email1: ['', [Validators.required, Validators.email]],
      telf1: ['', [Validators.required]],
      cargo: [{ value: '', disabled: false }, [Validators.required]],
      tiporol: [{ value: 0, disabled: false }],
      indvig: [{ value: true, disabled: false }]
    });
}

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idproyecto: [{ value: 0, disabled: false }],
      idtipoproyecto: [{ value: 0, disabled: false }],
      //idcliente: [{ value: '', disabled: false }],
      idoportunidad: [{ value: 0, disabled: false }],
      sustentodoc: [{ value: '', disabled: false }],
      idrequerimiento: [{ value: 0, disabled: false }],
      observacion: [{ value: '', disabled: false }],
      iduserreg: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      nrodocumentoadd:[{ value: '', disabled: false }],
      fechaingreso: [{
        value: this.serviceUtilitario.obtenerFechaActual(),
        disabled: false,
      }],
      idordencompra: [{ value: this.idOrdenC, disabled: true }],
      condicionescomerciales: [{ value: '', disabled: false }],
      idproveedor: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      //idorigen: [{ value: this.IA_data, disabled: false }],
      idcontacto: [{ value: 0, disabled: false }],
      codtipodoc: [{ value: 'OPO', disabled: false }],
      tiempoentrega: [{ value: 0, disabled: false }],
      codformapago: [{ value: '', disabled: false }],
      validezoferta: [{ value: 0, disabled: false }],
      lugarentrega: [{ value: '', disabled: false }],
      garantia: [{ value: 0, disabled: false }],
      servicionombre: [{ value: '', disabled: false }],
      ref01: [{ value: '', disabled: false }],
      ref02: [{ value: '', disabled: false }],
      ref03: [{ value: '', disabled: false }],
      codtipoorden:[{ value: 'OC', disabled: false }],
      codigonroorden:[{ value: '', disabled: true }],
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
    switch (data) {
      case 'REG':
      case 'OBS':
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
      case 'PRC':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = true;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'EMI':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= false;
        this.verbtnOrden = true;
        this.verbtnAcciones = true;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= false;
        this.verbtnOrden = true;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'ELI':
        this.verbtnGrabar = false;
        this.verbtnPreliminar= true;
        this.verbtnOrden = false;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = true;
      break;
      case 'REC':
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
      this.verbtnGrabar = false;
      this.verbtnPreliminar= this.idOrdenC === 0 ? true : false;
        this.verbtnOrden = this.idOrdenC === 0 ? false : true;
        this.verbtnAcciones = false;
        this.verItems = false;
        this.onlyRead = true;
    }
    
  }

  traerUnoOrdenC(){
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
            this.setSpinner(false);
            this.ordenCompra = rpta.ordencompra[0];
            this.ordenCompra.codformapago = (rpta.ordencompra[0].codformapago).toString();
            this.getContactos(rpta.ordencompra[0].idproveedor);      
            if (rpta.ordencompra[0].items !== undefined) {
              this.lstItemOC = rpta.ordencompra[0].items;
              this.calcularTotales();
            }  
            if (rpta.ordencompra[0].quotes !== undefined) {
              this.lstQuotes =  rpta.ordencompra[0].quotes; 
            }    
           
            this.getOrigen(rpta.ordencompra[0].codtipodoc);               
            this.visibleDocument = false;
          this.registerFormRegistro.patchValue(rpta.ordencompra[0]);
          this.cargarMenu(rpta.ordencompra[0].acciones);
          this.mostrarBotones(rpta.ordencompra[0].estado);
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
    this.setSpinner(true);
    let fechaingreso;
    fechaingreso = this.registerFormRegistro.value.fechaingreso;

    if (this.idOrdenC > 0) {
      fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso));      
    }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      items: this.lstItemOC,
      fechaingreso,
      quotes: this.lstQuotes,
      idordencompra: this.idOrdenC
    }

    console.log('guardarOC...', objeto);
    
    this.ordencompraService.ordenCompraprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idOrdenC === 0) {
            this.idOrdenC = rpta.resultProceso;  
            this.registerFormRegistro.get('idordencompra').setValue(rpta.resultProceso);             
           
            this.dataAdjunto ={
              idCliente: this.idOrdenC,
              codtipoproc: 7,
              veracciones: 0
            }   
            this.verAdjunto = true;   
            this.traerUnoOrdenC();
          }
         
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

  // verControles(data:any){    
  //   switch (data) {
  //     case 'OPO':
  //     case 'REQ':
  //     case 'VED':
  //       this.verOpor = true;
  //       this.verInter = false;
  //       this.verVent = false;
  //       this.verOtro = false;
  //     break;
  //     case 'NOA':
  //       this.verOpor = false;
  //       this.verInter = false;
  //       this.verVent = true;
  //       this.verOtro = true;          
  //     break;
  //   }
  // }

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

  listaProyectoTipo(){
    this.ordencompraService.tipoProyectoList().subscribe({
      next: (rpta: any) => {
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
   
  getOrigen(data:any){
    switch (data) {
      case 'OPO':
        this.cargarProyectos(1);
        break;
      case 'REQ':
        this.cargarProyectos(2);
        break;
      // case 'VED':
      //   this.cargarProyectos(3);
      //   break;
      // case 'NOA':
      //   this.registerFormRegistro.get('idproyecto').setValue(0);
      //   break;
    }    
    this.registerFormRegistro.get('sustentodoc').setValue('');    
    //this.verControles(data);

  }

  getItem(data: any,index: number) {
    data.nroindex = index;
    data.idordencompra = this.idOrdenC;
    const refItem = this.dialogService.open(CItemCotizacionComponent, {
      data: data,
      header: data.length == 0 ? "Agregar Item" : "Editar Item - " + data.idordencompraitem,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: ' 60%',
      //height: '55%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      if (rpta != undefined) {
          const _posAll: number = this.lstItemOC.findIndex((x => x.nroindex == index))
          if (_posAll != -1) {
            this.lstItemOC.splice(_posAll, 1)
          }
        this.lstItemOC.push(rpta.data);
      }
      this.calcularTotales();
    });
  }

  calcularTotales() {
    let totalpreventot = 0;    
    for (let lstCotiza of this.lstItemOC) {
        totalpreventot = totalpreventot + lstCotiza.preciocostototal;
    }    
    this.montoTotal = totalpreventot;
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
      this.calcularTotales();
      }
  });
  }

  getContactos(dato: any) {  
    const $personaProveedorlist = this.comprasService.ListaContactos(dato).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('next : ', rpta);
            this.lstContacto = rpta;
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

  ReadExcel(event: any, fubauto: any){
    let file = event.files[0];
    let s_nombre = file.name.split('.').pop();  

    if (s_nombre != "xlsx") {
        this.messageService.add({severity: 'info', summary: 'Info', detail: "Archivo Incorrecto..." });
        fubauto.clear();
        return;
    }

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) =>{
        var workBook = XLSX.read(fileReader.result,{type:'binary'});
        var sheetNames = workBook.SheetNames;
        this.ExcelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]])
        console.log(this.ExcelData);

        const _nomtipoprod:string =this.lstTipoProducto.filter((x: { idtipoprod: any; })=>x.idtipoprod == this.idtipoprod)[0].nomtipoprod;
        const _nommarca:string =this.lstMarcas.filter((x: { idmarca: any; })=>x.idmarca == this.idmarca)[0].nommarca;

        this.ExcelData.forEach((item: any) => {
          item.idmarca = this.idmarca,
          item.idtipoprod = this.idtipoprod,
          item.nommarca  = _nommarca,
          item.nomtipoprod  = _nomtipoprod,
          item.coditem = '0',
          item.descuento = 0,
          item.fecact = new Date(),
          item.fecfin = new Date(),
          item.fecini = new Date(),
          item.fecreg = new Date(),
          item.idordencompra = 0,
          item.idordencompraitem = 0,
          item.idprod = 0,
          item.idunidad = 130,
          item.iduseract = 0,
          item.iduserreg = 0,
          item.indvig = true,
          item.margen = 0,
          item.nomprod = null,
          item.nomproveedor = '',
          item.nrocontrato = '',
          item.nromeses = 0,
          item.preprofit = 0,
          item.serialnumber = '',
          item.sku = '',
          item.codunidad = 'UNID',
          this.lstItemOC.push(item)
        });
        console.log( 'listaitems...' ,this.lstItemOC);
        this.calcularTotales();
        this.itemVisible = false;
    }
    fubauto.clear();
  }

  cargarProyectos(dato:any){
    this.ordencompraService.portipoProyectoList(dato).subscribe({
      next: (rpta: any) => {
        console.log('lstProyectos', rpta);
      this.lstProyectos = rpta;

      if (this.idOrdenC > 0) {
        this.changeProyecto(this.registerFormRegistro.get('idproyecto').value);
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
    this.ordenCompra.idtrx = item.idtrx;
    const ref = this.dialogService.open(CModalExcTransacComponent, {
        data: this.ordenCompra,
        header: item.nomtrx +' - '+  this.ordenCompra.idordencompra,
        closeOnEscape: false,
        styleClass: 'testDialog',
        width: '40%'
    });
    ref.onClose.subscribe(() => {
        this.traerUnoOrdenC();
      });
  }

  changeProyecto(idproyecto : any){
    if (this.registerFormRegistro.get('codtipodoc').value === 'OPO') {  
      const idoportunidad = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == idproyecto)[0].idoportunidad;
      const nomproyecto = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == idproyecto)[0].nomproyecto;
      this.registerFormRegistro.get('sustentodoc').setValue(nomproyecto);
      this.oportunidadTraerUno(idoportunidad);     
    }    else{
      const nomproyecto = this.lstProyectos.filter((x: { idproyecto: any; })=>x.idproyecto == idproyecto)[0].nomproyecto;
      this.registerFormRegistro.get('sustentodoc').setValue(nomproyecto);
      this.verCotizacion = true;
    }
  }

  oportunidadTraerUno(idoportunidad: any){
    //this.setSpinner(true);
    this.mensajeSpinner = 'Cargando Cotizaciones...!';
    this.proyectosService.oportunidadTraeruno(idoportunidad).subscribe({
      next: (rpta: any) => {
        let quotes = this.lstQuotes;
          const {id, razonsocial, description, nommoneda, startDate, nomcreador, tipocambio, idlista} = rpta;
              this.dataCT = {id, razonsocial, description, nommoneda, startDate, nomcreador, tipocambio, idlista, quotes};
      },
          error: (err) => {
            //this.setSpinner(false);
          this.messageService.clear();
          this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: mensajesQuestion.msgErrorGenerico,
          });
      },
          complete: () => {
            this.verCotizacion = false;
            //this.setSpinner(false);
      },
    });
  }

  vistaPreliminar(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Vista Preliminar...!';

    const objeto = {
      idusuario : constantesLocalStorage.idusuario,
      iddocumentoprc: this.idOrdenC,
      codtipoprc: 8
    }

    const $cargarOrdenC = this.ordencompraService.prcDocumento(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);      
        
        const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = this.idOrdenC + '-OC';
  
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

  getQuotes(dato: any){
    let objeto = {
      idcotiza: dato.idcotiza,
      indseleccion: dato.indseleccion
    }
    if (dato.indseleccion) {
      this.lstQuotes.push(objeto);
    }else{
      const _posAll: number = this.lstQuotes.findIndex(((x: { idcotiza: any; }) => x.idcotiza == dato.idcotiza))
          if (_posAll != -1) {
          this.lstQuotes.splice(_posAll, 1)
        }
    }    
  }

  AgregarContacto(){
    if (this.registerFormRegistro.get('idproveedor').value === null) {
      this.messageService.add({ severity: 'info', summary: 'Aviso...!', detail:'Debe Seleccionar un Proveedor...' });

      return;
    }
    this.submitted = false;
    this.registerFormContacto.patchValue({
      nombrecontacto: '',
      email: '',
      telefono: '',
      cargo: ''
    });
    this.contactoVisible = true;
  }

  guardarContacto(){
    console.log('guardarContacto', this.registerFormContacto.value);
    this.submitted = true;
        // deténgase aquí si el formulario no es válido
        if (this.registerFormContacto.invalid) {
            return;
        }
        //Verdadero si todos los campos están llenos
        if(this.submitted)
        {
          const objeto = {
            ...this.registerFormContacto.getRawValue(),
            idcontacto: 0,
            idpersona: this.registerFormRegistro.get('idproveedor').value ,
        }
        console.log('objeto', objeto);

        this.ordencompraService.altaContacto(objeto)
            .subscribe({
            next: (rpta:any) => {
                console.log("rpta updateContacto : ", rpta);
                if (rpta.procesoSwitch === 0){
                  this.contactoVisible = false;
                    this.messageService.add({severity: 'success', detail: "Operación exitosa" }); 
                    this.getContactos(this.registerFormRegistro.get('idproveedor').value);                     
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

  importarPlantilla(){
    this.listarTipoProducto();
    this.listarMarcas();
    this.idtipoprod = null;
    this.idmarca = null;
    this.verImportar= true;
    this.itemVisible = true;
  }

  disabelImportar(){
    console.log(this.idtipoprod , this.idmarca)
    if (this.idtipoprod != null && this.idmarca != null) {
      this.verImportar= false;
    }
  }

  listarTipoProducto() {
    const $listarTipoProducto = this.proyectosService.obtenerTipoProducto().subscribe({
      next: (rpta: any) => {
        console.log('listarTipoProducto', rpta);
        const lstTipoProductoTot = rpta;
        this.lstTipoProducto = lstTipoProductoTot.filter((x: { idtipoprod: number; }) => x.idtipoprod !== 0 && x.idtipoprod !== 8);
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listarTipoProducto);

  }

  listarMarcas() {
    const $listarMarcas = this.proyectosService.obtenerMarcas().subscribe({
      next: (rpta: any) => {
        this.lstMarcas = rpta;
      },
      error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
    });
    this.$listSubcription.push($listarMarcas);

  }

  descargarPlantilla(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Descargando Plantilla...!';

    const $cargarOrdenC = this.ordencompraService.descargarPlantilla(2).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);      
        
        const mediaType = 'application/pdf';
          const blob = new Blob([rpta.body], { type: mediaType });
          const filename = 'PlantillaItemsOC.xlsx';
  
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          ///a.target = '_blank';
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
}
