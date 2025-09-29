import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[generarUserLogin]'
})
export class GenerarUserLoginDirective {
  @Input() inputText!: string;
  @Output() initialsProcessed = new EventEmitter<string>();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (this.inputText) {
      const words = this.inputText.split(' ');
      let initials = '';

      for (let i = 0; i < words.length; i++) {
        if (i === 0 || i === words.length - 1 || words[i].length > 1) {
          initials += words[i].charAt(0);
        }
      }

      this.el.nativeElement.textContent = initials;
      this.initialsProcessed.emit(initials);
    }
  }
}
