import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { mensajesGenericos, moduloAPP, tipoAcceso } from '@constantes';
import { I_rptaDataLogin } from '@interfaces';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { AccountInfo, PublicClientApplication } from '@azure/msal-browser';
import { LocalStorageService } from '@localStorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-c-auth-usuario',
  templateUrl: './c-auth-usuario.component.html',
  styleUrls: ['./c-auth-usuario.component.scss']
})
export class CAuthUsuarioComponent implements OnInit, OnDestroy {
  $listSubcription: Subscription[] = [];
  @Output() OB_pass = new EventEmitter<boolean>();
  @Output() OS_nombreUser = new EventEmitter<string>();  
  loginUser: FormControl = new FormControl({ value: null, disabled: false }, [Validators.required]);
  isLoading: boolean = false;
  msalInstance:any;
  _homeAccountId:string = '';

  constructor(
    protected router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void { }

  ngOnDestroy() {
    if (this.$listSubcription != undefined) {
      this.$listSubcription.forEach((sub) => sub.unsubscribe());
    }
  }

  validaNombreUsuario(): void {
    this.isLoading = true;

    const $validaNombreUsuario = this.authService.validaNombreUsuario({ loginUser: this.loginUser.value, moduloAPP })
      .subscribe({
        next: (rpta: I_rptaDataLogin) => {
          this.isLoading = false;
          if (rpta.estado != 1) {
            this.messageService.clear();
            this.messageService.add({
              severity: 'error',
              summary: 'Acceso denegado',
              detail: rpta.mensaje
            })
            return;
          };
          if (rpta.tipoacceso == tipoAcceso.azure) {
            this.loginAzure();
          } else {
            this.OB_pass.emit(true);
            this.OS_nombreUser.emit(this.loginUser.value)
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensajesGenericos.msgErrorGenerico
          })
        },
        complete: () => { }
      });
    this.$listSubcription.push($validaNombreUsuario)
  }

  async loginAzure() {
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: 'b65e275c-ca73-4aac-b3e3-fd74c0658fd8',
        authority: 'https://login.microsoftonline.com/02157777-a391-40f4-b293-125e2aee9f72',
        //postLogoutRedirectUri: 'http://localhost:4200/',
      },
      system: {
        allowNativeBroker: true,
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true,
      }
    });

    try {
      await this.msalInstance.initialize();
      const _login = await this.msalInstance.loginPopup();
      //console.log("_login : ", _login);
      this.msalInstance.setActiveAccount(_login.account);
      const _acquireToken = await this.msalInstance.acquireTokenSilent({
        scopes: ["email", "openid", "profile", "User.Read"]
      });
      //console.log("_acquireToken : ", _acquireToken);
      
      const cuentaUsuario: AccountInfo = this.msalInstance.getAccountByHomeId(_acquireToken.account.homeAccountId)!;
      const {idToken, homeAccountId, name, username} = cuentaUsuario;
      //console.log("cuentaUsuario : ", cuentaUsuario);
      this._homeAccountId = homeAccountId
      this.validarloginAzure(name, username);
    } catch (error) {
      console.log("error : ", error);
    }
  }

  validarloginAzure(nombreUser:string|undefined, emailUser:string){
    debugger;
    const $validarloginAzure = this.authService.validarloginAzure({ loginUser: this.loginUser.value, nombreUser: nombreUser, emailUser: emailUser, moduloAPP})
    .subscribe({
      next: (rpta: I_rptaDataLogin) => {
        debugger;
        this.isLoading = false;
        if (rpta.estado != 1) {
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Acceso denegado',
            detail: rpta.mensaje
          })
          this.logoutAzure();
          return;
        };
        if (rpta.idusuario == 0){
          this.messageService.clear();
          this.messageService.add({
            severity: 'error',
            summary: 'Usuario/Email denegado',
            detail: rpta.mensaje
          })
          this.logoutAzure();
          return;
        }
        rpta.nombreUsuario = this.loginUser.value
        this.localStorage.setearLocalStorage(rpta);
        this.isLoading = false;
        this.router.navigate(['/pages/dashboard'])
      },
      error: (err) => {
        this.logoutAzure();
        this.isLoading = false;
        this.messageService.clear();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: mensajesGenericos.msgErrorGenerico
        })
      },
      complete: () => { }
    });
  this.$listSubcription.push($validarloginAzure)
  }

  async logoutAzure() {
    try {
      const currentAccount = this.msalInstance.getAccountByHomeId(this._homeAccountId);
      const logoutRed = await this.msalInstance.logoutPopup({ 
        account: currentAccount,
        postLogoutRedirectUri: 'http://localhost:4200/'
      });
      //console.log("logoutRed : ", logoutRed);
      
    } catch (error) {
      //console.error("Error al cerrar la sesión: ", error);
    }
  }
}
