import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constantesApiWeb } from '@apiVariables';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  constructor(private http: HttpClient) { }

  listarhabitacion(objeto: any) {
    const url = `${constantesApiWeb.listarhabitacion}`;
    return this.http.post<any>(url, objeto)
  }

  TransferirReservaHabitacion(objeto: any) {
    const url = `${constantesApiWeb.TransferirReservaHabitacion}`;
    return this.http.post<any>(url, objeto)
  }
  
  planingReservasTraer(objeto: any) {
    const url = `${constantesApiWeb.planingReservasTraer}`;
    return this.http.post<any>(url, objeto)
  }

  listarUsuariosAuxHouseKeeping() {
    const url = `${constantesApiWeb.ListarUsuariosAuxHouseKeeping}`;
    return this.http.post<any>(url, [])
  }
  
}