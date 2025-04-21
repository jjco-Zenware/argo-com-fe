import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComprasService } from '../../Service/compraServices';
import { ConfirmationService, MessageService } from 'primeng/api';
import { constantesLocalStorage, globalVariable, mensajesQuestion } from '@constantes';
import { I_RespuestaProceso } from '@interfaces';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProyectosService } from '../../proyectos-ganados/service/proyectos.service';

@Component({
  selector: 'app-c-adjuntos-cot',
  templateUrl: './c-adjuntos-cot.component.html'
})
export class CAdjuntosCotComponent implements OnInit, OnDestroy {
    $listSubcription: Subscription[] = [];
    @Input() IA_data: any;
    
   
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    listadoArchivos: any[] = [];
    files: any = []; 
    descripcion: FormControl = new FormControl({ value: '', disabled: false }); 
    nroreque: any; 
    nomproveedor: any;
    idmoneda: any = '';
    monto: any = 0;
    // descripcion: FormControl = new FormControl({ value: '', disabled: false });
    // nomproveedor: FormControl = new FormControl({ value: '', disabled: false });
    // nroreque: FormControl = new FormControl({ value: '', disabled: false });
    disabUpload:boolean = true;
    idCliente: any;
    _codtipoproc: any;
    verAcciones: boolean = true;
    registerFormRegistro!: FormGroup;  
    lstMonedas: any;
    errorMensaje!: string;

    constructor(
        private messageService: MessageService,
         private confirmationService: ConfirmationService,
         private formBuilder: FormBuilder,
         private comprasService: ComprasService,
         private serviceSharedApp: SharedAppService,
         public refDatoItem: DynamicDialogRef,
         public config: DynamicDialogConfig,
             private proyectosService: ProyectosService,

      ) {
        
      }

      setSpinner(valor: boolean) {
        this.blockedDocument = valor;
        }


      ngOnInit(): void { 
        //this.createFormRegistro();
        this.listaMonedas();
        console.log('this.IA_codigo...', this.IA_data);
        console.log('codigop ver...',this.config.data);
        if (this.IA_data !== undefined) {
          //let nroreq = "REQ-" + this.IA_data.nroreq;
          this.idCliente = this.IA_data.idCliente;
          this._codtipoproc = this.IA_data.codtipoproc; 
          // this.nomproveedor = this.IA_data.proveedor;
          // this.nroreque.setValue(nroreq);
          
          if (this.IA_data.veracciones === 1) {
            this.verAcciones = false;
          }
        }  else{
          this.idCliente = this.config.data.idCliente;
          this._codtipoproc = this.config.data.codtipoproc;
          //this.registerFormRegistro.patchValue(this.config.data);
        }      

        
        
        this.getListaArchivos();
        this.nomproveedor = this.config.data.proveedor;
        this.nroreque = this.config.data.nroreq;
        // this.registerFormRegistro.get('nomproveedor')?.setValue(this.config.data.proveedor);
        // this.registerFormRegistro.get('nroreque')?.setValue("REQ-" + this.config.data.nroreq);
        this.getValueDescrip();
      }

