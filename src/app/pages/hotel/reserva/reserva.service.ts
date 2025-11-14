import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  constructor(private http: HttpClient) { }

  listarPAX(objeto: any) {
    const url = `${constantesApiWeb.listarPAX}`;
    return this.http.post<any>(url, objeto)
  }

  registrarPaxPRC(objeto: any) {
    const url = `${constantesApiWeb.registrarPaxPRC}`;
    return this.http.post<any>(url, objeto)
  }

  eliminarPaxDel(objeto: any) {
    const url = `${constantesApiWeb.eliminarPaxDel}`;
    return this.http.post<any>(url, objeto)
  }

  personaTraerUnoTipoDoc(objeto: any) {
    const url = `${constantesApiWeb.personaTraerUnoTipoDoc}`;
    return this.http.post<any>(url, objeto)
  }

  listarHabitacionesCombo(objeto: any) {
    const url = `${constantesApiWeb.listarHabitacionesCombo}`;
    return this.http.post<any>(url, objeto)
  }

  listartipodocumentotablasunat(tipoPersona: string) {
    const url = `${constantesApiWeb.listartipodocumentotablasunat}${tipoPersona}`;
    return this.http.get<any>(url)
  }
}
