import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {

  constructor(private http: HttpClient) { }

  listar(objeto: any) {
    const url = `${constantesApiWeb.tipocambiolistar}`;
    return this.http.post<any>(url, objeto)
  }

  obtenerPorId(objeto: any) {
    const url = `${constantesApiWeb.tipoCambioTraerUno}`;
    return this.http.post<any>(url, objeto);
  }

  guardarPrc(objeto: any) {
    const url = `${constantesApiWeb.tipoCambioPRC}`;
    return this.http.post<any>(url, objeto)
  }

}