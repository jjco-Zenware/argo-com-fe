import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class CajaService {

  constructor(private readonly http: HttpClient) { }

  cajaList(idlocal: number) {
    const url = `${constantesApiWeb.cajaList}/${idlocal}`;
    return this.http.get<any>(url);
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