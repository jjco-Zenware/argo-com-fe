import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mensajesQuestion } from '@constantes';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedAppService } from '@sharedAppService';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlmacenService } from '../../service/almacenServices';
import { ProyectosService } from 'src/app/pages/compras/proyectos-ganados/service/proyectos.service';
import { ContabilidadService } from 'src/app/pages/contabilidad/service/contabilidad.services';

@Component({
  selector: 'app-c-grupo',
  templateUrl: './c-grupo.component.html',
  styleUrls: ['./c-grupo.component.scss']
})
export class CGrupoComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
    lstExportar: any[] = [];
    lstExportExcel: any[] = [];
    frmDatos!: FormGroup;
    lstFamilia:any;
    lstSubFamilia:any;
    headerTitle:any;
    grupoVisible: boolean = false;
    claseVisible: boolean = false;
    lstTipoProducto: any[] = [];
    lstTipoProductoTot: any[] = [];
    errorMensaje: string = "";

    lstCtaCtble: any[] = [];
    filteredCtaCtble!:  any[];

    constructor(
        private fb: FormBuilder,
        private utilitariosService: UtilitariosService,
        public dialogService: DialogService  ,  
        private confirmationService: ConfirmationService,  
        private serviceSharedApp: SharedAppService,
        private messageService: MessageService,
        private almacenService: AlmacenService, 
        private proyectosService: ProyectosService,      
                private contabilidadService: ContabilidadService,   
      ){    
        
    }

    ngOnInit(): void{
        this.createFrm();
        this.listarFamilia();
        this.listarPlanContable();
    }

    createFrm(){
        this.frmDatos = this.fb.group({
        idfamilia: [{value: 0,disabled: false}],
        idsubfamilia: [{value: 0,disabled: false}],
        idtipoprod: [{value: 0,disabled: false}] , 
        codfamilia: [{value: '',disabled: false}],
        codsubfamilia: [{value: '',disabled: false}],     
        nomfamilia: [{value: '',disabled: false}],
        nomsubfamilia: [{value: '',disabled: false}],    
        codctactble: [{value: '',disabled: false}],    
        })
      }

    ngOnDestroy(): void {
      if (this.$listSubcription != undefined) {
        this.$listSubcription.forEach((sub) => sub.unsubscribe());
      }
    }

    setSpinner(valor: boolean) {
      this.blockedDocument = valor;
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
  
    getSubFamilia(dato: any) {  
        console.log('getSubFamilia.....', dato);
        this.frmDatos.get('idfamilia')?.setValue(dato);
    this.mensajeSpinner="Cargando...!";
    this.setSpinner(true);

    
    const $getSubFamilia = this.almacenService.listarSubFamilia(dato).subscribe({
        next: (rpta: any) => {
            this.lstSubFamilia = rpta;
            this.setSpinner(false);
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

    listarTipoProducto() {
        const $listarTipoProducto = this.proyectosService.obtenerTipoProducto().subscribe({
          next: (rpta: any) => {
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

    agregarGrupo(){
        this.frmDatos.get('idfamilia')?.setValue(0);

        this.frmDatos.get('codfamilia')?.setValue('');
        this.frmDatos.get('nomfamilia')?.setValue('');
        this.headerTitle="Agregar Grupo";
        this.grupoVisible = true;
    }

    editarGrupo(){
        const codigo = this.frmDatos.value.idfamilia;
        if (codigo === 0 || codigo === null) {
            this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Seleccionar Grupo...!" });
            return;
        }

        this.traerunoFamilia(codigo);
        this.grupoVisible = true;
    }

    agregarClase(){
        const codigo = this.frmDatos.value.idfamilia;
        if (codigo === 0 || codigo === null) {
            this.serviceSharedApp.messageToast({ severity: 'info', summary: 'Validación...', detail: "Seleccionar Grupo...!" });
            return;
        }
        this.listarTipoProducto();
        this.frmDatos.get('idsubfamilia')?.setValue(0);
        this.frmDatos.get('codsubfamilia')?.setValue('');
        this.frmDatos.get('nomsubfamilia')?.setValue('');
        this.frmDatos.get('idtipoprod')?.setValue(0);
        this.frmDatos.get('codctactble')?.setValue('');
        this.filteredCtaCtble = [];

        this.headerTitle="Agregar Categoría";
        this.claseVisible = true;
    }

    editarClase(data:any){
        this.headerTitle="";
        this.frmDatos.get('idsubfamilia')?.setValue(data.idsubfamilia);
        this.traerunoSubFamilia(data.idsubfamilia);        
        this.listarTipoProducto();
        this.claseVisible = true;
    }

    prcGrupo() {
        if (this.validarGrupo())
        {
            this.setSpinner(false);
            this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
            return;
        }

        const $listarFamilia = this.almacenService.prcFamilia(this.frmDatos.value).subscribe({
            next: (rpta: any) => {                
            console.log('prcGrupo...', rpta);

            if (rpta.procesoSwitch === 0){
                this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
                this.grupoVisible = false;
            this.listarFamilia();
              }else{
              this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
              }
            
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

    prcClase() {
        if (this.validarClase())
        {
            this.setSpinner(false);
            this.messageService.add({severity: 'info', summary: 'Aviso', detail: this.errorMensaje });
            return;
        }

        const $listarFamilia = this.almacenService.prcSubFamilia(this.frmDatos.value).subscribe({
            next: (rpta: any) => {                
            console.log('prcClase...', rpta);

            if (rpta.procesoSwitch === 0){
                this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
                this.getSubFamilia(this.frmDatos.value.idfamilia);
                this.claseVisible = false;
              }else{
              this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
              }
            
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

    traerunoFamilia(data:any) {
        const $listarFamilia = this.almacenService.traerunoFamilia(data).subscribe({
            next: (rpta: any) => {
                
            console.log('rpta', rpta);
            this.frmDatos.get('codfamilia')?.setValue(rpta[0].codfamilia);
            this.frmDatos.get('nomfamilia')?.setValue(rpta[0].nomfamilia);
            this.headerTitle= rpta[0].nomfamilia;

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

    traerunoSubFamilia(data:any) {
        const $listarFamilia = this.almacenService.traerunoSubFamilia(data).subscribe({
            next: (rpta: any) => {                    
                console.log('rpta', rpta);
                this.frmDatos.get('codsubfamilia')?.setValue(rpta[0].codsubfamilia);
                this.frmDatos.get('nomsubfamilia')?.setValue(rpta[0].nomsubfamilia);
                this.frmDatos.get('idtipoprod')?.setValue(rpta[0].idtipoprod);
                this.frmDatos.get('codctactble')?.setValue(rpta[0].codctactble);
                this.headerTitle= rpta[0].nomsubfamilia;
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

    validarGrupo():boolean{
        let _error = false;
        this.errorMensaje="";
        console.log('this.formValue...', this.frmDatos.value);

        if (this.frmDatos.value.codfamilia === '' || this.frmDatos.value.codfamilia === null)
        {
            this.errorMensaje="Ingresar Código...!";
            _error = true;
        }

        if (!_error && (this.frmDatos.value.nomfamilia === '' || this.frmDatos.value.nomfamilia === null) )
        {
            this.errorMensaje="Ingresar Descripción...!";
            _error = true;
        }

        return _error;
    }

    validarClase():boolean{
        let _error = false;
        this.errorMensaje="";
        console.log('this.formValue...', this.frmDatos.value);

        if (this.frmDatos.value.codsubfamilia === '' || this.frmDatos.value.codsubfamilia === null)
        {
            this.errorMensaje="Ingresar Código...!";
            _error = true;
        }

        if (!_error && (this.frmDatos.value.nomsubfamilia === '' || this.frmDatos.value.nomsubfamilia === null) )
        {
            this.errorMensaje="Ingresar Descripción...!";
            _error = true;
        }

        if (!_error && (this.frmDatos.value.idtipoprod === null || this.frmDatos.value.idtipoprod === 0) )
        {
            this.errorMensaje="Seleccionar Tipo Producto...!";
            _error = true;
        }
        
        if (!_error && (this.frmDatos.value.codctactble === null || this.frmDatos.value.codctactble === '' || this.frmDatos.value.codctactble === 0 ) )
        {
            this.errorMensaje="Seleccionar Cuenta Contable...!";
            _error = true;
        }

        return _error;
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
        const $listarPlanContable = this.contabilidadService.listarPlanContable()
        .subscribe({
            next: (rpta:any) => {
                this.setSpinner(false);
                console.log('getListar', rpta);
                this.lstCtaCtble = rpta;
            },
            error:(err)=>{
                this.setSpinner(false);
                this.serviceSharedApp.messageToast()
            },
            complete:() => {
            this.setSpinner(false);
            }
        });
        this.$listSubcription.push($listarPlanContable)
    }

    selectCuenta(data : any){
        console.log('selectCuenta', data.codctactble);
        this.frmDatos.value.codctactble = data.codctactble;
    }
}
