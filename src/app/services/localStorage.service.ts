import { Injectable } from '@angular/core';
import { I_rptaDataLogin } from '@interfaces';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setearLocalStorage(respuestaData: I_rptaDataLogin) {
    console.log('setearLocalStorage', respuestaData );
    localStorage.setItem('ZENWARE_SEG', JSON.stringify(respuestaData));
  }

  limpiar() {
    localStorage.removeItem('ZENWARE_SEG');
  }

  obtenerDataGeneral():I_rptaDataLogin{
    const ZW:any = JSON.parse(localStorage.getItem('ZENWARE_SEG')!);
    return ZW;
  }

  obtenerUsuario(): string {
    return this.obtenerDataGeneral().nombreUsuario??'';
    //return 'ZenWare';
  }

  obtenerLogin(): string {
    //return this.obtenerDataGeneral().login??'';
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
    /*localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');*/
    localStorage.removeItem('ZENWARE_SEG');
  }

}