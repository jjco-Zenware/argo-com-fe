import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Marca, TipoProducto } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { MessageService } from 'primeng/api';
import { ProyectosService } from '../service/proyectos.service';
import { ComprasService } from '../../Service/compraServices';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-c-item-cotizacion',
  templateUrl: './c-item-cotizacion.component.html'
})
export class CItemCotizacionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  frmDatosItem!: FormGroup;
  lstTipoProducto: TipoProducto[] = [];
  lstTipoProductoTot: TipoProducto[] = [];
  lstMarcas: Marca[] = [];
    marcaVisible?: boolean;
    headerTitle?: string;
    submitted?: boolean;
    registerFormMarca: any = FormGroup;
    verporTipo: boolean = false;
    verporLic: boolean = false;
    verporSerie: boolean = false;
    verSku: boolean = false;
    lstUnidades: any;

  constructor(
    private fb: FormBuilder,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    private messageService: MessageService,
    private proyectosService: ProyectosService,
    private comprasService: ComprasService,
    public datepipe: DatePipe
  ) { }

  get formContacto() { return this.registerFormMarca.controls; }

  ngOnInit(): void {
    this.param = this.config.data;
    console.log("params : ", this.param);
    this.createFrm();
    this.createFormContacto();    
    this.listarTipoProducto();
    this.listarMarcas();
    this.listarItemsTabla();

    // if (this.param.idordencompra === 0) {
    // }else{
    //   this.verControles(this.param.idtipoprod);
    // }    
    this.getRegistro();
    this.verControles(this.param.idtipoprod);
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatosItem = this.fb.group({
      idordencompraitem: [{ value: 0, disabled: false }],
      idordencompra: [{ value: 0, disabled: false }],
      idtipoprod: [{ value: 0, disabled: false }],
      idprod: [{ value: 0, disabled: false }],
      descripcion: [{ value: null, disabled: false }, [Validators.required]],
      cantidad: [{ value: 1, disabled: false }, [Validators.required]],
      codunidad: [{ value: 'UNID', disabled: false }],
      preciocosto: [{ value: 0, disabled: false }, [Validators.required]],
      descuento: [{ value: 0, disabled: false }],
      margen: [{ value: 0, disabled: false }],
      precioventa: [{ value: 0, disabled: true }],
      indvig: [{ value: true, disabled: true }],
      iduserreg: [{ value: 0, disabled: false }],
      fecreg :[{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: true }],
      iduseract: [{ value: 0, disabled: false }],
      fecact: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: true }],
      coditem: [{ value: '0', disabled: false }],
      idmarca: [{ value: 0, disabled: false }],
      nomprod: [{ value: null, disabled: false }],
      nommarca: [{ value: null, disabled: false }],
      preciocostototal: [{ value: 0, disabled: true }],
      precioventatotal: [{ value: 0, disabled: true }],
      preprofit: [{ value: 0, disabled: true }],
      nomtipoprod: [{ value: '', disabled: false }],
      nomproveedor: [{ value: '', disabled: false }],
      serialnumber: [{ value: '', disabled: false }],
      sku: [{ value: '', disabled: false }],
      nrocontrato: [{ value: '', disabled: false }],
      nromeses: [{ value: 0, disabled: false }],
      fecini: [{ value: this.serviceUtilitario.obtenerFechaInicioMes(), disabled: false }],
      fecfin: [{ value: this.serviceUtilitario.obtenerFechaFinMes(), disabled: false }],
      idunidad: [{ value: '', disabled: false }]
    })
  }

  createFormContacto() {
    //Agregar validaciones de formulario
    this.registerFormMarca = this.fb.group({
    nommarca: ['', [Validators.required]],
    });
}

  getRegistro(){
    this.frmDatosItem.patchValue(this.param);
    // const fechaInicio = this.changeDatePicker(this.frmDatosItem.get('fecini')?.value);
    // const fechaFin = this.changeDatePicker(this.frmDatosItem.get('fecfin')?.value);

    // this.frmDatosItem.get('fecini')?.setValue(fechaInicio);
    // this.frmDatosItem.get('fecfin')?.setValue(fechaFin);
    console.log("frmDatosItem  : ", this.frmDatosItem.getRawValue());
    //this.frmDatosItem.get('idtipoprod')
  }

  listarItemsTabla() {
    this.comprasService.obtenerItemsTabla(107).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTabla : ', rpta);
            this.lstUnidades = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

  listarTipoProducto() {
    const $listarTipoProducto = this.proyectosService.obtenerTipoProducto().subscribe({
      next: (rpta: any) => {
        console.log('listarTipoProducto', rpta);
        this.lstTipoProductoTot = rpta;
        this.lstTipoProducto = this.lstTipoProductoTot.filter(x => x.idtipoprod !== 0 && x.idtipoprod !== 8);
        //this.frmDatosItem.get('idtipoprod')?.setValue(1);
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

  calcularBCQ(event: any) {
    if (event.value > 0) {
      const total = event.value * this.frmDatosItem.get('preciocosto')?.value;
      this.frmDatosItem.get('preciocostototal')?.setValue(total);
    }
  }

  calcularBCPu(event: any) {
    if (event.value > 0) {
      const total = event.value * this.frmDatosItem.get('cantidad')?.value;
      this.frmDatosItem.get('preciocostototal')?.setValue(total);
    }
  }

  guardarItem() {
    //console.log('frmDatosItem...', this.frmDatosItem.getRawValue());

    // if (this.frmDatosItem.get('descripcion')?.value == "") {
    //     this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Agregar Descripción'});
    //     return;
    //   }

      if (this.frmDatosItem.get('preciocosto')?.value == 0) {
        this.messageService.add({severity: 'info', summary: 'Validación...', detail: 'Agregar Precio Costo'});
        return;
      }

    if (this.frmDatosItem.invalid) {
      //console.log('invalid...', this.frmDatosItem.invalid);
      this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Falta Ingresar Datos ..." });
      return;
    }
    const _fecini = new Date(this.frmDatosItem.get('fecini')?.value);
    console.log('_fecini...', _fecini);
    this.frmDatosItem.get('fecini')?.setValue(_fecini);
    const _fecfin = new Date(this.frmDatosItem.get('fecfin')?.value);
    console.log('_fecfin...', _fecfin);
    this.frmDatosItem.get('fecfin')?.setValue(_fecfin);

    const _nomtipoprod:string=this.lstTipoProducto.filter(x=>x.idtipoprod == this.frmDatosItem.get('idtipoprod')?.value)[0].nomtipoprod;
    this.frmDatosItem.get('nomtipoprod')?.setValue(_nomtipoprod)

    const _marca:string=this.lstMarcas.filter(x=>x.idmarca == this.frmDatosItem.get('idmarca')?.value)[0].nommarca;
    this.frmDatosItem.get('nommarca')?.setValue(_marca)

    this.cerrar({...this.frmDatosItem.getRawValue()})
  }

  cerrar(data:any) {
    this.refDatoItem.close({data});
  }

  NuevaMarca()  {
    this.submitted = false;
    this.headerTitle= 'Nueva Marca' ;
    this.marcaVisible = true;
  }

  guardarMarca() {
      this.submitted = true;
      if (this.registerFormMarca.invalid) {
          this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Falta Ingresar Datos ..." });
          return;
      }
      if(this.submitted)
      {
          const objeto = {
              idmarca: 0,
              nommarca: this.registerFormMarca.value.nommarca,
              idproveedor: 0
            }
            const $prcMarcas = this.proyectosService.procesarMarca(objeto).subscribe({
              next: (rpta: any) => {
                  console.log('guardarMarca', rpta);
                this.listarMarcas();
              },
              error: (err) => {
                console.info('error : ', err);
                this.serviceSharedApp.messageToast()
              },
              complete: () => {
              },
            });
            this.$listSubcription.push($prcMarcas);

          this.marcaVisible=false;
      }
  }

  verControles(dato: any){
    switch (dato) {
      case 1:  
        this.verporTipo = true;
        this.verporLic = false;
        this.verporSerie = false;
        this.verSku = true;
      break;
      case 2:
      case 3: 
      case 6: 
      case 7:  
        this.verporTipo = false;
        this.verporLic = true;
        this.verporSerie = false;
        this.verSku = false;
      break;
      case 4:  
        this.verporTipo = false;
        this.verporLic = false;  
        this.verporSerie = false;   
        this.verSku = false; 
      break;
      case 5:  
        this.verporTipo = true;
        this.verporLic = true; 
        this.verporSerie = true; 
        this.verSku = true;    
      break;
    }
  }

  changeDatePicker(data:any): any {
    let fecha = this.datepipe.transform(data, 'dd/MM/yyyy');
    return fecha;
  }
}
