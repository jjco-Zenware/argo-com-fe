import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage,  mensajesQuestion } from '@constantes';
import { Cliente, Contacto, CotizacionItem, Moneda, TipoDocumento } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OrdencompraService } from '../service/ordencompra.service';


@Component({
  selector: 'app-c-dato-cotizacion',
  templateUrl: './c-dato-cotizacion.component.html'
})
export class CDatoCotizacionComponent implements OnInit, OnDestroy {


    $listSubcription: Subscription[] = [];
    param: any;
    frmDatosCot!: FormGroup;
    lstCotizacionItem: CotizacionItem[] = [];
    lstProveedores: Cliente[] = [];
    lstMonedas: Moneda[] = [];
    lstTipoDocumento: TipoDocumento[] = [];

    idOportunidad: number = 0;
    idCotiza: number = 0;
    nrodocumentoadd: string = "";

    blockedDocument: boolean = false;
    mensajeSpinner: string = "";

    ExcelData: any;
    i_valor: number = 2;
    visibleDocument: boolean = true;
    registerFormCliente: any = FormGroup;
    proveedorVisible: boolean = false;
    personaNatural: boolean = false;
    headerTitle: string = '';

    asignadosContacto: Contacto[] = [];
    filteredContac: Contacto[] = [];
    lstTotalcontacs: Contacto[] = [];
    contactoVisible: boolean = false;
    registerFormContacto: any= FormGroup;
    submitted = false;
    IdContacto: number = 0;
    listaContacInicial: any = undefined;
    contacto: Contacto = {idcontacto: 0, idcliente:0, nombrecontacto: '', cargo: '',image:'', telefono:'', idcotiza:0 };
    montoTotal: number = 0;
    lstTipoRol:any;

    dropdownItemsTipPer = [
        { name: 'Jurídica', code: 'J' },
        { name: 'Natural', code: 'N' }
    ];

    dropdownItemsNac = [
        { name: 'Extranjero', code: '0' },
        { name: 'Nacional', code: '1' }
    ];

