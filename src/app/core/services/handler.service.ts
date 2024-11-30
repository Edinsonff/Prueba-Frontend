import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HandlerService {

  constructor() { }

  handleError(error: any, message: string) {
    console.error(message, error);
  }
}
