import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({providedIn: 'root'})
export class ServiceConfiguration {
  public baseUrl = environment.apiUrl;

      constructor() {}

  public getUri(typeName: string, path: string = '') {
    return this.baseUrl + '/' + typeName + path;
  }

  public getEntityUri(entityKey: number | string, typeName: string, path: string = '') {
    if (typeof entityKey === 'string') {
      return this.getTypeUri(typeName) + (entityKey ? `'/${entityKey}'` : '') + path;
    } else {
      return this.getTypeUri(typeName) + (entityKey ? `/${entityKey}` : '') + path;
    }
  }

  private getTypeUri(typeName: string) {
    return this.baseUrl + '/' + typeName;
  }
}
