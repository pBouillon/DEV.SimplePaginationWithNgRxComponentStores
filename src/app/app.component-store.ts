import { Injectable } from "@angular/core";
import { PaginatedItemsComponentStore, PaginatedItemsState } from "./paginated-items.component-store";


const initialState: PaginatedItemsState = {
  paginationDetails: {
    offset: 0,
    pageSize: 10,
  },
  pageContent: {
    todoItems: [],
  },
};

@Injectable()
export class AppComponentStore
  extends PaginatedItemsComponentStore
{
  readonly vm$ = this.select(
    this.selectTodoItems,
    (todoItems) => ({todoItems}));

  constructor() {
    super(initialState);
  }
}
