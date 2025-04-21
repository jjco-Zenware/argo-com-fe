import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TipoProducto } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';
import { ComprasService } from '../../Service/compraServices';
import { AlmacenService } from 'src/app/pages/almacen/service/almacenServices';

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
  lstFamilia:any[] = [];
  errorMensaje: string = "";

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
    public datepipe: DatePipe,
    private almacenService: AlmacenService
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    this.createFrm();
    this.listarTipoProducto();
    this.listarFamilia();
      
    this.getRegistro();
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
      descripcion: [{ value: '', disabled: false }],
      cantidad: [{ value: 0, disabled: false }],
      codunidad: [{ value: 'UNID', disabled: false }],
      preciocosto: [{ value: 0, disabled: false }],
      descuento: [{ value: 0, disabled: false }],
      margen: [{ value: 0, disabled: false }],
      precioventa: [{ value: 0, disabled: true }],
      indvig: [{ value: true, disabled: true }],
      iduserreg: [{ value: 0, disabled: false }],
      fecreg :[{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: true }],
      iduseract: [{ value: 0, disabled: false }],
      fecact: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: true }],
      coditem: [{ value: '0', disabled: false }],
      idmarca: [{ value: 109, disabled: false }],
      nomprod: [{ value: '', disabled: false }],
      nommarca: [{ value: '', disabled: false }],
      preciocostototal: [{ value: 0, disabled: true }],
      precioventatotal: [{ value: 0, disabled: true }],
      preprofit: [{ value: 0, disabled: true }],
      nomtipoprod: [{ value: '', disabled: false }],
      nomproveedor: [{ value: '', disabled: false }],
      serialnumber: [{ value: '', disabled: false }],
      sku: [{ value: '', disabled: false }],
      nrocontrato: [{ value: '', disabled: false }],
      nromeses: [{ value: 0, disabled: false }],
      fecini: [{ value: null, disabled: false }], //this.serviceUtilitario.obtenerFechaInicioMes()
      fecfin: [{ value: null, disabled: false }], //this.serviceUtilitario.obtenerFechaFinMes()
      idunidad: [{ value: 130, disabled: false }],
      nomunidad: [{ value: '', disabled: false }],
      valor: [{ value: '', disabled: false }],
      ref1: [{ value: '', disabled: false }],
      codproducto: [{ value: '', disabled: false }],
      despro: [{ value: '', disabled: false }],
      idfamilia: [{ value: 0, disabled: false }],
      idsubfamilia: [{ value: 0, disabled: false }],
    })
  }


  getRegistro(){
    this.frmDatosItem.patchValue(this.param);
    console.log('getRegistro... : ', this.param);
    
  }

  listarTipoProducto() {
    const $listarTipoProducto = this.proyectosService.obtenerTipoProducto().subscribe({
      next: (rpta: any) => {
        this.lstTipoProductoTot = rpta;
        this.lstTipoProducto = this.lstTipoProductoTot.filter(x => x.idtipoprod !== 0 && x.idtipoprod !== 8);
        console.log('this.lstTipoProducto...!', this.lstTipoProducto)
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


  guardarItem() {
    if (this.validarDatos())
      {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }    
      
      const _nomtipoprod:string=this.lstTipoProducto.filter(x=>x.idtipoprod == this.frmDatosItem.get('idtipoprod')?.value)[0].nomtipoprod;
    this.frmDatosItem.get('nomtipoprod')?.setValue(_nomtipoprod)

    this.cerrar({...this.frmDatosItem.getRawValue()})
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }


  traerUnoProducto(codigo: any){   
    const $traerUno = this.almacenService.traerProductoPorCodigo(codigo)
      .subscribe({
        next: (rpta:any) => {
          console.log('rpta.traerUnoProducto', rpta);  
          this.frmDatosItem.get('idprod')?.setValue(rpta.idprod);
          this.frmDatosItem.get('nommarca')?.setValue(rpta.nommarca);
          this.frmDatosItem.get('despro')?.setValue(rpta.despro); 
          this.frmDatosItem.get('idmarca')?.setValue(rpta.idmarca);     
          
         
        },
        error:(err)=>{
            this.serviceSharedApp.messageToast()
        },
        complete:() => {        
        }
      });
    this.$listSubcription.push($traerUno)
  }
    
    listarFamilia() {
      const $listarFamilia = this.almacenService.listarFamilia().subscribe({
          next: (rpta: any) => {
          this.lstFamilia = rpta;
          console.log('rpta', rpta);
          },
          error: (err) => {
          console.info('error : ', err);
          this.serviceSharedApp.messageToast()
          },
          complete: () => {
          },
      });
      this.$listSubcription.push($listarFamilia);
      }
    
      validarDatos():boolean{
        let _error = false;
        this.errorMensaje="";
        
        if (this.frmDatosItem.get('idtipoprod')?.value === '' || this.frmDatosItem.get('idtipoprod')?.value === null) {
          this.errorMensaje="Seleccionar Producto...!";
              _error = true;
        }    
    
        if(!_error && (this.frmDatosItem.value.cantidad === null || this.frmDatosItem.value.cantidad ==='' || this.frmDatosItem.value.cantidad === 0 ))
        {
            this.errorMensaje="Ingresar Cantidad...!";
            _error = true;
        }

        if(!_error && (this.frmDatosItem.value.descripcion === null || this.frmDatosItem.value.descripcion ===''))
          {
              this.errorMensaje="Ingresar Descripción...!";
              _error = true;
          }
    
        return _error;
        }
}
