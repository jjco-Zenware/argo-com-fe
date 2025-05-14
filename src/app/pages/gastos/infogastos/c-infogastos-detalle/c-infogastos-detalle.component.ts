
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { CModalExcAlmacenComponent } from 'src/app/pages/compras/orden-compra-servicio/modal-exc-almacen/modal-exc-almacen.component';
import { MarketingService } from 'src/app/pages/marketing/service/marketingServices';
import { AutoComplete } from 'primeng/autocomplete';

@Component({
  selector: 'app-c-infogastos-detalle',
  templateUrl: './c-infogastos-detalle.component.html',
  styleUrls: ['./c-infogastos-detalle.component.scss']
})
export class CInformeGastosDetComponent implements OnInit, OnDestroy{
  @Input() IA_data: any;
  $listSubcription: Subscription[] = [];
  visibleDocument: boolean = true;
  dataAdjunto: any;
  registerFormRegistro!: FormGroup;
  headerTitle: string = '';
  lstMonedas: any[] = [];
  idGasto: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  menuItems: MenuItem[] = [];
  verbtnGrabar: boolean = false;
  verbtnAcciones: boolean = false;
  gasto: any;
  verCotizacion: boolean = true;
  onlyRead: boolean = false;
  verReferencia: boolean = false;
  errorMensaje: string = "";
  activeIndex: number = 0;
  lstcategoria: any[]=[];
  lstTransacciones: any[]=[];
  lstCtaCtble: any[] = [];
    filteredCtaCtble!:  any[];
    codctactble: string = "";
    @ViewChild('autoItems', { static: true }) 
   
