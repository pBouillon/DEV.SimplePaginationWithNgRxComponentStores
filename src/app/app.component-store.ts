import { Injectable } from "@angular/core";

import { ComponentStore } from "@ngrx/component-store";

import { TodoItem } from "./todo-item";

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
export class AppComponentStore extends ComponentStore<AppState> {
  readonly vm$ = this.select(({ todoItems }) => ({ todoItems }));

  constructor() {
    super(initialState);
  }
}
