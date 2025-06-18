import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralParametersService {

  constructor() { }

  private selectedCompanySubject = new BehaviorSubject<string | null>(null);
  selectedCompany$ = this.selectedCompanySubject.asObservable();

  selectCompany(company: string) {
    this.selectedCompanySubject.next(company);
  }
}
