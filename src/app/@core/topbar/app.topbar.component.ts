import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MegaMenuItem, MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from '../service/app.layout.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '@localStorage';
import { constantesLocalStorage } from '@constantes';
import { CloudinaryImage } from '@cloudinary/url-gen'
import { environment } from 'src/environments/environment';
import { Notificacion } from '@interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScriptService } from './script.service';
import { MenuService } from '../app.menu.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent implements OnInit, OnDestroy {

    $listSubcription: Subscription[] = [];
    @ViewChild('menuButton') menuButton!: ElementRef;
    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;
    @ViewChild('searchInput') searchInput!: ElementRef;

    activeItem!: number;
    nomUsuario: string = '';
    nomImagen: string = '';
    visible: boolean = false;
    img!: CloudinaryImage;

    uploadedImage = '';
    isDisabled = false;
    uploadedImages: string[] = [];
    cloudName = environment.CLOUD_NAME;
    uploadPreset = environment.UPLOAD_PRESET;
    logoUsuario: String = ''
    visUpload: boolean = false;

    lstNotificacion: Notificacion[] = [];

    nomusuario: string = '';
    url1: string = "";
    email: string = "";
    contraVisible: boolean = false;
    frmDatos!: FormGroup;
    registerFormRegistro: any = FormGroup;
    verBtnKey: boolean = false;
    totNoti: number = 0;

    menuItems: MenuItem[] = [];
    menuItem!: MenuItem;

    constructor(
        public layoutService: LayoutService, 
        public el: ElementRef, 
        private confirmationService: ConfirmationService,
        private localStorageService: LocalStorageService,
        private router: Router, 
        private scriptService: ScriptService,  
        private menuService: MenuService,
        private messageService: MessageService,
        private fb: FormBuilder,) {

        this.nomUsuario = constantesLocalStorage.nombreUsuario;
        this.nomImagen = constantesLocalStorage.imagen;
        this.logoUsuario = constantesLocalStorage.imagen; 
        this.scriptService.load('uw');
    }

    get formRegistro() { return this.registerFormRegistro.controls; }

    ngOnInit(): void {
        this.listarNotificaciones();
        this.createFrm();
    }

    createFrm() {
        this.registerFormRegistro = this.fb.group({
            passActual: [{value:null, disabled:false}, [Validators.required]],
            passNueva: [{value:null, disabled:false}, [Validators.required]],
            passConfir: [{value:null, disabled:false}, [Validators.required]],
        });
      }     
     
    ngOnDestroy() {
        if (this.$listSubcription != undefined) {
          this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
    }

    get mobileTopbarActive(): boolean {
        return this.layoutService.state.topbarMenuActive;
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onRightMenuButtonClick() {
        this.layoutService.openRightSidebar();
    }

    onMobileTopbarMenuButtonClick() {
        this.layoutService.onTopbarMenuToggle();
    }

    focusSearchInput(){
       setTimeout(() => {
         this.searchInput.nativeElement.focus()
       }, 0);
    }

    logOff() {
        this.confirmationService.confirm({
            key: 'confirm1',
            header: 'Confirmación',
            message: '¿Estás seguro de Cerrar sesión?',
            acceptLabel: 'Si',
            rejectLabel: 'No',
            rejectButtonStyleClass:'modalBtnRed',
            acceptButtonStyleClass:'modalBtnGreen',
            accept: () => {
                this.localStorageService.limpiar();
                this.router.navigate(['/']);
            }
        });
    }

    verPerfil() {        
        const verPerfil = this.menuService.TraerUnoUsuario(constantesLocalStorage.idusuario)
            .subscribe({
                next: (rpta:any) => {
                    console.log("verPerfil : ", rpta);
                    //this._usuario = rpta.nomusuario;;
                    this.nomusuario = rpta.nomusuario;
                    this.email = rpta.email;

                    if (rpta.tipoacceso !== "M") {
                        this.verBtnKey = false;
                    }else {
                        this.verBtnKey = true;
                    }                   
                    
                    this.visible = true
                },
                error:(err)=>{
                    console.error('error : ',err)
                    
                },
                complete:() => { }
            });
        this.$listSubcription.push(verPerfil)
    }

    guardarUsuarioPerfil(){
        const objeto = {
            idUsuario: constantesLocalStorage.idusuario,
            nomusuario: this.nomusuario,
            url1: this.url1,
            imagen: this.logoUsuario
        }

        const guardarUsuarioPerfil = this.menuService.GuardarUsuarioPerfil(objeto)
            .subscribe({
                next: (rpta:any) => {
                    console.log("guardarUsuarioPerfil : ", rpta);

                    if (rpta.procesoSwitch == 0){
                        this.messageService.add({severity: 'success', detail: rpta.mensaje });
                        this.nomUsuario = this.nomusuario;
                        this.visible = false;
                        }else{
                            this.messageService.add({severity: 'error', detail: rpta.mensaje });
                        }
                                     
                    
                },
                error:(err)=>{
                    console.error('error : ',err)                    
                },
                complete:() => { }
            });
        this.$listSubcription.push(guardarUsuarioPerfil)
    }

    uploadWidget = (): void => {
        this.visUpload = true;
        this.isDisabled = true;
        console.log("processResults cloudName : ", this.cloudName);
        console.log("processResults uploadPreset : ", this.uploadPreset);

        window.cloudinary.openUploadWidget(
            {
                cloudName: this.cloudName,
                uploadPreset: this.uploadPreset,
                sources: ['local', 'url'],
                tags: ['zenware-avatar'],
                clientAllowedFormats: ['image'],
                resourceType: 'image',
                multiple: false,
            },
            this.processResults
        );
    };

    processResults = (error: any, result: any): void => {
        console.log("processResults error : ", error);
        console.log("processResults result : ", result);

        if (result.event === 'close') {
            this.isDisabled = false;
        }
        if (result && result.event === 'success') {
            const secureUrl = result.info.secure_url;
            console.log("secureUrl : ", secureUrl);
            const previewUrl = secureUrl.replace('/upload/', '/upload/w_400/');
            this.uploadedImages.push(previewUrl);
            this.isDisabled = false;
            this.logoUsuario = secureUrl;
            console.log("logoUsuario : ", this.logoUsuario);
            //this.guardarFoto()
        }
        if (error) {
            this.isDisabled = false;
        }
        this.visUpload = false;
    };

    guardarFoto(){
        const objeto = {
            idUsuario: constantesLocalStorage.idusuario,
            urlFoto: this.logoUsuario
        }
        const guardarFotoCloudinary = this.menuService.guardarFotoCloudinary(objeto)
            .subscribe({
                next: (rpta:any) => {
                    console.log("guardarFotoCloudinary : ", rpta);
                    
                },
                error:(err)=>{
                    console.error('error : ',err)
                    
                },
                complete:() => { }
            });
        this.$listSubcription.push(guardarFotoCloudinary)
    }

    listarNotificaciones(){        
        const listarNotificaciones = this.menuService.ListarNotificacion(constantesLocalStorage.idusuario)
            .subscribe({
                next: (rpta:any) => {
                    console.log("listarNotificaciones : ", rpta);
                    this.lstNotificacion = rpta;
                    this.totNoti = rpta.length;
                },
                error:(err)=>{
                    console.error('error : ',err)                    
                },
                complete:() => { }
            });
        this.$listSubcription.push(listarNotificaciones)
    }

    cambiarContrasena(){
        this.contraVisible = true;
        console.log('cambiarContrasena');
    }
    
    grabarContrasena(){ 
        console.log('grabarContrasena', this.formRegistro.invalid);
        if (this.formRegistro.passActual.value === null) {
            this.messageService.add({severity: 'info', summary: 'Validación', detail: "Ingresar Contraseña Actual...!" });
            return;
        }
        if (this.formRegistro.passNueva.value === null || this.formRegistro.passConfir.value === null) {
            this.messageService.add({severity: 'info', summary: 'Validación', detail: "Ingresar Contraseña Nueva ó Confirmar...!" });
            return;
        }

        if (this.formRegistro.passConfir.value !== this.formRegistro.passNueva.value)
        {
            this.messageService.add({severity: 'info', summary: 'Validación', detail: "Las Nuevas Contraseñas no coinciden" });
            return;
        }

        const objeto = {
            idUsuario: constantesLocalStorage.idusuario,
            claveoriginal: this.formRegistro.passActual.value,
            clavenueva: this.formRegistro.passNueva.value,
        }
        

        console.log('grabarContraseña', objeto);

        const grabarContrasena = this.menuService.Cambioclaveuserapp(objeto)
            .subscribe({
                next: (rpta:any) => {
                    console.log("grabarContrasena : ", rpta);

                    if (rpta.procesoSwitch == 0){
                        this.messageService.add({severity: 'success', detail: rpta.mensaje });
                        this.nomUsuario = this.nomusuario;
                        this.contraVisible = false;
                        }else{
                            this.messageService.add({severity: 'error', detail: rpta.mensaje });
                        }
                                     
                    
                },
                error:(err)=>{
                    console.error('error : ',err)                    
                },
                complete:() => { }
            });
        this.$listSubcription.push(grabarContrasena)
    }

    deleteNotificacion(data: any){
        this.confirmationService.confirm({
            key: 'confirm1',
            header: 'Confirmación',
            message: '¿Desea Descartar la Notificación '+ '<b>'+ data.msgnotifica +'</b>'+ '?',
            acceptLabel: 'Si',
            rejectLabel: 'No',
            rejectButtonStyleClass:'modalBtnRed',
            acceptButtonStyleClass:'modalBtnGreen',
            accept: () => {
                this.prcNotificacion(data);
            }
        });
    }

    prcNotificacion(data: any){  
        console.log('prcNotificacion...',data);      
        const objeto = {
            idusuario: constantesLocalStorage.idusuario,
            idnotificacion: data.idnotifica,
        }
        const prcNotificacion = this.menuService.notificacionPrc(objeto)
            .subscribe({
                next: (rpta:any) => {
                    console.log("prcNotificacion : ", rpta);
                    if (rpta.procesoSwitch === 0){                        
                        this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje });  
                        this.listarNotificaciones();                   
                    }else{
                        this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
                    }
                },
                error:(err)=>{
                    console.error('error : ',err)                    
                },
                complete:() => { }
            });
        this.$listSubcription.push(prcNotificacion)
    }    
}
