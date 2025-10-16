import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class CatalogoHabitacionService {

  constructor(private http: HttpClient) { }

  listarhabitacion(objeto: any) {
    const url = `${constantesApiWeb.listarhabitacion}`;
    return this.http.post<any>(url, objeto)
  }

  obtenerItemsTabla(id: number) {
    const url = `${constantesApiWeb.lstItemsTabla}${id}`;
    return this.http.get<any>(url);
  }

  habitacionPrc(objeto: any) {
    const url = `${constantesApiWeb.prcHabitacion}`;
    return this.http.post<any>(url, objeto)
  }

  traerunoHabitacion(codigo: any) {
        const url = `${constantesApiWeb.traerunoHabitacion}${codigo}`;
        return this.http.get<any>(url);
    }

}
