import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { TipoCambioService } from '../tipo-cambio.service';
import { CTipoCambioDatoComponent } from '../c-tipo-cambio-dato/c-tipo-cambio-dato.component';

@Component({
  selector: 'app-c-tipo-cambio',
  templateUrl: './c-tipo-cambio.component.html',
  styleUrls: ['./c-tipo-cambio.component.scss']
})
export class CTipoCambioComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  cols: any[] = [];
  frmDatos!: FormGroup;
  listado: any[] = [];

  constructor(
    private fb: FormBuilder,
    private utilitariosService: UtilitariosService,
    public dialogService: DialogService,
    private serviceSharedApp: SharedAppService,
    private messageService: MessageService,
    private service: TipoCambioService
  ) {
  }

  ngOnInit(): void {
    this.createFrm();
    this.getListar();
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      fecini: [{ value: this.utilitariosService.obtenerFechaInicioMes(), disabled: false }],
      fecfin: [{ value: this.utilitariosService.obtenerFechaFinMes(), disabled: false }],
      codtipocmb: [{ value: "TRX", disabled: false }],
      idmoneda: [{ value: 2, disabled: false }],
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

  getListar() {
    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    const objeto =
    {
      ...this.frmDatos.getRawValue(),
    }
    const $listar = this.service.listar(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.setSpinner(false);
          console.log('rpta listar', rpta);
          this.listado = rpta;
        },
        error: (err) => {
          console.log('err 02', err);

          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($listar)
  }

  getRegistro(fechaTipoCmb: any) {
    const refItem = this.dialogService.open(CTipoCambioDatoComponent, {      
      data: {fechaTipoCmb},
      header: fechaTipoCmb === null? "Agregar Tipo de Cambio" : "Editar Tipo de Cambio",
      closeOnEscape: false,
      styleClass: 'testDialog',
      width: '40%'
    });
    refItem.onClose.subscribe((rpta: any) => {
      this.getListar();
      console.log('onClose',rpta);
    });
  }

}