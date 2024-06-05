import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MenuChangeEvent } from './api/menuchangeevent';
import { constantesApiWeb } from '@apiVariables';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    private menuSource = new Subject<MenuChangeEvent>();
    private resetSource = new Subject();

    constructor(private http: HttpClient){

    }

    menuSource$ = this.menuSource.asObservable();
    resetSource$ = this.resetSource.asObservable();

    onMenuStateChange(event: MenuChangeEvent) {
        this.menuSource.next(event);
    }

    reset() {
        this.resetSource.next(true);
    }

    guardarFotoCloudinary(objeto: any) {
        const url = `${constantesApiWeb.fotocloudinary}`;
        return this.http.post<any>(url, objeto);
    }

    TraerUnoUsuario(codigo:number) {
        const url = `${constantesApiWeb.TraerUnoUsuario}${codigo}`;
        return  this.http.get<any>(url)
    }

    GuardarUsuarioPerfil(objeto: any) {
        const url = `${constantesApiWeb.GuardarUsuarioPerfil}`;
        return this.http.post<any>(url, objeto);
    }

    ListarNotificacion(codigo:number) {
        const url = `${constantesApiWeb.ListarNotificacion}${codigo}`;
        return  this.http.get<any>(url)
    }

    notificacionPrc(objeto: any) {
        const url = `${constantesApiWeb.NotificacionPrc}`;
        return this.http.post<any>(url, objeto);
    }

    Cambioclaveuserapp(objeto: any) {
        const url = `${constantesApiWeb.Cambioclaveuserapp}`;
        return this.http.post<any>(url, objeto);
    }
}
