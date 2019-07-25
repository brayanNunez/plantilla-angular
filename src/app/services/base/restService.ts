import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { ServiceConfiguration } from './serviceConfiguration';
import { Observable, throwError, ObservableInput } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PagedResult } from './pagedResult';

@Injectable({providedIn: 'root'})
export class RestService<T> {
  public typeName = '';
  private regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})((\.\d{1,})?)(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

  constructor(
    protected http: HttpClient,
    protected config: ServiceConfiguration
  ) {}

  public getById(key: number | string, path: string = ''): Observable<T> {
    const url = this.config.getEntityUri(key, this.typeName, path);
    const options = this.getRequestOptions();

    return this.http.get<T>(url, options).pipe(
      map(this.getResult.bind(this)),
      catchError(this.handleError)
    );
  }

  public get(path: string = ''): Observable<T[]> {
    const url = this.config.getUri(this.typeName, path);
    const options = this.getRequestOptions();

    return this.http.get<T>(url, options).pipe(
      map(this.getResults.bind(this)),
      catchError<T[], never>(this.handleError)
    );
  }

  public getPaged(
    top: number,
    skip: number,
    path: string = ''
  ): Observable<PagedResult<T>> {
    const url = this.config.getUri(this.typeName, path);
    const options = this.getRequestOptions();

    return this.http.get<T>(url, options).pipe(
      map((x: HttpResponse<any>) => this.getPagedResults(x, top, skip)),
      catchError<PagedResult<T>, never>(this.handleError)
    );
  }

  public post(entity: T, path: string = ''): Observable<T> {
    const url = this.config.getUri(this.typeName, path);
    const options = this.getPostRequestOptions();
    const body = JSON.stringify(entity);

    return this.http.post<T>(url, body, options).pipe(
      map(this.getResult.bind(this)),
      catchError(this.handleError)
    );
  }

  public put(
    entity: T,
    key: number | string,
    path: string = ''
  ): Observable<T> {
    const url = this.config.getEntityUri(key, this.typeName, path);
    const options = this.getPutRequestOptions();
    const body = JSON.stringify(entity);

    return this.http.put<T>(url, body, options).pipe(
      map(this.getResult.bind(this)),
      catchError(this.handleError)
    );
  }

  public delete(key: number | string, path: string = ''): Observable<T> {
    const url = this.config.getEntityUri(key, this.typeName, path);
    const options = this.getPutRequestOptions();

    return this.http.delete<T>(url, options).pipe(
      map(this.getResult.bind(this)),
      catchError(this.handleError)
    );
  }

  protected handleError(
    err: any,
    caught: Observable<T> | Observable<T[]> | Observable<PagedResult<T>>
  ): ObservableInput<never> {
    console.warn('Service error: ', err, caught);
    return throwError(err);
  }

  protected getResult(res: HttpResponse<any>): T {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    const body: any = this.preProcessObject(res.body);
    const entity: T = body as T;
    return entity || null;
  }

  protected getResults(response: HttpResponse<any>): T[] {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Bad response status: ' + response.status);
    }
    const body: any = response.body;
    return this.preProcessObject(body);
  }

  protected getPagedResults(
    response: HttpResponse<any>,
    top: number,
    skip: number
  ): PagedResult<T> {
    if (response.status < 200 || response.status >= 300) {
      throw new Error('Bad response status: ' + response.status);
    }
    const body: any = response.body;
    const entities: T[] = this.preProcessObject(body.value);
    const pagedResult = new PagedResult<T>();

    pagedResult.data = entities;
    pagedResult.top = top;
    pagedResult.skip = skip;

    try {
      const count = parseInt(body.count, 10) || entities.length;
      pagedResult.total = count;
    } catch (error) {
      console.warn(
        'Cannot determine entities count. Falling back to collection length...'
      );
      pagedResult.total = entities.length;
    }

    return pagedResult;
  }

  private preProcessObject(input: any | any[]): any | any[] {
    if (Array.isArray(input)) {
      return input.map(x => this.preProcessObject(x));
    }

    // Ignore things that aren't objects.
    if (typeof input !== 'object') {
      return input;
    }

    for (const key in input) {
      if (!input.hasOwnProperty(key)) {
        continue;
      }

      const value = input[key];
      let match;
      // Check for string properties which look like dates.
      if (
        typeof value === 'string' &&
        value.length > 7 &&
        // tslint:disable-next-line:no-conditional-assignment
        (match = value.match(this.regexIso8601))
      ) {
        const milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
          input[key] = new Date(milliseconds);
        }
      } else if (typeof value === 'object' || Array.isArray(value)) {
        // Recurse into object
        this.preProcessObject(value);
      }
    }

    return input;
  }

  protected getRequestOptions(): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json, application/json;odata.metadata=minimal'
    });

    return { headers, body: '', observe: 'response' };
  }

  protected getCustomRequestOptions(
    accept: string,
    contentType: string,
    responseType: string = 'arraybuffer'
  ): any {
    const headerConfig: any = {};

    if (contentType) {
      headerConfig['Content-Type'] = contentType;
    }

    if (accept) {
      // tslint:disable-next-line:no-string-literal
      headerConfig['Accept'] = accept;
    }

    const headers = new HttpHeaders(headerConfig);
    return {
      headers,
      body: '',
      responseType,
      observe: 'response'
    };
  }

  protected getPostRequestOptions(): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json, application/json;odata.metadata=minimal'
    });

    return { headers, observe: 'response' };
  }

  protected getPutRequestOptions(): any {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json, application/json;odata.metadata=minimal',
      Prefer: 'return=representation'
    });

    return { headers, observe: 'response' };
  }

  protected getDeleteRequestOptions(): any {
    return this.getPutRequestOptions();
  }
}
