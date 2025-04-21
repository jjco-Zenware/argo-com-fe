
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedAppService } from '@sharedAppService';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import { Marca, Moneda } from '@interfaces';
import { AlmacenService } from 'src/app/pages/almacen/service/almacenServices';

@Component({
  selector: 'app-c-modal-producto',
  templateUrl: './c-modal-producto.component.html',
  styleUrls: ['./c-modal-producto.component.scss']
})
export class CModalProductoComponent implements OnInit{

  $listSubcription: Subscription[] = [];
  registerFormRegistro!: FormGroup;
  idprod: number = 0;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  verbtnGrabar: boolean = false;
  errorMensaje: string = "";
  lstFamilia:any;
  lstSubFamilia:any;
  submitted?: boolean;
  lstMarcas: Marca[] = [];
  lstUnidades: any[]=[];
  lstMonedas: Moneda[] = [];

  constructor(
    private fb: FormBuilder,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private proyectosService: ProyectosService,
    private comprasService: ComprasService,
    private almacenService: AlmacenService,
    public refDato: DynamicDialogRef,
  ) { }

  ngOnInit(): void {

    this.createFormRegistro();
    this.listarMarcas();
    this.listarFamilia();    
    this.listarItemsTabla();
    this.listaMonedas() ;
    
   
  }
  get formRegistro() { return this.registerFormRegistro.controls; }

  createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
      idprod: [{ value: this.idprod, disabled: true }],
      codproducto: [{ value: '', disabled: true }],
      despro:[{ value: '', disabled: false }],
      desdet:[{ value: '', disabled: false }],
      valorunit:[{ value: 0, disabled: false }],
      preciovenmax:[{ value: 0, disabled: false }],
      preciovenmin:[{ value: 0, disabled: false }],
      fecactivo: [{value: this.serviceUtilitario.obtenerFechaActual(),disabled: false,}],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
      idfamilia:[{ value: 0, disabled: false }],
      idsubfamilia: [{ value: 0, disabled: false }],
      idmarca: [{ value: 0, disabled: false }],
      idunidad: [{ value: 0, disabled: false }],
      stockmin: [{ value: 0, disabled: false }],
      stockmax: [{ value: 0, disabled: false }],
      idmoneda: [{ value: 0, disabled: false }],
      indctrlunidad: [{ value: true, disabled: false }],
      modelo:[{ value: '', disabled: false }],
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


  guardarProducto(){

    if (this.validarDatos())
      {
          this.setSpinner(false);
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }

    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
    // let fechaingreso;
    // let fecentrega;
    // fechaingreso = this.registerFormRegistro.value.fechaingreso;
    // fecentrega = this.registerFormRegistro.value.fecentrega;

    // if (this.idprod > 0) {
    //   fechaingreso = new Date(this.serviceUtilitario.formatFecha(fechaingreso));   
    //   fecentrega = new Date(this.serviceUtilitario.formatFecha(fecentrega));    
    // }

    const objeto = {
      ...this.registerFormRegistro.getRawValue(),
      //fechaingreso,
      //fecentrega,
    }

    console.log('guardarOC...', objeto);
    
    this.almacenService.prcProducto(objeto).subscribe({
      next: (rpta: any) => {
        console.log('guardarProducto...', rpta);
        this.setSpinner(false);
        this.cerrar({...rpta});
        if (rpta.procesoSwitch === 0){
          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
          if (this.idprod === 0) {
            this.idprod = rpta.resultProceso;  
            //this.registerFormRegistro.get('idprod')?.setValue(rpta.resultProceso);
            // this.registerFormRegistro.get('codigonroorden').setValue(rpta.resultProceso);             
          }
                
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

  listarItemsTabla() {
    this.comprasService.obtenerItemsTabla(107).subscribe({
        next: (rpta: any) => {
            this.lstUnidades = rpta;
            console.log('lstUnidades : ', rpta);
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
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

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.formValue...', this.registerFormRegistro.value);

    //   if (this.registerFormRegistro.value.codproducto === null || this.registerFormRegistro.value.codproducto === '')
    //   {
    //       this.errorMensaje="Ingresar Código...!";
    //       _error = true;
    //   }

      if (!_error && this.registerFormRegistro.value.despro === null || this.registerFormRegistro.value.despro === '')
      {
          this.errorMensaje="Ingresar Descripción...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.idfamilia === 0 || this.registerFormRegistro.value.idfamilia === null))
      {
          this.errorMensaje="Seleccionar Grupo...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.idsubfamilia === 0 || this.registerFormRegistro.value.idsubfamilia === null))
      {
          this.errorMensaje="Seleccionar Clasificación...!";
          _error = true;
      }

      if (!_error && (this.registerFormRegistro.value.idmarca === 0 || this.registerFormRegistro.value.idmarca === null))
      {
          this.errorMensaje="Seleccionar Marca...!";
          _error = true;
      }  
      
      if (!_error && (this.registerFormRegistro.value.modelo === '' || this.registerFormRegistro.value.modelo === null))
        {
            this.errorMensaje="Ingresar Modelo...!";
            _error = true;
        } 
       return _error;
     }
     

    listarFamilia() {
      const $listarFamilia = this.almacenService.listarFamilia().subscribe({
        next: (rpta: any) => {
          this.lstFamilia = rpta;
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

    getSubFamilia(dato: any) {  
      const $getSubFamilia = this.almacenService.listarSubFamilia(dato).subscribe({
          next: (rpta: any) => {
              this.setSpinner(false);
              console.info('next : ', rpta);
              this.lstSubFamilia = rpta;
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
      this.$listSubcription.push($getSubFamilia);
    }

    cerrar(data:any) {
        const objeto = {
          ...data,
          codigo: data.resultProceso
        }
        console.log('cerrar.141441..', objeto);
        this.refDato.close({objeto});
      }

}
