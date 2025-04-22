import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatoTexto'
})
export class FormatoTextoPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    
    let html = this.convertMarkdownToHtml(value);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private convertMarkdownToHtml(text: string): string {
    text = text.replace(/###\s(.+?)\n/g, '<h3>$1</h3>');
    
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    text = text.replace(/^(\d+)\.\s(.+?)(?=\n\d+\.|\n\n|$)/gm, '<li>$2</li>');
    text = text.replace(/<li>.+?<\/li>(?:\n<li>.+?<\/li>)*/g, matches => 
      `<ol>${matches}</ol>`
    );
    
    text = text.replace(/^-\s(.+?)(?=\n-|\n\n|$)/gm, '<li>$1</li>');
    text = text.replace(/<li>.+?<\/li>(?:\n<li>.+?<\/li>)*/g, matches => 
      `<ul>${matches}</ul>`
    );
    
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');
    
    return text;
  }
}