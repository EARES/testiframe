import {
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IframeCommunicationService } from './iframe-communication.service';

export interface IframeMessage {
  type: string;
  payload: any;
  source?: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'testiframe';

  @ViewChild('iframeElement') iframeElement!: ElementRef<HTMLIFrameElement>;

  private destroy$ = new Subject<void>();
  private iframeService = inject(IframeCommunicationService);

  ngOnInit(): void {
    this.iframeService
      .getMessages()
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        this.handleIframeMessage(message);
      });
  }

  private handleIframeMessage(message: IframeMessage): void {
    console.log('gelen mesaj:', message.type, message.payload);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
