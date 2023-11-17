import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';
import { I_rptaDataLogin } from '@interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http : HttpClient) { }

  validausuario(objeto:any) {
    const url = `${constantesApiWeb.validausuario}`;
    return  this.http.post<I_rptaDataLogin>(url, objeto);
  }

  validaNombreUsuario(objeto:any) {
    const url = `${constantesApiWeb.validaNombreUsuario}`;
    return  this.http.post<I_rptaDataLogin>(url, objeto);
  }

  obtenerMenu(codUsuario:number) {
    const url = `${constantesApiWeb.opcionesperfilusuario}/${codUsuario}`;
    return  this.http.get<I_rptaDataLogin>(url);
  }

  validarloginAzure(objeto:any) {
    const url = `${constantesApiWeb.validarloginAzure}`;
    return  this.http.post<I_rptaDataLogin>(url, objeto);
  }
}
