import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { ChatService } from '../service/chat.service';
import { Message, User } from '@interfaces';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatBoxComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    defaultUserId: number = 123;

    message!: Message;

    textContent: string = '';

    uploadedFiles: any[] = [];

    /*emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😇', '😉', '😊', '🙂', '🙃', '😋', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '🤪', '😜', '😝', '😛',
        '🤑', '😎', '🤓', '🧐', '🤠', '🥳', '🤗', '🤡', '😏', '😶', '😐', '😑', '😒', '🙄', '🤨', '🤔', '🤫', '🤭', '🤥', '😳', '😞', '😟', '😠', '😡', '🤬', '😔',
        '😟', '😠', '😡', '🤬', '😔', '😕', '🙁', '😬', '🥺', '😣', '😖', '😫', '😩', '🥱', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '🤤'
    ];*/

    @Input() user!: User;
    blockedDocument: boolean = false;
    mensajeSpinner: string = ""

    constructor(private chatService: ChatService, private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.setMessage();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setSpinner(valor: boolean) {
        this.blockedDocument = valor;
    }

    setMessage() {
        this.setSpinner(true);
        this.mensajeSpinner = 'Cargando Mensajes';
        if (this.user) {
            let filteredMessages = this.user?.messages?.filter(m => m.ownerId !== this.defaultUserId);
            //console.log("filteredMessages : ", JSON.stringify(filteredMessages));
            if (!filteredMessages) {
                this.setSpinner(false);
                return;
            }

            this.message = filteredMessages[filteredMessages.length - 1];
            //console.log("message miky CHATBOX : ", JSON.stringify(this.message));
        }
        this.setSpinner(false);
    }

    sendMessage() {
        this.setSpinner(true);
        if (this.textContent == '' || this.textContent === ' ') {
            this.setSpinner(false);
            return;
        }
        else {
            this.mensajeSpinner = 'Enviando Mensaje';
            let message = {
                text: this.textContent,
                ownerId: 123,
                createdAt: new Date().getTime(),
            }

            this.chatService.sendMessage(message)
            this.obtenerRespuestaOpenAI(this.textContent);
            this.textContent = '';
        }
    }

    obtenerRespuestaOpenAI(consultaSearch: string) {
        const objeto = {
            collectionName: 'documentos3',
            consultaSearch,
            idusuario: 1
        };
        this.mensajeSpinner = 'Procesando Respuesta';
        this.chatService.obtenerRespuestaOpenAI(objeto)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (rpta: any) => {
                    if (!rpta?.message) {
                        this.setSpinner(false);
                        return;
                    }

                    const message = {
                        text: rpta.message.content,
                        ownerId: rpta.message.role,
                        createdAt: new Date().getTime()
                    };

                    this.chatService.sendMessage(message);
                    this.setSpinner(false);
                    this.cdRef.detectChanges();
                },
                error: (err) => { 
                    this.setSpinner(false);
                }
            });
    }

    onEmojiSelect(emoji: string) {
        this.textContent += emoji;
    }

    parseDate(timestamp: number) {
        return new Date(timestamp).toTimeString().split(':').slice(0, 2).join(':');
    }
}
