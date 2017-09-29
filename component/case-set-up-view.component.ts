import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CaseDTO } from '../../template/model/session-bean';
// import { CaseLogoUpload }                       from "./subcomponent/case-logo-upload";
import { CaseSetUpManagementService }           from "../services/case-set-up.service";

@Component({
    selector: 'isi-case-set-up-view',
    templateUrl: 'static/app/modules/case-setup/page/case-set-up-view.component.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css']
})

export class CaseSetUpViewComponent implements OnInit {

    private caseDTO: CaseDTO = new CaseDTO();
    // private masterCountryListDTO: 
    private mode: string;
    private passChange: string;
    private sendPin: string;
    private caseStatus: string;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private caseSetUpManagementService: CaseSetUpManagementService) { }

    ngOnInit() {
        this.route.params.subscribe( params => {
            this.caseDTO.caseId = params['id'];
            this.mode = params['mode'];
            if ( this.caseDTO.caseId ) this.loadSelectedCase( this.caseDTO.caseId );
        });
    }

    loadSelectedCase( caseId ) {
        this.caseSetUpManagementService.getMasterCase( caseId )
            .subscribe( res => this.mapData( res ) );
        }
    
    routeToList() {
        setTimeout((router: Router) => {
            this.router.navigate(['case-setup']);;
        }, 1000);
    }

    mapData( data ) {
        this.caseDTO = data;       
        this.passChange = ( this.caseDTO.primaryCaseAdminUser.allowPasswordChange ? 'Yes' : 'No' );
        this.sendPin = ( this.caseDTO.primaryCaseAdminUser.pinForAuthenticationEmail ? 'Email' : 'None' ); 
    }
}