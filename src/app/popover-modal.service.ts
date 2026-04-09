import { Injectable, ElementRef } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DetailOverlayComponent } from './detail-overlay/detail-overlay.component';
import { Person } from './data';

@Injectable({ providedIn: 'root' })
export class PopoverModalService {
  private overlayRef: OverlayRef | null = null;
  private originEl: ElementRef | null = null;

  constructor(private overlay: Overlay) {}

  open(origin: ElementRef, person: Person): void {
    this.close();
    this.originEl = origin;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8,
        },
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ])
      .withPush(true)
      .withViewportMargin(16);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'popover-backdrop-hidden',
      panelClass: 'popover-overlay-pane',
    });

    this.overlayRef.backdropClick().subscribe(() => this.close());

    const portal = new ComponentPortal(DetailOverlayComponent);
    const ref = this.overlayRef.attach(portal);
    ref.instance.person = person;
    ref.instance.expanded = false;

    ref.instance.onExpand.subscribe(() => this.expand());
    ref.instance.onCollapse.subscribe(() => this.collapse());
    ref.instance.onClose.subscribe(() => this.close());
  }

  private expand(): void {
    if (!this.overlayRef) return;

    // Show backdrop
    const backdrop = this.overlayRef.backdropElement;
    if (backdrop) {
      backdrop.classList.remove('popover-backdrop-hidden');
      backdrop.classList.add('popover-backdrop-visible');
    }

    // Switch to global centered position
    const globalPosition = this.overlay.position().global().centerHorizontally().centerVertically();

    this.overlayRef.updatePositionStrategy(globalPosition);
    this.overlayRef.updateSize({ width: '', height: '' });
    this.overlayRef.overlayElement.classList.add('expanded');
    this.overlayRef.overlayElement.classList.remove('collapsing');
  }

  private collapse(): void {
    if (!this.overlayRef || !this.originEl) return;

    // Hide backdrop
    const backdrop = this.overlayRef.backdropElement;
    if (backdrop) {
      backdrop.classList.remove('popover-backdrop-visible');
      backdrop.classList.add('popover-backdrop-hidden');
    }

    // Switch back to connected position
    const connectedPosition = this.overlay
      .position()
      .flexibleConnectedTo(this.originEl)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          offsetY: 8,
        },
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -8,
        },
      ])
      .withPush(true)
      .withViewportMargin(16);

    this.overlayRef.overlayElement.classList.remove('expanded');
    this.overlayRef.overlayElement.classList.add('collapsing');
    this.overlayRef.updatePositionStrategy(connectedPosition);
    this.overlayRef.updateSize({ width: '', height: '' });

    // Remove collapsing class after transition
    setTimeout(() => {
      this.overlayRef?.overlayElement.classList.remove('collapsing');
    }, 300);
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      this.originEl = null;
    }
  }
}
