import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayComponent {
    viewportClass = 'w-full'; // Default class

  setViewport(viewport: string): void {
    switch(viewport) {
      case 'small':
        this.viewportClass = 'w-full sm:w-3/4';
        break;
      case 'medium':
        this.viewportClass = 'w-2/3 md:w-1/2';
        break;
      case 'large':
        this.viewportClass = 'w-1/3 lg:w-1/4';
        break;
      default:
        this.viewportClass = 'w-full';
    }
  }


    e = {
        innerHTML: `
          <div class="bg-white py-24 sm:py-32">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
              <dl class="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                <div class="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt class="text-base/7 text-gray-600">Transactions every 24 hours</dt>
                  <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">44 million</dd>
                </div>
                <div class="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt class="text-base/7 text-gray-600">Assets under holding</dt>
                  <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">$119 trillion</dd>
                </div>
                <div class="mx-auto flex max-w-xs flex-col gap-y-4">
                  <dt class="text-base/7 text-gray-600">New users annually</dt>
                  <dd class="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">46,000</dd>
                </div>
              </dl>
            </div>
          </div>
        `
      };

      iframeContent: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.iframeContent = this.sanitizer.bypassSecurityTrustHtml(this.getIframeContent());
  }

      getIframeContent() {
        return `
          <html>
            <head>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body>
              ${this.e.innerHTML}
            </body>
          </html>
        `;
      }
}
