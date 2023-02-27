import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";

import { provideComponentStore } from "@ngrx/component-store";

import { AppComponentStore } from "./app.component-store";
import { TodoItemComponent } from "./todo-item.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, TodoItemComponent],
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <h1>Simple pagination with NgRx component stores</h1>

      <app-todo-item
        *ngFor="let todoItem of vm.todoItems"
        [todoItem]="todoItem"
      />

      <button type="button" aria-label="Previous Page" (click)="onPreviousPage()">
        ←
      </button>

      <button type="button" aria-label="Next Page" (click)="onNextPage()">
        →
      </button>
    </ng-container>
  `,
  providers: [provideComponentStore(AppComponentStore)],
})
export class AppComponent {
  private readonly _componentStore = inject(AppComponentStore);
  readonly vm$ = this._componentStore.vm$;

  onPreviousPage(): void {}

  onNextPage(): void {
    this._componentStore.loadNextPage();
  }
}
