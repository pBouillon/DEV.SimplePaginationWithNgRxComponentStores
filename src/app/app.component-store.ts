import { inject, Injectable } from "@angular/core";
import {
  ComponentStore,
  OnStoreInit,
  tapResponse,
} from "@ngrx/component-store";
import { map, Observable, switchMap, tap, withLatestFrom } from "rxjs";
import { TodoItem } from "./todo-item";
import { TodoItemService } from "./todo-item.service";

export interface AppState {
  todoItems: TodoItem[];
  offset: number;
  pageSize: number;
}

const initialState: AppState = {
  todoItems: [],
  offset: 0,
  pageSize: 10,
};

@Injectable()
export class AppComponentStore
  extends ComponentStore<AppState>
  implements OnStoreInit
{
  private readonly _todoItemService = inject(TodoItemService);

  readonly vm$ = this.select(({ todoItems }) => ({ todoItems }));

  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit() {
    this.loadPage();
  }

  readonly loadPage = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      withLatestFrom(this.select((state) => state)),
      map(([, state]) => state),
      switchMap(({ offset, pageSize }) =>
        this._todoItemService.getTodoItems(offset * pageSize, pageSize).pipe(
          tapResponse(
            (todoItems: TodoItem[]) => this.updateTodoItems(todoItems),
            () => console.error("Something went wrong")
          )
        )
      )
    );
  });

  readonly loadNextPage = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      withLatestFrom(this.select((state) => state.offset)),
      map(([, state]) => state),
      tap((offset) => this.updateOffset(offset + 1)),
      tap(() => this.loadPage())
    );
  });

  private readonly updateOffset = this.updater(
    (state: AppState, offset: number) => ({
      ...state,
      offset,
    })
  );

  private readonly updateTodoItems = this.updater(
    (state: AppState, todoItems: TodoItem[]) => ({
      ...state,
      todoItems,
    })
  );
}
