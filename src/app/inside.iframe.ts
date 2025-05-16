import { Component } from '@angular/core';

@Component({
  selector: 'app-inside-iframe',
  template: `
    <h1>Iframe İçeriği</h1>
    <button (click)="triggerAction()">Aksiyon Gönder</button>
  `,
})
export class InsideIframe {

  triggerAction() {
    window.parent.postMessage(
      {
        type: 'aksiyon',
        data: { id: 123, txt: 'success' },
      },
      '*'
    );
  }
}
