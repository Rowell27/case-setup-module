import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, Request, RequestMethod } from '@angular/http';
import {
    CaseDTO,
    CaseUserDTO,
    MasterUserListDTO,
    MasterCaseListDTO,
    MasterMatterListDTO,
    MasterTimeZoneListDTO,
    MasterCaseStatusListDTO,
    MasterCountryListDTO,
    MasterDBApplianceListDTO,
    MasterIndexApplianceListDTO,
    MasterExportFolderListDTO,
} from './../../template/model/session-bean';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';

export class MessageModel {
    msg: string;
    validator: boolean;
    constructor() {
        this.msg = null;
        this.validator = true;
    }
}

@Injectable()
export class CaseSetUpManagementService {
    constructor(private http: Http, private router: Router) { }
    headers = new Headers({ 'Content-Type': 'application/json' });
    options = new RequestOptions({ headers: this.headers });

    getCaseList(caseList: MasterCaseListDTO) {
        let body = JSON.stringify(caseList);
        return this.http.post('rest/casesetup/getmastercaselist', body, this.options).map(response => response.json());
    }

    getGroupClientList() {
        return this.http.get('rest/casesetup/getgroupclientname').map(response => response.json());
    }

    getUserList(caseAdminList: MasterUserListDTO) {
        let body = JSON.stringify(caseAdminList);
        return this.http.post('rest/user-management/getmasteruserlistsetup', body, this.options).map(response => response.json());
    }

    getSuggestions(criteria: string) {
        return this.http.get('rest/casesetup/' + criteria).map(response => response.json());
    }

    getMatterList(matterList: MasterMatterListDTO) {
        let body = JSON.stringify(matterList);
        return this.http.post('rest/casesetup/getmastermatterlist', body, this.options).map(response => response.json());
    }

    getTimeZoneList() {
        return this.http.get('rest/casesetup/getmastertimezonelist').map(response => response.json());
    }

    getCaseStatusList() {
        return this.http.get('rest/casesetup/getmasterstatuslist').map(response => response.json());
    }

    getCountryCodeList() {
        return this.http.get('rest/user-management/getmastercountrylist').map(response => response.json());
    }

    getProcessingDBApplianceList(dbApplianceList: MasterDBApplianceListDTO) {
        let body = JSON.stringify(dbApplianceList);
        return this.http.post('rest/casesetup/getmasterecaappliancelist', body, this.options).map(response => response.json());
    }

    getReviewDBApplianceList(dbApplianceList: MasterDBApplianceListDTO) {
        let body = JSON.stringify(dbApplianceList);
        return this.http.post('rest/casesetup/getmasterappliancelist', body, this.options).map(response => response.json());
    }

    getIndexApplianceList(indexApplianceList: MasterIndexApplianceListDTO) {
        let body = JSON.stringify(indexApplianceList);
        return this.http.post('rest/casesetup/getmasterfileserverlist', body, this.options).map(response => response.json());
    }

    hasDuplicateCase(casename: string) {
        return this.http.get('rest/casesetup/iscasenameexist?casename=' + casename).map(response => response.json());
    }

    hasDuplicateEmail(email: string) {
        return this.http.get('rest/user-management/hasDuplicateEmail?emailString=' + email).map(response => response.json());
    }
    
    buildFolderTree() {
        return this.http.get('rest/casesetup/buildfilesystemfoldertree').map(response => response.json());
    }

    getInitFolderList() {
        return this.http.get('rest/casesetup/getinitexportpathfoldertreeitem').map(response => response.json());
    }

    getChildFolderList(exportFolderList: MasterExportFolderListDTO) {
        let body = JSON.stringify(exportFolderList);
        return this.http.post('rest/casesetup/getexportpathfoldertreeitem', body, this.options).map(response => response.json());
    }

    createCase(caseObj: CaseDTO){
        let body = JSON.stringify(caseObj);
        return this.http.post('rest/casesetup/savemastercase', body, this.options).map(response => response.json());
    }
    
    getMasterCase(caseId: number) {
        return this.http.get('rest/casesetup/getmastercase?caseid=' + caseId).map(response => response.json());
    }
}