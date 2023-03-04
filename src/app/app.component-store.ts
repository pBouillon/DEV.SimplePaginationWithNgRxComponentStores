import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  PaginatedItemsComponentStore,
  PaginatedItemsState,
  PaginationDetails
} from "./paginated-items.component-store";
import { TodoItem } from "./todo-item";
import { TodoItemService } from "./todo-item.service";

const initialState: PaginatedItemsState<TodoItem> = {
  paginationDetails: {
    offset: 0,
    pageSize: 10,
  },
  pageContent: {
    items: [],
  },
};

@Injectable()
export class AppComponentStore extends PaginatedItemsComponentStore<TodoItem> {
  readonly vm$ = this.select(this.selectItems, (todoItems) => ({ todoItems }));

  constructor() {
    super(initialState);
  }

  private readonly _todoItemService = inject(TodoItemService);

  protected getItems({ offset, pageSize }: PaginationDetails): Observable<TodoItem[]> {
    return this._todoItemService.getTodoItems(offset, pageSize);
  }
}
