import { Component, OnDestroy, OnInit,  } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { Cliente } from '@interfaces';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ComprasService } from 'src/app/pages/compras/Service/compraServices';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-c-usuario',
  templateUrl: './c-usuario.component.html',
  styleUrls: ['./c-usuario.component.scss']
})

  export class CUsuarioComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
  
    dataCT:any;
    vistaLista: boolean = true;
    visDetalle: boolean = false;
  
    listaClientes: Cliente[] =[];
    tituloDetalle!: string;
    frmDatos!: FormGroup;
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    cols: any[] = [];
    lstExportar: any[] = [];
  lstExportExcel: any[] = [];
  
    dropdownItemsEstado = [
        { name: 'Registrado', code: 'REG' },
        { name: 'Confirmado', code: 'CFM' },
        { name: 'Aprobado', code: 'APR' },
        { name: 'Rechazado', code: 'RCH' }
    ];
  
    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        private comprasService: ComprasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
      ){  
            
    }

    setSpinner(valor: boolean) {
      this.blockedDocument = valor;
      }
  
    ngOnInit(): void{
      this.getPersona();
      this.cols = [
        { field: 'nombres', header: 'nombres' },
        { field: 'appaterno', header: 'appaterno' },
        { field: 'apmaterno', header: 'apmaterno' },
        { field: 'idtipodoc', header: 'idtipodoc' },
        { field: 'nrodocumento', header: 'nrodocumento' },
        { field: 'nomtipopersona', header: 'nomtipopersona' },
        { field: 'telefresumen', header: 'telefresumen' },
        { field: 'email', header: 'email' },
        { field: 'nomestado', header: 'nomestado' },
    ];
      this.createFrm();
    }
  
    ngOnDestroy(): void {
        if (this.$listSubcription != undefined) {
          this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
      }
  
    createFrm(){
        this.frmDatos = this.fb.group({
            idestado: [
            {
              value: null,
              disabled: false,
            },
          ],idcliente: [
            {
              value: null,
              disabled: false,
            },
          ],idproyecto: [
            {
              value: null,
              disabled: false,
            },
          ],
          fechaini: [
            {
              value: this.utilitariosService.obtenerFechaInicioMes(),
              disabled: false,
            },
          ],
          fechafin: [
            {
              value: this.utilitariosService.obtenerFechaFinMes(),
              disabled: false,
            },
          ],
          idusuario: [
            {
              value: constantesLocalStorage.idusuario,
              disabled: false,
            },
          ],
        })
      }
  
    getPersona() {
      this.setSpinner(true);
      this.mensajeSpinner = mensajesSpinner.msjRecuperaLista

      const objeto = {
          idrolpersona: 'ADM',
          idusuario: constantesLocalStorage.idusuario
      }

      const $getClientes =  this.comprasService.ListaProveedores(objeto).subscribe({
          next: (rpta: any) => {
              this.setSpinner(false);
              console.info('getClientes : ', rpta);
              this.listaClientes = rpta;
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
          this.$listSubcription.push($getClientes);

    }
  
    onVer(data: any) {
        console.log('onVer...', data);
        this.tituloDetalle = "VER EMPLEADO" + data.razonsocial;
        this.vistaLista = false;
        this.visDetalle = true;
    }
  
    EditarCliente(data: any) {
        console.log('EditarCliente...', data);
        this.tituloDetalle = "EDITAR EMPLEADO : " + data.razonsocial;
        this.vistaLista = false;
        this.visDetalle = true;

        this.dataCT = data;
    }

    onNuevo(data: any) {
      console.log('nuevo cliente...',data);
      this.dataCT = data;
      this.tituloDetalle = "REGISTRAR NUEVO EMPLEADO" ;
      this.vistaLista = false;
      this.visDetalle = true;
  }
  
    getDetalle(dato:boolean){
        this.vistaLista = true;
        this.visDetalle = false;
    }
  
    getBack() {
        this.vistaLista = true;
        this.visDetalle = false;
        this.getPersona();
      }

      getActvarDesactivar(dato:any){   
        console.info('getClientes : ', dato);
        let nomactivar = dato.indestado === '1' ? 'DESACTIVAR' : 'ACTIVAR'; 
        

        this.confirmationService.confirm({
          key: 'confirm1',
          header: 'Confirmación',
          //target: event.target || new EventTarget,
          message: '¿Estás seguro de ' + nomactivar + ' el Empleado: '+ '<b>'+ dato.razonsocial +'</b>'+ '?',
          icon: 'pi pi-exclamation-triangle text-xl',
          accept: () => {
            this.activarCliente(dato);  
          }
      }); 
        
      }

    activarCliente(data: any){      
      this.setSpinner(true);
      const objeto = {
        idpersona: data.idcliente,
        idusuario: constantesLocalStorage.idusuario,
        indestado: data.indestado
    }

    const $getClientes =  this.comprasService.activarProveedor(objeto).subscribe({
        next: (rpta: any) => {
            this.setSpinner(false);
            console.info('getClientes : ', rpta);
            if (rpta.procesoSwitch === 0){
              this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje }); 
              this.getPersona(); 
             }else{
              this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
             }
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
        this.$listSubcription.push($getClientes);
    }

    getSeverity(data:any) {
      console.log()
      if (data === '1') {
        return 'success';
      }else{
        return 'warning';
      }
    }

    onVerDetalle(data: any) {
      console.log('onVerDetalle...', data);
          // const refItem = this.dialogService.open(CDetalleFacturaComponent, {
          //   data: data,
          //   header: "Detalle de la Factura N° " + data.nrofactura,
          //   closeOnEscape: false,
          //   styleClass: 'testDialog',
          //   width: '50%'
          // });  
          
          this.setSpinner(true);
        this.mensajeSpinner = 'Descargando Detalle...!';
    
        const objeto = {
          idusuario : constantesLocalStorage.idusuario,
          idpersona: data.idcliente,
        }
    
        const $cargarOrdenC = this.comprasService.descargarInformeEmpleado(objeto).subscribe({
          next: (rpta: any) => {
            this.setSpinner(false);      
            
            const mediaType = 'application/pdf';
              const blob = new Blob([rpta.body], { type: mediaType });
              const filename = 'INFORME-' + data.razonsocial;
      
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

   getExportarExcel(data :any) {
        this.lstExportar = [];
        if (data.filteredValue !== undefined) {
          this.lstExportExcel = data.filteredValue;
        }else{
          this.lstExportExcel = data._value
        }
        
        for (let i = 0; i < this.lstExportExcel.length; i++) {       
            const objeto = {
                'N°': i + 1,
                'NOMBRE': this.lstExportExcel[i].nombres,
                'PATERNO': this.lstExportExcel[i].appaterno,
                'MATERNO': this.lstExportExcel[i].apmaterno,
                'NACIONALIDAD' : this.lstExportExcel[i].desnacionalidad,
                'TIPO DOCUMENTO': this.lstExportExcel[i].idtipodoc,
                'NRO DOCUMENTO' : this.lstExportExcel[i].nrodocumento,
                'ESTADO CIVIL' : this.lstExportExcel[i].desestadocivil,
                'SEXO' : this.lstExportExcel[i].desgenero,
                'CELULAR': this.lstExportExcel[i].telefresumen,
                'DIRECCIÓN': this.lstExportExcel[i].direcresumen,
                'EMAIL': this.lstExportExcel[i].email,
                'CARGO': this.lstExportExcel[i].cargo,
                'DESDE': this.lstExportExcel[i].fecinilaboral,
                'HASTA' : this.lstExportExcel[i].fecfinlaboral,
                'TIP. TRABAJADOR' : this.lstExportExcel[i].destiptrabajador,
                'TIP. CONTRATO' : this.lstExportExcel[i].destipocontrato,
                'CONTACTO EMERG' : this.lstExportExcel[i].adm_contacto_emergencia,
                'CELULAR EMERG' : this.lstExportExcel[i].adm_nrotelef_emergencia,                
            }
            this.lstExportar.push(objeto);
        }
    
        import('xlsx').then((xlsx) => {
          const worksheet = xlsx.utils.json_to_sheet(this.lstExportar);
          const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
          const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
          this.saveAsExcelFile(excelBuffer, 'REGISTRO_EMPLEADOS');
          });
      }
  
      saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
      }
  }
  