    dropdownItemsTipNro = [
        { name: 'RUC', code: 'RUC' },
        { name: 'DNI', code: 'DNI' }
    ];
    IdCliente: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    public refCtz: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    private messageService: MessageService,
    private OrdencompraService: OrdencompraService,
    private confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) { }


  get formContacto() { return this.registerFormContacto.controls; }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  ngOnInit(): void {
    this.param = this.config.data;
    console.log('ngOnInit', this.param);    

    this.createFrm();
    this.createFormContacto();
    this.getRegistro();
    this.listaMonedas();
    this.listaProveedores();
    this.createFormProveedor();
    this.listarItemsTabla();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  get formCot() { return this.frmDatosCot.controls; }
  get formProveedor() { return this.registerFormCliente.controls; }

  createFrm() {
    this.frmDatosCot = this.fb.group({
      idcotiza: [{ value: this.param.data.idcotiza, disabled: true }],
      idrequerimiento: [{ value: 0, disabled: false }],
      idoportunidad: [{ value: null, disabled: false }],
      codtipodoc: [{ value: 'QTE', disabled: false }],
      fechaingreso: [{
        value: this.serviceUtilitario.obtenerFechaActual(),
        disabled: false,
      }],
      idproveedor: [{ value: 0, disabled: false }, [Validators.required]],
      idmoneda: [{ value: 0, disabled: false }, [Validators.required]],
      iduserreg: [{ value: 0, disabled: false }],
      fecreg: [{ value: new Date(), disabled: false }],
      tiempoentrega: [{ value: 0, disabled: false }],
      codformapago: [{ value: '0', disabled: false }],
      validezoferta: [{ value: 0, disabled: false }],
      lugarentrega: [{ value: '0', disabled: false }],
      observacion: [{ value: '...', disabled: false }],
      garantia: [{ value: 0, disabled: false }],
      nrodocumentoadd: [{ value: null, disabled: false }],
      servicionombre: [{ value: '0', disabled: false }],
      condicionescomerciales:[{value: '', disabled: false }]
    })
  }

  createFormContacto() {
    //Agregar validaciones de formulario
    this.registerFormContacto = this.formBuilder.group({
    nombrecontacto: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required]],
    cargo: ['', [Validators.required]],
    tiporol: ['', [Validators.required]],
    });
}

  createFormProveedor() {
    //Agregar validaciones de formulario
    this.registerFormCliente = this.fb.group({
    idrolpersona: [{ value: 'PRO', disabled: false }],
    tipopersona :  [{ value: 'J', disabled: false }],
    tipoalta : [{ value: 'NOR', disabled: false }],
    indnacionalidad: [{ value: null, disabled: false }, [Validators.required]],
    idpais: [{ value: '1', disabled: false }],
    idtipodoc: [{ value: null, disabled: false }, [Validators.required]],
    nrodocumento: [{ value: null, disabled: false }, [Validators.required]],
    appaterno: [{ value: null, disabled: false }, [Validators.required]],
    apmaterno: [{ value: null, disabled: false }, [Validators.required]],
    apcasada: [{ value: null, disabled: false }],
    nombres: [{ value: null, disabled: false }, [Validators.required]],
    razonsocial: [{ value: null, disabled: false }, [Validators.required]],
    nomcomercial: [{ value: null, disabled: false }],
    direcresumen: [{ value: null, disabled: false }, [Validators.required]],
    telefresumen: [{ value: null, disabled: false }],
    email: ['', [Validators.required, Validators.email]],
    paginaweb: [{ value: null, disabled: false }],
    facebook: [{ value: null, disabled: false }],
    youtube: [{ value: null, disabled: false }],
    indmigrado :  [{ value: false, disabled: false }],
    indestado:  [{ value: '1', disabled: false }],
    indvig :  [{ value: true, disabled: false }],
    fechareg: [{ value: new Date(), disabled: false }],
    iduserreg : [{ value: 1, disabled: false }],
    fechaact: [{ value: new Date(), disabled: false }],
    iduseract: [{ value: 1, disabled: false }],
    idpersona: [{ value: 0, disabled: false }],
    tipocambio: [{ value: 0, disabled: false }],
    });
}

  getRegistro() {
    console.log("params dato: ", this.param);
    this.frmDatosCot.patchValue(this.param.data);
    this.asignadosContacto = [];

    console.log("this.param.data.contactos: ", this.param.data.contactos);
    console.log("idindicador: ", this.param.idindicador);
    this.idOportunidad = this.param.data.idoportunidad;

    this.idCotiza = this.param.data.idcotiza;

    if (this.param.data.contactos !== null && this.param.data.contactos !== undefined) {
        console.log("ENTRO idindicador: ", );
        this.asignadosContacto = this.param.data.contactos;
        this.listaContacInicial= this.param.data.contactos;
    }


    console.log("getContactos: ", this.param.data.idproveedor);
    if (this.param.data.idproveedor !== undefined) {
      this.getContactos(this.param.data.idproveedor);
    }
    
    if (this.idCotiza > 0) {
        this.visibleDocument = false;
    }else{
        this.idCotiza = 0;
    }
    this.lstCotizacionItem = this.param.data['items'] && this.param.data['items'].length > 0 ? this.param.data.items : [];

    this.calcularTotales() ;

  }

  listaProveedores() {
    const objeto = {
      idrolpersona: 'PRO',
      idusuario: constantesLocalStorage.idusuario
    }

    console.log('listaProveedores', objeto);

    const $getClientes = this.OrdencompraService.ListaClientes(objeto).subscribe({
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

  listaMonedas() {
    const $listaMonedas = this.OrdencompraService.obtenerMonedas().subscribe({
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

  getRegistro2() {
    this.confirmationService.confirm({
        key: 'confirm2',
        header: 'Confirmación',
        message: '¿Desea Adjuntar Documentos?',
        accept: () => {
            this.visibleDocument = false;
            //this.listarCotizacionUno();
        }
    });
  }

  listarCotizacionUno() {
    this.lstCotizacionItem = [];
    const $listarCotizacionUno = this.OrdencompraService.listarCotizacionUno(this.idCotiza)
      .subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.log('listarCotizacionUno', rpta.quotes);
            this.lstCotizacionItem = rpta.quotes.items;
        },
        error: (err) => {
          console.error('error : ', err)
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
        }
      });
    this.$listSubcription.push($listarCotizacionUno);
  }

  destroy() {
    this.refCtz.close();
  }




getContactos(codigo: any) {
    //this.IdCliente= idcliente;
    this.OrdencompraService.obtenerContactos(codigo).subscribe({
        next: (rpta: any) => {
            console.log('getContactos',rpta);
        this.lstTotalcontacs = rpta;
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

getContactos2(codigo: any) {
  //this.IdCliente= idcliente;
    this.asignadosContacto = [];
  this.OrdencompraService.obtenerContactos(codigo).subscribe({
      next: (rpta: any) => {
      this.lstTotalcontacs = rpta;
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

filterContac(event: any) {
    let filtered: Contacto[] = [];
    let query = event.query;

    for (let i = 0; i < this.lstTotalcontacs.length; i++) {
        let contac = this.lstTotalcontacs[i];
        if (
            contac.nombrecontacto &&
            contac.nombrecontacto.toLowerCase().indexOf(query.toLowerCase()) == 0
        ) {
            filtered.push(contac);
        }
    }
    this.filteredContac = filtered;
}

changeHeaderTitle(arg: number, contac: any) {
    this.listaContacInicial=[];
    this.submitted = false;
    this.registerFormContacto.reset();

    this.listaContacInicial = this.asignadosContacto;
    console.log('lista contactos', this.listaContacInicial);

    if (arg == 1) {
        this.headerTitle = "Nuevo Contacto";
        this.IdContacto = 0;
    }
    if (arg == 2) {
        this.headerTitle = "Editar Contacto";
        this.IdContacto = contac.idcontacto;
        this.registerFormContacto.get('nombrecontacto').setValue(contac.nombrecontacto);
        this.registerFormContacto.get('email').setValue(contac.email);
        this.registerFormContacto.get('telefono').setValue(contac.telefono);
        this.registerFormContacto.get('cargo').setValue(contac.cargo);

    }
    this.contactoVisible=true;
}


listarItemsTabla() {
  this.OrdencompraService.obtenerItemsTabla(103).subscribe({
      next: (rpta: any) => {
          console.log('listarItemsTabla', rpta);
      this.lstTipoRol = rpta;
      },
      error: (err) => {
      console.info('error : ', err);
      this.serviceSharedApp.messageToast()
      },
      complete: () => {
      },
  });

  }


calcularTotales() {
    console.log('this.filteredProd...', this.lstCotizacionItem);
    let totalpreventot = 0;

    for (let lstCotiza of this.lstCotizacionItem) {
        totalpreventot = totalpreventot + lstCotiza.preciocostototal;
    }

    this.montoTotal = totalpreventot;
}
}
