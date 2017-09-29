import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request, RequestMethod } from '@angular/http';
import { MasterMatterDTO } from '../../template/model/session-bean';

@Injectable()
export class MasterMatterService {

    constructor(private http: Http) { }

    saveMatter(masterMatter: MasterMatterDTO) {
        let body = JSON.stringify(masterMatter);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('rest/casesetup/savemastermatter/', body, options).map(response => response.json());
    }

    isMatterNameExist(masterMatter: MasterMatterDTO) {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post('rest/casesetup/ismatternameexist/', masterMatter.matterName, options).map(response => response.json());
    }

}