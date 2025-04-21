import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedAppService } from '@sharedAppService';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService, TreeNode } from 'primeng/api';
import { AlmacenService } from '../service/almacenServices';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { ContabilidadService } from '../../contabilidad/service/contabilidad.services';
@Component({
  selector: 'app-guiaremision',
  templateUrl: './c-guiaremision.component.html'
})
export class CGuiaRemisionComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  @Input() IA_data: any;
  
  registerFormRegistro!: FormGroup;
  lstTipoND: any[] = [];
  onlyRead: boolean = false;

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private serviceUtilitario: UtilitariosService,
    private formBuilder: FormBuilder,
    private contabilidadService: ContabilidadService,  
  ) { }



  ngOnInit(): void {
    console.log('ngOnInit CGuiaRemisionComponent', this.IA_data);
    this.createFormRegistro();
    this.listarItemsTablaSunat();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  get formRegistro() { return this.registerFormRegistro.controls; }

createFormRegistro() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({   
        sustentodoc: [{ value: '', disabled: false }],   
      gre_peso_bruto_total: [{ value: 0, disabled: false }],
      gre_numero_de_bultos: [{ value: 0, disabled: false }],
      gre_tipo_de_transporte: [{ value: '', disabled: false }],
      gre_transportista_documento_tipo: [{ value: '', disabled: false }],
      gre_conductor_documento_tipo: [{ value: '', disabled: false }],
      gre_conductor_documento_numero: [{ value: '', disabled: false }],
      gre_conductor_denominacion: [{ value: '', disabled: false }],
      gre_punto_de_partida_ubigeo: [{ value: '', disabled: false }],
      gre_punto_de_llegada_ubigeo: [{ value: '', disabled: false }],
      gre_fec_ini_traslado: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
      gre_ruc_emp_transporte: [{ value: '', disabled: false }],
      gre_marca_placa_unid_transporte: [{ value: '', disabled: false }],
      gre_punto_partida: [{ value: '', disabled: false }],
      gre_punto_llegada: [{ value: '', disabled: false }],
      gre_motivo_de_traslado: [{ value: '', disabled: false }],
      gre_guia_tipo: [{ value: '', disabled: false }],
      gre_conductor_nombre: [{ value: '', disabled: false }],
      gre_conductor_apellidos: [{ value: '', disabled: false }],
      gre_conductor_numero_licencia: [{ value: '', disabled: false }],
      tipo_igv: [{ value: 0, disabled: false }],
      fel_codmotivo: [{ value: 0, disabled: false }],
      fel_tiponotadebito: [{ value: 0, disabled: false }],
      fel_tipoigv: [{ value: 0, disabled: false }],
    });
  }

  listarItemsTablaSunat() {
    this.contabilidadService.listarItemsTablaSunat(4).subscribe({
        next: (rpta: any) => {
          console.info('listarItemsTablaSunat : ', rpta);
            this.lstTipoND = rpta;
        },
        error: (err) => {
        console.info('error : ', err);
        this.serviceSharedApp.messageToast()
        },
        complete: () => {
        },
    });
  
    }

 
}
