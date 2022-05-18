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

    // pdf 상세 정보 불러오기
    getContractInfo(data) {
        return this.http.get('/api/v1/contract/getContractInfo/',{ params:data});
    }

    // 업로드 시 PDF File 정보 요청
    getPdfFile(data) {
        return this.http.get('/api/v1/contract/getPdfFile/',{ params:data, responseType: 'blob' });
    }

    // confirm sign
    signContract(data) {
        return this.http.post('/api/v1/contract/signContract', data);
    }

    // reject contract
    rejectContract(data) {
        return this.http.post('/api/v1/contract/rejectContract', data);
    }
}
