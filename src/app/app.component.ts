import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'testiframe';


constructor() {
    // Ana sayfadan iframe'e mesaj gönderme
    window.parent.postMessage('Merhaba iframe!', '*');

    // Iframe'den ana sayfaya mesaj alma
    window.addEventListener('message', (event) => {
      if (event.origin !== 'http://localhost:4200') {
        return;
      }
      console.log('Ana sayfadan gelen mesaj:', event.data);
    });
  }

  triggerAction() {
   window.parent.postMessage({
        type: 'aksiyon',
        mesaj: 'Butona tıklandı'
      }, '*');

      window.parent.postMessage('Merhaba ana sayfa!', '*');

// Daha yapılandırılmış bir mesaj göndermek isterseniz:
window.parent.postMessage({
  type: 'bildirim',
  mesaj: 'İşlem tamamlandı',
  veri: { id: 123, durum: 'başarılı' }
}, '*');

  }


}
