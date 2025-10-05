import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesQuestion } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { UtilitariosService } from 'src/app/services/utilitarios.service';
import { CatalogoProductoService } from '../catalogo-producto.service';

@Component({
  selector: 'app-cm-producto-componente',
  templateUrl: './cm-producto-componente.component.html',
  styleUrls: ['./cm-producto-componente.component.scss']
})
export class CmProductoComponenteComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  data:any

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private serviceSharedApp: SharedAppService,
    private serviceUtilitario: UtilitariosService,
    public dialogService: DialogService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private confirmationService: ConfirmationService,
    private serviceCatalogoProducto: CatalogoProductoService
  ) { }

  ngOnInit(): void {
    this.data = this.config.data;
    console.log("data Modal:", this.data);
    this.createFrm();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      codigo: [{ value: this.data.codproducto, disabled: true }],
      id: [{ value: this.data.idprod, disabled: true }],
      producto: [{ value: this.data.despro, disabled: true }],
      familia: [{ value: this.data.nomfamilia, disabled: true }],
      subfamilia: [{ value: this.data.nomsubfamilia, disabled: true }],
      unidad: [{ value: this.data.unidad, disabled: true }],
      cantidad: [{ value: null, disabled: false }, [Validators.required]],
    });
  }

  guardar() {
    this.setSpinner(true);
    this.mensajeSpinner = 'Guardando...!';
    const objeto = {
      idprod: this.data.idProdPadre,
      idprodcomponente: this.data.idprod,
      cantidad: this.frmDatos.get('cantidad')?.value,
      idusuario: constantesLocalStorage.idusuario
    };

    this.serviceCatalogoProducto.productoComponentePRC(objeto).subscribe({
      next: (rpta: any) => {
        this.setSpinner(false);
        if (rpta.procesoSwitch !== 0) {
          this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
          return;
        }
        this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });
        this.ref.close(true);
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
}
