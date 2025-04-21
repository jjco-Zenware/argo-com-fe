import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output, OnDestroy } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { constantesLocalStorage, mensajesQuestion, mensajesSpinner } from '@constantes';
import { SharedAppService } from '@sharedAppService';
import { Subscription } from 'rxjs';
import { MarketingService } from '../../service/marketingServices';
import { eventoCard, eventoList } from '@interfaces';

@Component({
    selector: 'c-evento-list',
    templateUrl: './c-evento-list.component.html',
    styleUrls: ['./c-evento-list.component.scss']
})
export class CEventoListComponent implements OnInit, OnDestroy{

    $listSubcription: Subscription[] = [];
    @Input() list!: eventoList;
    @Input() listIds!: string[];

    @Output() actualizarEvento = new EventEmitter<string>();    
    @Output() verEventos = new EventEmitter<any>();
    title: string = '';
    timeout: any = null;
    isMobileDevice: boolean = false;
    @ViewChild('inputEl') inputEl!: ElementRef;
    @ViewChild('listEl') listEl!: ElementRef;
    //selectedKanbanCards: KanbanCard[] = [];
    blockedDocument: boolean = false;
    mensajeSpinner: string = "";
   
    setSpinner(valor: boolean) {
    this.blockedDocument = valor;
    }

    constructor(
        private marketingService: MarketingService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private serviceSharedApp: SharedAppService,
        ) {
        }

    ngOnInit(): void {
        
    }

    onCardClick(event: Event, card: eventoCard) {
        console.log('onCardClick...', card);
        this.verEventos.emit(card);
        const eventTarget = event.target as HTMLElement;
        // if (!(eventTarget.classList.contains('p-button-icon') || eventTarget.classList.contains('p-trigger'))) {
        //     if (card.id == "0") {
        //         if (this.list.listId) {
        //             this.kanbanService.onCardSelect(card, this.list.listId);
        //         }
        //         this.parent.sidebarVisible = true;
        //     }else{
        //         if (this.list.listId) {
        //             this.setSpinner(true);
        //             this.mensajeSpinner = mensajesSpinner.msjRecuperaRegistro
        //             let idoportunidad = card.id;
        //             this.kanbanService.onCardSeleccionar(idoportunidad, this.list.listId).subscribe({
        //                 next: (rpta: any) => {
        //                     this.setSpinner(false);
        //                 this.parent.sidebarVisible = true;
        //                 },
        //                     error: (err) => {
        //                         this.setSpinner(false);
        //                     console.info('error : ', err);
        //                     this.messageService.clear();
        //                     this.messageService.add({
        //                         severity: 'error',
        //                         summary: 'Error',
        //                         detail: mensajesQuestion.msgErrorGenerico,
        //                     });
        //                 },
        //                     complete: () => {
        //                 },
        //             });
        //         }
        //     }

        // }
    }

    insertCard() {
        // if (this.list.listId) {
        //     //console.log('Insertar...', this.list);
        //     this.kanbanService.addCard(this.list.listId);
        //     this.parent.sidebarVisible = true;
        // }
    }

    mostrarCard(){
        // this.kanbanService.addCard(this.list.listId);
        // this.parent.sidebarVisible = true;
    }

    dropCard(event: CdkDragDrop<any[]>): void {

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

            let lstData = event.container.data;
            for (let i = 0; i < lstData.length; i++) {
                if (i === event.currentIndex) {

                    console.log('event.container', event.container);
                    const objeto = {
                        idusuario: constantesLocalStorage.idusuario,
                        idlistadestino: event.container.id,
                        idevento: lstData[i].id
                    }

                    const $procesarTrxEvento = this.marketingService.procesarTrxEvento(objeto).subscribe({
                        next: (rpta: any) => {
                            console.log('procesarTrxEvento', rpta);
                            if (rpta.procesoSwitch == 1) {
                                if (event.container.id === "9") {
                                    this.generarCodigo(event.container.data[0]);
                                }
                                this.actualizarEvento.emit();
                            }

                            this.serviceSharedApp.messageToast({
                                severity: rpta.procesoSwitch == "0" ? 'success' : 'warn',
                                summary: rpta.procesoSwitch == "0" ? 'Exito' : 'Warning',
                                detail: rpta.mensaje
                            });
                            
                        },
                        error: (err) => {
                            console.error('error : ', err);
                            this.serviceSharedApp.messageToast();
                        },
                        complete: () => { },
                    });
                    this.$listSubcription.push($procesarTrxEvento)
                }
            }
        }
    }

    focus() {
        this.timeout = setTimeout(() => this.inputEl.nativeElement.focus(), 1);
    }

    insertHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '10rem';
    }

    removeHeight(event: any) {
        event.container.element.nativeElement.style.minHeight = '2rem';
    }

    ngOnDestroy() {
        if (this.$listSubcription != undefined) {
            this.$listSubcription.forEach((sub) => sub.unsubscribe());
        }
    }

    generarCodigo(data: any){
        const objeto = {
            idtipoproyecto: 6,
            idoportunidad: data.id,
            idrequerimiento: 0,
            nomproyecto: data.title,
            descripcion: data.razonsocial,
            idusuario: constantesLocalStorage.idusuario,
            idcentrocosto: 325
        }
        console.log('objeto...', objeto);
        this.marketingService.newProyecto(objeto).subscribe({
            next: (rpta: any) => {
                console.log('generarCodigo...', rpta);
                // if (rpta.procesoSwitch === 0){
                //     this.messageService.add({ severity: 'success', summary: 'OK...', detail: rpta.mensaje }); 
                    
                //   }else{
                //   this.messageService.add({ severity: 'error', summary: 'Error...', detail: rpta.mensaje });
                //   }
            },
            error: (err) => {
            console.info('error : ', err);
            this.serviceSharedApp.messageToast()
            },
            complete: () => {
            },
        });
    }

}
