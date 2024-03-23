import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-c-cabeceraoc',
  templateUrl: './cabeceraoc.component.html',
  styleUrls: ['./cabeceraoc.component.scss']
})
export class CabeceraocComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    frmDatosCab!: FormGroup;

    constructor(
        private fb: FormBuilder
      ) { }

    ngOnInit(): void {
        this.createFrm();
    }

    ngOnDestroy() {
        if (this.$listSubcription != undefined) {
          this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
      }

      createFrm() {
        this.frmDatosCab = this.fb.group({
          idcotiza: [{ value: 0, disabled: true }],
          fechaingreso: [{ value: '', disabled: true }],
          observacion: [{ value: '', disabled: false }],
        })
      }

}
