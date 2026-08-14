import { Injectable, signal } from '@angular/core';

/** Holds the image currently opened in the full-size lightbox viewer. */
@Injectable({ providedIn: 'root' })
export class ImageViewerService {
  readonly url = signal<string | null>(null);

  open(url: string): void {
    this.url.set(url);
  }

  close(): void {
    this.url.set(null);
  }
}
