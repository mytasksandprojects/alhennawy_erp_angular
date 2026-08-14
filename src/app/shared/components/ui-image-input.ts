import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  fileEntryHref,
  fileEntryName,
  IMAGE_LIST_SEPARATOR,
  splitImageList,
} from '../../core/models/common.models';
import { ImageViewerService } from '../../core/services/image-viewer.service';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Multi-attachment field: attach any number of images (or, in `files`
 * mode, documents of any type) by uploading or pasting links. Value is
 * a `|`-joined URL list; file entries carry their name as `#fragment`.
 */
@Component({
  selector: 'ui-image-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    <div class="image-input">
      @if (urls().length) {
        <div class="image-input__list">
          @for (url of urls(); track $index) {
            <span class="image-input__item">
              @if (kind() === 'files') {
                <button
                  type="button"
                  class="ui-btn ui-btn--ghost image-input__file"
                  (click)="downloadFile(url, $index)"
                >
                  <ui-icon name="document" [size]="14" />
                  {{ fileLabel(url, $index) }}
                </button>
              } @else {
                <button
                  type="button"
                  class="ui-table__thumb-btn"
                  [attr.aria-label]="t('common.viewImage')"
                  (click)="viewer.open(url)"
                >
                  <img class="ui-table__thumb" [src]="url" [alt]="t('common.image')" />
                </button>
              }
              <button
                type="button"
                class="image-input__remove"
                [attr.aria-label]="t('common.delete')"
                (click)="remove($index)"
              >
                <ui-icon name="close" [size]="10" />
              </button>
            </span>
          }
        </div>
      }
      <div class="row image-input__controls">
        <input
          class="ui-control"
          type="text"
          [placeholder]="t(kind() === 'files' ? 'common.fileLinkHint' : 'common.imageLinkHint')"
          [value]="pending()"
          (input)="pending.set($any($event.target).value)"
          (keydown.enter)="$event.preventDefault(); addLink()"
        />
        <button
          type="button"
          class="ui-btn ui-btn--ghost"
          [disabled]="!pending().trim()"
          (click)="addLink()"
        >
          <ui-icon name="plus" [size]="14" />
          {{ t('common.addLink') }}
        </button>
        <input
          #filePicker
          type="file"
          [attr.accept]="kind() === 'files' ? null : 'image/*'"
          multiple
          hidden
          (change)="addFiles(filePicker)"
        />
        <button type="button" class="ui-btn ui-btn--ghost" (click)="filePicker.click()">
          <ui-icon name="upload" [size]="14" />
          {{ t(kind() === 'files' ? 'common.uploadFiles' : 'common.uploadImages') }}
        </button>
      </div>
    </div>
  `,
})
export class UiImageInput extends Translated {
  readonly value = input('');
  readonly kind = input<'images' | 'files'>('images');
  readonly valueChange = output<string>();
  protected readonly viewer = inject(ImageViewerService);
  private readonly document = inject(DOCUMENT);

  protected readonly pending = signal('');
  protected readonly urls = computed(() => splitImageList(this.value()));

  protected fileLabel(url: string, index: number): string {
    return fileEntryName(url) || `${this.t('common.file')} ${this.fmtNum(index + 1)}`;
  }

  protected downloadFile(url: string, index: number): void {
    const anchor = this.document.createElement('a');
    anchor.href = fileEntryHref(url);
    anchor.download = this.fileLabel(url, index);
    anchor.target = '_blank';
    anchor.click();
  }

  protected addLink(): void {
    const url = this.pending().trim();
    if (!url) return;
    this.pending.set('');
    this.emitUrls([...this.urls(), url]);
  }

  protected addFiles(picker: HTMLInputElement): void {
    const files = Array.from(picker.files ?? []);
    picker.value = '';
    if (!files.length) return;
    Promise.all(
      files.map((file) =>
        readAsDataUrl(file).then((dataUrl) =>
          this.kind() === 'files'
            ? `${dataUrl}#${encodeURIComponent(file.name)}`
            : dataUrl,
        ),
      ),
    ).then((entries) => this.emitUrls([...this.urls(), ...entries]));
  }

  protected remove(index: number): void {
    this.emitUrls(this.urls().filter((_, i) => i !== index));
  }

  private emitUrls(urls: string[]): void {
    this.valueChange.emit(urls.join(IMAGE_LIST_SEPARATOR));
  }
}
