import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/@core/service/app.layout.service';
import { AuthService } from '../auth.service';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '@localStorage';
import { I_rptaDataLogin } from '@interfaces';
import { mensajesGenericos, moduloAPP } from '@constantes';

@Component({
  selector: 'app-c-login',
  templateUrl: './c-login.component.html',
  styleUrls: ['./c-login.component.scss']
})
export class CLoginComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  frmDatos!: FormGroup;
  rememberMe: boolean = false;

  blockedDocument: boolean = false;
  mensajeSpinner: string = ""

  constructor(
    private fb: FormBuilder,
    protected router: Router,
    private layoutService: LayoutService,
    private messageService: MessageService,
    private authService: AuthService,
    private localStorage: LocalStorageService
  ) {}

  setSpinner(valor: boolean) {
    this.blockedDocument = valor;
  }

  ngOnInit(): void {
    this.createFrm();
  }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  createFrm() {
    this.frmDatos = this.fb.group({
      loginUser: [{value:null, disabled:false}, [Validators.required]],
      claveUser: [{value:null, disabled:false}, [Validators.required]],
      moduloAPP: [{value: moduloAPP, disabled: true}]
    });
  }

  validarLogin(): void {
    this.setSpinner(true);
    this.mensajeSpinner = 'Validando Credenciales...!';

    const $validausuario = this.authService.validausuario(this.frmDatos.getRawValue())
      .subscribe({
        next: (rpta:I_rptaDataLogin) => {
          if(rpta.estado != 1){
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Acceso denegado',
              detail: rpta.mensaje
            })
            return;
          };

          rpta.nombreUsuario = this.frmDatos.get('loginUser')?.value
          this.localStorage.setearLocalStorage(rpta);
          this.router.navigate(['/pages/oportunidades/dashboard'])
        },
        error:(err)=>{
          this.setSpinner(false);
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensajesGenericos.msgErrorGenerico
          })
        },
        complete:() => { }
      });
    this.$listSubcription.push($validausuario)
  }

	get dark(): boolean {
		return this.layoutService.config.colorScheme !== 'light';
	}

}
