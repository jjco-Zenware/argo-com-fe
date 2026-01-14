import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constantesLocalStorage, mensajesSpinner } from '@constantes';
import { Subscription } from 'rxjs';
import { CajaService } from '../../caja.service';
import { SharedAppService } from '@sharedAppService';
import { DialogService, DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cm-mantenimiento-caja',
  templateUrl: './cm-mantenimiento-caja.component.html',
  styleUrls: ['./cm-mantenimiento-caja.component.scss']
})
export class CmMantenimientoCajaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('nombreCaja') nombreCaja!: ElementRef<HTMLTextAreaElement>;

  $listSubcription: Subscription[] = [];
  blockedDocument: boolean = false;
  mensajeSpinner: string = "";
  frmDatos!: FormGroup;
  data: any;

  constructor(
    private readonly fb: FormBuilder,
    public dialogService: DialogService,
    private readonly serviceSharedApp: SharedAppService,
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly serviceCaja: CajaService
  ) { }

  ngOnInit(): void {
    this.data = this.config.data;
    this.createFrm();
    this.getRegistro();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.nombreCaja?.nativeElement) {
        this.nombreCaja.nativeElement.focus();
      }
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      idcaja: [{ value: 0, disabled: false }],
      nomcaja: [{ value: null, disabled: false }, [Validators.required]],
      idlocal: [{ value: constantesLocalStorage.idlocal, disabled: false }],
      idusuario: [{ value: constantesLocalStorage.idusuario, disabled: false }],
    })
  }

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  getRegistro() {
    if (this.data.length === 0) { return; }
    this.frmDatos.patchValue({
      idcaja: this.data.idcaja,
      nomcaja: this.data.nomcaja
    });
  }

  guardar() {
    if (this.frmDatos.invalid) {
      this.frmDatos.markAllAsTouched();
      this.serviceSharedApp.messageToast({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Ingrese el nombre de la caja.',
      });
      return;
    }

    this.setSpinner(true);
    this.mensajeSpinner = mensajesSpinner.msjRecuperaLista
    console.log('this.frmDatos...', this.frmDatos.value);
    const objeto = {
      ...this.frmDatos.value,
    }
    console.log('this.objeto...', objeto);

    const $cajaPRC = this.serviceCaja.cajaPRC(objeto)
      .subscribe({
        next: (rpta: any) => {
          this.serviceSharedApp.messageToast({
            severity: rpta.procesoSwitch === 0 ? 'success' : 'error',
            detail: rpta.mensaje
          });

          if (rpta.procesoSwitch === 0) {
            this.cerrar(true);
          }
        },
        error: (err) => {
          this.setSpinner(false);
          this.serviceSharedApp.messageToast()
        },
        complete: () => {
          this.setSpinner(false);
        }
      });
    this.$listSubcription.push($cajaPRC)
  }

  cerrar(data: any) {
    this.refDatoItem.close({ data });
  }

}