  stateOptions: any[] = [
    { label: 'Empleado', value: true },
    { label: 'Compañia', value: false }
];
  lstCentroCosto: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,   
      private marketingService: MarketingService,
      public autoItems: AutoComplete
  ) { }

  ngOnInit(): void {
    console.log('ngOnInit', this.IA_data);
    this.idGasto = this.IA_data.idcodigo;

    this.createFormRegistro();
    this.listaMonedas();  
    this.listarItemsTabla(); 
    this.listarPlanContable();
    this.listarCentroCosto();
    
    if (this.idGasto > 0) {   
      if (this.IA_data.paramReg === 'V') {
        this.dataAdjunto ={
          idCliente: this.idGasto,
          codtipoproc: 7,
          veracciones: 1
        }
      }  else{
        this.dataAdjunto ={
          idCliente: this.idGasto,
          codtipoproc: 7,
          veracciones: 0
        }
      }     
      this.traerUno();
    }else{
      this.dataAdjunto ={
        idCliente: 0,
        codtipoproc: 7,
        veracciones: 0
      }     
      this.mostrarBotones('NVO');
    }   
  }



  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idgasto: [{ value: 0, disabled: false }],
      fecgasto: [{value: this.serviceUtilitario.obtenerFechaFormateadoDMA(),disabled: false,}],
      desgasto: [{ value: '', disabled: false }],
      idmoneda: [{ value: '', disabled: false }],
      pagadopor: [{ value: false, disabled: false }],
      idcategoria: [{ value: 0, disabled: false }],
      monto: [{ value: 0, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idtrack: [{ value: 49, disabled: false }],
      codctactble: [{ value: '', disabled: false }],
      idcentrocosto: [{ value: '', disabled: false }],
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
        this.verbtnAcciones = true;
        this.onlyRead = false;
      break;
      case 'NVO':
        this.verbtnGrabar = true;
        this.verbtnAcciones = false;
        this.onlyRead = false;
      break;
      case 'EMI':
        this.verbtnGrabar = false;
        this.verbtnAcciones = true;
        this.onlyRead = true;
      break;
      case 'ANU':
        this.verbtnGrabar = false;
        this.verbtnAcciones = false;
        this.onlyRead = true;
      break;
    
      default:
        break;
    }

    if (this.IA_data.paramReg === 'V') {
      console.log('entro', this.IA_data.paramReg);
      this.verbtnGrabar = false;
      this.verbtnAcciones = false;
      this.onlyRead = true;
    }
    
  }

  traerUno(){
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto ={
      idgasto: this.idGasto,
      idusuario: constantesLocalStorage.idusuario
    }

    const $cargarOrdenC = this.marketingService.gastoTraeruno(this.idGasto)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta traerUno', rpta.registro[0]);
            this.setSpinner(false);
            this.gasto = rpta.registro[0];            
                         
          this.visibleDocument = false;

          this.registerFormRegistro.patchValue(rpta.registro[0]);
          this.codctactble  = rpta.registro[0].codctactble;
          //this.cargarMenu(rpta.registro[0].acciones);
          this.mostrarBotones(rpta.registro[0].estado);  
          this.listarTransacciones(); 
          this.setAutoValue();             
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
    const $lstTransacciones = this.marketingService.listarTrasacciones(this.idGasto).subscribe({
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

  guardar(){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
    let fecgasto;
    fecgasto = this.registerFormRegistro.value.fecgasto;

    if (fecgasto.toString().length === 10) {
      fecgasto = new Date(this.serviceUtilitario.formatFecha(fecgasto)); 
    }  

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      fecgasto,
      codctactble : this.codctactble
    }

    console.log('guardar...', objeto);
    
    this.marketingService.gastoprc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idGasto === 0) {
            this.registerFormRegistro.get('idgasto')?.setValue(rpta.resultProceso);
            this.idGasto = rpta.resultProceso; 
          }
          //this.traerUno();
         
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

  listarItemsTabla() {
    this.marketingService.listarItemsTabla(128).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstcategoria = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
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
      console.log('onAccion', item);
  this.gasto.idtrx = item.idtrx;
  console.log('onAccion', item);
  const ref = this.dialogService.open(CModalExcAlmacenComponent, {
      data: this.gasto,
      header: item.nomtrx,
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
  });

  ref.onClose.subscribe(() => {
     this.traerUno();
    });
  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

      if (this.registerFormRegistro.value.idcategoria === null || this.registerFormRegistro.value.idcategoria === '')
      {
          this.errorMensaje="Seleccionar Categoría...!";
          _error = true;
      }

      // if (!_error && (this.registerFormRegistro.value.sustentodoc === null || this.registerFormRegistro.value.sustentodoc === ''))
      //   {
      //       this.errorMensaje="Ingresar Guia...!";
      //       _error = true;
      //   }

      // if (!_error && (this.registerFormRegistro.value.alm_idordencompra === 0 || this.registerFormRegistro.value.alm_idordencompra === null))
      // {
      //     this.errorMensaje="Seleccionar Orden Compra...!";
      //     _error = true;
      // }

      if (!_error && (this.registerFormRegistro.value.monto === 0 || this.registerFormRegistro.value.monto === '') )
      {
          this.errorMensaje="Ingresar Monto...!";
          _error = true;
      }

      if (!_error && this.registerFormRegistro.value.idmoneda === null)
      {
            this.errorMensaje="Seleccionar Moneda...!";
            _error = true;
      }

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

      filterCtaCtble(event: any) {
        let filtered: any[] = [];
        let query = event.query;
    
        for (let i = 0; i < (this.lstCtaCtble as any[]).length; i++) {
            let codigo = (this.lstCtaCtble as any[])[i];
            if ( codigo.s_desctactble && codigo.s_desctactble.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(codigo);
            }
        }
        console.log('filtered', filtered);
        this.filteredCtaCtble = filtered;
    }

    listarPlanContable(){          
      const $listarPlanContable = this.marketingService.listarPlanContable()
      .subscribe({
          next: (rpta:any) => {
              this.setSpinner(false);
              this.lstCtaCtble = rpta;
          },
          error:(err)=>{
              this.setSpinner(false);
              this.serviceSharedApp.messageToast()
          },
          complete:() => {
            this.setAutoValue();
          }
      });
      this.$listSubcription.push($listarPlanContable)
  }

  selectCuenta(data : any){
      console.log('selectCuenta', data.codctactble);
      this.codctactble = data.codctactble;
  }

  listarCentroCosto(){    
    this.setSpinner(true);
      this.mensajeSpinner = 'Cargando...!';

    const $getListarOrdenCompra = this.marketingService.listarCentroCosto()
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

  setAutoValue() {
    console.log('this.lstCtaCtble', this.lstCtaCtble);
    let selectedValue = this.lstCtaCtble.filter((item:any) => item.codctactble === this.codctactble); 
    console.log('selectedValue', selectedValue);
    this.autoItems.inputEL.nativeElement.value = selectedValue[0].s_desctactble; 
  }

}
