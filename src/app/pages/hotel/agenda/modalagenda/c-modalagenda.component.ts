import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-c-modalagenda',
  templateUrl: './c-modalagenda.component.html'
})
export class CModalAgendaComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  param: any;
  registerFormRegistro!: FormGroup;
  headerTitle?: string;
  submitted?: boolean;  

  constructor(
    public refDatoItem: DynamicDialogRef,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit(): void {
    console.log('ngOnInit...', this.config.data);
    this.createForm();
    this.registerFormRegistro.patchValue(this.config.data[0]);
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createForm() {
    //Agregar validaciones de formulario
    this.registerFormRegistro = this.formBuilder.group({
    cliente: [{ value: null, disabled: false }],
    s_oportunidad: [{ value: null, disabled: false }],
    inicio: [{ value: null, disabled: false }],
    fin :  [{ value: null, disabled: false }],
    nomusuario:  [{ value: null, disabled: false }],
    descripcion:  [{ value: null, disabled: false }],
    horaini :  [{ value: null, disabled: false }],
    horafin :  [{ value: null, disabled: false }],
    });
}
 
}
