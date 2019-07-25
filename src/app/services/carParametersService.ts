import { Injectable } from '@angular/core';
import { ICarParameters } from '@domain/.';
import { RestService, ServiceConfiguration } from './base';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class CarParametersService extends RestService<ICarParameters> {
  constructor(protected http: HttpClient, protected config: ServiceConfiguration) {
    super(http, config);
    this.typeName = 'CarParameters';
  }
}
