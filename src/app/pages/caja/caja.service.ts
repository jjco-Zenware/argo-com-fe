import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private readonly http: HttpClient) { }

  cajaList(idlocal: number, idaccion?: number) {
    const url = `${constantesApiWeb.cajaList}/${idlocal}/${idaccion}`;
    return this.http.get<any>(url);
  }

  cajaPRC(objeto: any) {
    const url = `${constantesApiWeb.cajaPRC}`;
    return this.http.post<any>(url, objeto);
  }

  cajaDelete(objeto: any) {
    const url = `${constantesApiWeb.cajaDelete}`;
    return this.http.post<any>(url, objeto);
  }

  aperturaCierreCaja(objeto: any) {
    const url = `${constantesApiWeb.aperturaCierreCaja}`;
    return this.http.post<any>(url, objeto);
  }

  cierreCaja(objeto: any) {
    const url = `${constantesApiWeb.cierreCaja}`;
    return this.http.post<any>(url, objeto);
  }

}