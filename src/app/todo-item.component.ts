import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

import { TodoItem } from "./todo-item";

@Component({
  selector: "app-todo-item",
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="todoItem">
      <input type="checkbox" [checked]="todoItem.completed" />
      <span>#{{ todoItem.id }} - {{ todoItem.title }}</span>
    </div>`,
})
export class TodoItemComponent {
  @Input() todoItem?: TodoItem;
}
