import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Person } from '../data';

@Component({
  selector: 'app-detail-overlay',
  templateUrl: './detail-overlay.component.html',
  styleUrl: './detail-overlay.component.scss',
})
export class DetailOverlayComponent {
  @Input() person!: Person;
  @Input() expanded = false;

  @Output() onExpand = new EventEmitter<void>();
  @Output() onCollapse = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  toggleExpand(): void {
    this.expanded = !this.expanded;
    if (this.expanded) {
      this.onExpand.emit();
    } else {
      this.onCollapse.emit();
    }
  }
}
