import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ImageViewerService } from '../../core/services/image-viewer.service';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

/** Full-screen lightbox: view any thumbnail at full size and download it. */
@Component({
  selector: 'ui-image-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  host: { '(document:keydown.escape)': 'viewer.close()' },
  template: `
    @if (viewer.url(); as url) {
      <div class="lightbox">
        <button
          type="button"
          class="lightbox__backdrop"
          [attr.aria-label]="t('common.close')"
          (click)="viewer.close()"
        ></button>
        <div class="lightbox__body">
          <img class="lightbox__image" [src]="url" [alt]="t('common.image')" />
          <div class="row lightbox__actions">
            <button type="button" class="ui-btn ui-btn--primary" (click)="download(url)">
              <ui-icon name="download" [size]="16" />
              {{ t('common.download') }}
            </button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="viewer.close()">
              <ui-icon name="close" [size]="16" />
              {{ t('common.close') }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class UiImageViewer extends Translated {
  protected readonly viewer = inject(ImageViewerService);
  private readonly document = inject(DOCUMENT);

  protected download(url: string): void {
    const anchor = this.document.createElement('a');
    anchor.href = url;
    anchor.download = `image-${Date.now()}`;
    anchor.target = '_blank';
    anchor.click();
  }
}
