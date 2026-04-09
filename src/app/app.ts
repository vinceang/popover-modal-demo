import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { Person, PEOPLE } from './data';
import { PopoverModalService } from './popover-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  people = PEOPLE;
  @ViewChildren('row') rows!: QueryList<ElementRef>;

  constructor(private popoverModalService: PopoverModalService) {}

  onRowClick(person: Person, index: number): void {
    const rowEl = this.rows.toArray()[index];
    if (rowEl) {
      this.popoverModalService.open(rowEl, person);
    }
  }
}