      ngOnDestroy() {
        if (this.$listSubcription != undefined) {
          this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
      }

      // createFormRegistro() {
      //   //Agregar validaciones de formulario
      //   this.registerFormRegistro = this.formBuilder.group({
      //     nomproveedor: [{ value: '', disabled: false }],
      //     nroreque: [{ value: '', disabled: false }],
      //     descripcion: [{ value: '', disabled: false }],
      //     idoportunidad: [{ value: 0, disabled: false }],
      //     idmoneda: [{ value: 0, disabled: false }],
      //     monto: [{ value: 0, disabled: false }],
      //   });    
      // }

      
getListaArchivos() {
    
    const objeto = {
      idoportunidad: 0,
      codtipoproc: this._codtipoproc , 
      idnroproceso: this.idCliente, 
    }
    console.log('this.getListaArchivos...', objeto);
  
  const $listarArchivos = this.comprasService.ListarAdjuntoProc(objeto)
    .subscribe({
      next: (rpta: any) => {
          this.setSpinner(false);
        let dataTmp: any[] = [];
        rpta.forEach((item: any) => {
          const { nombre, extension } = this.separarNombreYExtension(item.nomasset.trim());
          const tipoArchivoLowerCase = extension.toLowerCase();
          const extensiones = this.extensionesPorTipo[tipoArchivoLowerCase];
          dataTmp.push({
            ...item,
            nombreFile: nombre,
            extensionFile: this.asignarIconArchivo(extension),
            colorExtFile: this.colorIconArchivo(extension)
          });
        });
        this.listadoArchivos = dataTmp;
      },
      error: (err) => {
          this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { }
    });
  this.$listSubcription.push($listarArchivos)
  }
  
  async deleteArchivo(idmovasset: number) {
    console.log("deleteArchivo : ", idmovasset);
    
        this.confirmationService.confirm({
            key: 'confirm1',
            header: 'Confirmación',
            message: '¿Estás seguro de Eliminar el Adjunto?...',
            accept: () => {
                const $eliminarArchivo = this.comprasService.eliminarArchivo({idmovasset})
                    .subscribe({
                        next: (rpta: I_RespuestaProceso) => {
                        console.log("eliminar archivo : ", rpta);
                        if (rpta.procesoSwitch === 0){
                          this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
                          this.getListaArchivos();  
                         }else{
                          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
                         }
                        
                        },
                        error: (err) => {
                        //this.setSpinner(false);
                        this.serviceSharedApp.messageToast();
                        },
                        complete: () => { }
                    });
                    this.$listSubcription.push($eliminarArchivo)
            }
        });
    
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
  
  onUpload(event: any, fubauto: any) {

    // if (this.registerFormRegistro.value.descripcion.length === 0){
    //   this.messageService.add({ severity: 'info', summary: 'Validación...', detail: "Ingresar Descripción" });  
    //   return;  
    //  }
  
    const formData = new FormData();
    const fechaActual = new Date();
  
    const dia = fechaActual.getDate().toString().padStart(2, '0');
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0');
    const año = fechaActual.getFullYear();
    const fechaFormateada = `${año}/${mes}/${dia}`;
    const iduser = constantesLocalStorage.idusuario; 
    const codtipoproc = this._codtipoproc ; 
    const idoportunidad = 0;
   
  
    event.files.forEach((file: any) => {
        formData.append('idasset', '0');
        formData.append('file', file);
        formData.append('nomasset', file.name);
        formData.append('idoportunidad',idoportunidad.toString());
        formData.append('codtipodoc', '');
        formData.append('nrodoc', '');
        formData.append('fechadoc', fechaFormateada);
        formData.append('idusuario', iduser.toString());
        formData.append('descripcion', this.descripcion.value);
        formData.append('idnroproceso', this.idCliente.toString());
        formData.append('codtipoproc', codtipoproc.toString());
    });
    fubauto.clear();
  console.log('onUpload',formData);
    this.setSpinner(true);
    this.comprasService.subirArchivo(formData)
      .subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            //this.descripcion.setValue("");
          this.getListaArchivos();
        },
        error: (err) => {
            this.setSpinner(false);
          this.serviceSharedApp.messageToast();
        },
        complete: () => { }
      });
  }
  
  
  
  separarNombreYExtension(nombreArchivo: string): { nombre: string, extension: string } {
    const lastDotIndex = nombreArchivo.lastIndexOf('.');
    const nombre = lastDotIndex !== -1 ? nombreArchivo.substring(0, lastDotIndex) : nombreArchivo;
    const extension = lastDotIndex !== -1 ? nombreArchivo.substring(lastDotIndex + 1).toLowerCase() : '';
    return { nombre, extension };
  }
  
