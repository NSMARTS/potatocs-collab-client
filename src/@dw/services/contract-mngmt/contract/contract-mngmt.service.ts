import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ContractMngmtService {

    constructor(
        private http: HttpClient,
    ) {}


    // get contract list 
    getContractList(data) {
        return this.http.get('/api/v1/contract/getContractList', {params: data});
    }

}
