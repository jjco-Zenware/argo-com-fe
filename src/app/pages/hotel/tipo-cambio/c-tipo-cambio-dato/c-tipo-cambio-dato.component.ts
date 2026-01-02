import { Component, OnDestroy, OnInit } from '@angular/core';
import { TipoCambioService } from '../tipo-cambio.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';

@Component({
  selector: 'app-c-tipo-cambio-dato',
  templateUrl: './c-tipo-cambio-dato.component.html',
  styleUrls: ['./c-tipo-cambio-dato.component.scss']
})
export class CTipoCambioDatoComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  frmDatos!: FormGroup;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly messageService: MessageService,
    private readonly formBuilder: FormBuilder,
    private readonly service: TipoCambioService,
    private readonly serviceUtilitario: UtilitariosService,
    private readonly serviceSharedApp: SharedAppService,
  ) { }


  ngOnInit(): void {
    this.param = this.config.data;
    console.log('this.param ...', this.param);
    this.createForm();
    this.traerUno();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  createForm() {
    this.frmDatos = this.formBuilder.group({
      codtipocmb: [{ value: "TRX", disabled: false }],
      idmoneda: [{ value: 2, disabled: false }],
      fectc: [{ value: this.serviceUtilitario.obtenerFechaActual(), disabled: false }],
      valorfijo: [{ value: null, disabled: false }],
      valorcompra: [{ value: null, disabled: false }],
      valorventa: [{ value: null, disabled: false }],
      valmincompra: [{ value: null, disabled: false }],
      valmaxventa: [{ value: null, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    });
  }

  traerUno() {
    if(this.param.fechaTipoCmb === null) { return; }
    this.setSpinner(true);
    this.mensajeSpinner = 'Cargando...!';
    const objeto = {
      codtipocmb: "TRX",
      fectc: this.param.fechaTipoCmb,
      idmoneda: 2
    }

    const $obtenerPorId = this.service.obtenerPorId(objeto)
      .subscribe({
        next: (rpta: any) => {
          console.log('rpta obtenerPorId: ', rpta);
          this.setSpinner(false);
          this.frmDatos.patchValue(rpta[0]);
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);

        }
      });
    this.$listSubcription.push($obtenerPorId)
  }

  guardar() {
    if (this.frmDatos.invalid) {
      this.setSpinner(false);
      this.messageService.add({ severity: 'info', summary: 'Aviso', detail: "Complete los datos requeridos" });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = "Guardando...!";


    const objeto = {
      ...this.frmDatos.getRawValue(),
      fectc: new Date(this.frmDatos.value.fectc)
    };
    console.log('objeto...', objeto);
    const $guardar = this.service.guardarPrc(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        console.log("rpta guardarPrc : ", rpta);
        if (rpta.procesoSwitch === 0) {
          this.messageService.add({ severity: 'success', detail: "Operación exitosa" });
          this.cerrar(true);
        } else {
          this.messageService.add({ severity: 'error', detail: rpta.mensaje });
        }
      },
      error: (err) => {
        this.setSpinner(false);
        console.error('error : ', err)
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensajesQuestion.msgErrorGenerico
        })
      },
      complete: () => {
        this.setSpinner(false);
      }
    });
    this.$listSubcription.push($guardar);

  }

  cerrar(proceso: boolean) {
    this.ref.close({ proceso });
  }

}