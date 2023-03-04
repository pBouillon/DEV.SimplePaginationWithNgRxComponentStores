import { inject, Injectable } from "@angular/core";
import {
  ComponentStore,
  OnStoreInit,
  tapResponse
} from "@ngrx/component-store";
import { Observable, switchMap, tap, withLatestFrom } from "rxjs";
import { TodoItem } from "./todo-item";
import { TodoItemService } from "./todo-item.service";

export interface PaginationDetails {
  offset: number;
  pageSize: number;
}

export interface PageContent {
  todoItems: TodoItem[];
}

export interface PaginatedItemsState {
  paginationDetails: PaginationDetails;
  pageContent: PageContent;
}

@Injectable()
export abstract class PaginatedItemsComponentStore
  extends ComponentStore<PaginatedItemsState>
  implements OnStoreInit
{
  private readonly _todoItemService = inject(TodoItemService);

  ngrxOnStoreInit() {
    this.loadPage();
  }

  readonly selectPaginatedItemsState = this.select((state) => state);

  readonly selectPaginationDetails = this.select(
    this.selectPaginatedItemsState,
    ({ paginationDetails }) => paginationDetails
  );

  readonly selectOffset = this.select(
    this.selectPaginationDetails,
    ({ offset }) => offset
  );

  readonly selectPageSize = this.select(
    this.selectPaginationDetails,
    ({ pageSize }) => pageSize
  );

  readonly selectPageContent = this.select(
    this.selectPaginatedItemsState,
    ({ pageContent }) => pageContent
  );

  readonly selectTodoItems = this.select(
    this.selectPageContent,
    ({ todoItems }) => todoItems
  );

  readonly loadPage = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      withLatestFrom(this.selectPaginationDetails),
      switchMap(([, { offset, pageSize }]) =>
        this._todoItemService.getTodoItems(offset, pageSize).pipe(
          tapResponse(
            (todoItems: TodoItem[]) => this.updatePaginatedItems({ todoItems }),
            () => console.error("Something went wrong")
          )
        )
      )
    );
  });

  readonly loadNextPage = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      withLatestFrom(this.selectPaginationDetails),
      tap(([, { offset, pageSize }]) =>
        this.updatePagination({
          offset: offset + pageSize,
          pageSize,
        })
      ),
      tap(() => this.loadPage())
    );
  });

  private readonly updatePagination = this.updater(
    (state, paginationDetails: PaginationDetails) => ({
      ...state,
      paginationDetails,
    })
  );

  private readonly updatePaginatedItems = this.updater(
    (state, pageContent: PageContent) => ({ ...state, pageContent })
  );
}
