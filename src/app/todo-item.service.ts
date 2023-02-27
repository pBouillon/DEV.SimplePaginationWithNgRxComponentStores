import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { TodoItem } from "./todo-item";

@Injectable({ providedIn: "root" })
export class TodoItemService {
  private readonly _http = inject(HttpClient);

  getTodoItems(offset?: number, pageSize?: number): Observable<TodoItem[]> {
    const params = new HttpParams({
      fromObject: {
        _start: offset ?? 0,
        _limit: pageSize ?? 10,
      },
    });

    return this._http.get<TodoItem[]>(
      "https://jsonplaceholder.typicode.com/todos",
      { params }
    );
  }
}
