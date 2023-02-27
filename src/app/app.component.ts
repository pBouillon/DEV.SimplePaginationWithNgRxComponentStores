import { AsyncPipe, NgFor } from "@angular/common";
import { Component, inject } from "@angular/core";

import { TodoItemComponent } from "./todo-item.component";
import { TodoItemService } from "./todo-item.service";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <h1>Simple pagination with NgRx component stores</h1>

    <app-todo-item
      *ngFor="let todoItem of todoItems$ | async"
      [todoItem]="todoItem"
    />
  `,
  imports: [NgFor, AsyncPipe, TodoItemComponent],
})
export class AppComponent {
  private readonly _todoItemService = inject(TodoItemService);
  readonly todoItems$ = this._todoItemService.getTodoItems();
}
