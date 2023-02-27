import { AsyncPipe, NgFor } from "@angular/common";
import { Component, inject } from "@angular/core";

import { BehaviorSubject, switchMap } from "rxjs";

import { TodoItemComponent } from "./todo-item.component";
import { TodoItemService } from "./todo-item.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [NgFor, AsyncPipe, TodoItemComponent],
  template: `
    <h1>Simple pagination with NgRx component stores</h1>

    <app-todo-item
      *ngFor="let todoItem of todoItems$ | async"
      [todoItem]="todoItem"
    />

    <button type="button" aria-label="Previous Page" (click)="onPreviousPage()">
      ←
    </button>

    <button type="button" aria-label="Next Page" (click)="onNextPage()">
      →
    </button>

  `,
})
export class AppComponent {
  private readonly _todoItemService = inject(TodoItemService);

  // 👇 Introducing a subject holding the pagination details
  private readonly _pagination$ = new BehaviorSubject({
    offset: 0,
    pageSize: 10,
  });

  // 👇 Reactively update the todo items on pagination change
  readonly todoItems$ = this._pagination$.pipe(
    switchMap(({ offset, pageSize }) =>
      this._todoItemService.getTodoItems(offset, pageSize)
    )
  );

  onPreviousPage(): void {
    const { offset, pageSize } = this._pagination$.getValue();

    this._pagination$.next({
      offset: offset - pageSize,
      pageSize,
    });
  }

  onNextPage(): void {
    const { offset, pageSize } = this._pagination$.getValue();

    this._pagination$.next({
      offset: offset + pageSize,
      pageSize,
    });
  }
}