  iconosArchivo: { [key: string]: string } = {
    'pdf': 'pi-file-pdf',
    'excel': 'pi-file-excel',
    'image': 'pi-image',
    'word': 'pi-file-word',
    'archive': 'pi-server',
    'question': 'pi-question',
    'html': 'pi-file'
  };
  
  colorIconExtension: { [key: string]: string } = {
    'pdf': '#D32F2F',
    'excel': '#217346',
    'image': '#4CAF50',
    'word': '#2B579A',
    'archive': '#757575',
    'question': '#FFC107',
    'html': '#4CAF50'
  };
  
  extensionesPorTipo: { [key: string]: string[] } = {
    'pdf': ['pdf'],
    'excel': ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv'],
    'image': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'],
    'word': ['doc', 'docx', 'rtf'],
    'archive': ['zip', 'rar', '7z', 'tar'],
    'html': ['html']
  };
  
  asignarIconArchivo(extension: string): string {
    const tipoArchivo = Object.keys(this.extensionesPorTipo).find(
      tipo => this.extensionesPorTipo[tipo].includes(extension)
    );
  
    if (tipoArchivo) {
      return this.iconosArchivo[tipoArchivo] || '';
    }
  
    return this.iconosArchivo['question'] || '';
  }
  
  colorIconArchivo(extension: string): string {
    const tipoArchivo = Object.keys(this.extensionesPorTipo).find(
      tipo => this.extensionesPorTipo[tipo].includes(extension)
    );
  
    if (tipoArchivo) {
      return this.colorIconExtension[tipoArchivo] || '';
    }
  
    return this.colorIconExtension['question'] || '';
  }
  
  editarRegistro(data: any) {
    this.mensajeSpinner = "Actualizando...";
    console.log('editarRegistro...', data);
    this.setSpinner(true);
  
    let object ={
        idmovasset : data.idmovasset,
        detalleasset : data.descripcion,
    }
    this.comprasService.editarArchivo(object)
    .subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.log('rpta...', rpta);
        this.getListaArchivos();
        
      },
      error: (err) => {
        this.setSpinner(false);
        this.serviceSharedApp.messageToast();
      },
      complete: () => { }
    });
  }

  getValueDescrip(){
    this.descripcion.valueChanges.subscribe(value => {
      if (value.length > 4){
        this.disabUpload = false;
      }
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

  onGrabar(){
    if (this.validarDatos())
      {
          this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
          return;
      }
      const simbmoneda_ = this.lstMonedas.filter((x: any) => x.idmoneda === this.idmoneda)[0].simbmoneda;

      let estado_ = "PEN"

      if (this.listadoArchivos.length > 0) {
        estado_ = "REB"
      }

    const obj = {
      iditempostor: this.idCliente,
      idmoneda : this.idmoneda,
      monto : this.monto,
      simbmoneda:simbmoneda_,
      param : "G",
      comentario: this.descripcion.value,
      estado: estado_
    }
    this.cerrar({...obj }) 
  }

  cerrar(data:any) {
    const objeto = {
      ...data
    }
    this.refDatoItem.close({objeto});
  }

  onSalir(){
    let estado_ = "PEN"

      if (this.listadoArchivos.length > 0) {
        estado_ = "REB"
      }

    const obj = {
      iditempostor: this.idCliente,
      estado: estado_,
      param : "S"
    }
    this.cerrar({...obj }) 
  }

  validarDatos():boolean{
    let _error = false;
    this.errorMensaje="";
    console.log('this.monto', this.monto);
    console.log('this.idmoneda', this.idmoneda);

    if (this.monto === '' || this.monto === null || this.monto === 0)
      {
          this.errorMensaje="Ingresar Monto...!";
          _error = true;
      }

      if (!_error && this.idmoneda === null || this.idmoneda === '')
        {
              this.errorMensaje="Seleccionar Moneda...!";
              _error = true;
        } 
       

    return _error;
    }
      
}