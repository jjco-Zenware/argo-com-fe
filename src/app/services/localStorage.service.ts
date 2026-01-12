import { Injectable } from '@angular/core';
import { I_rptaDataLogin } from '@interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setearLocalStorage(respuestaData: I_rptaDataLogin) {
    console.log('setearLocalStorage', respuestaData );
    localStorage.setItem('HR_HUASCARAN', JSON.stringify(respuestaData));
  }

  limpiar() {
    localStorage.removeItem('HR_HUASCARAN');
  }

  obtenerDataGeneral():I_rptaDataLogin{
    const ZW:any = JSON.parse(localStorage.getItem('HR_HUASCARAN')!);
    return ZW;
  }

  obtenerUsuario(): string {
    return this.obtenerDataGeneral().nombreUsuario??'';
  }

  obtenerLogin(): string {
    return 'HR Huascaran';
  }

  obtenerToken():string {
    return this.obtenerDataGeneral().token??'';
  }

  estaLogueado():boolean {
    let nombUser: string = this.obtenerUsuario();
    let _tokUser: string = this.obtenerToken();
    return (nombUser != null && nombUser.length > 0 && _tokUser != null && _tokUser.length > 5) ? true : false;
  }

  logout() {
    localStorage.removeItem('HR_HUASCARAN');
  }

}