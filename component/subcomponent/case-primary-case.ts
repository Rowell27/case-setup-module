import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, Renderer, OnChanges } from '@angular/core';
import { CaseDTO, CaseUserDTO, MasterUserListDTO, MasterCountryListDTO } from '../../../template/model/session-bean';
import { CaseSetUpManagementService, MessageModel } from '../../services/case-set-up.service';
import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'case-primary-case',
    templateUrl: 'static/app/modules/case-setup/page/subpage/case-primary-case.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css']
})

export class CasePrimaryCaseAdmin implements OnInit, OnChanges {
    private masterCountryListDTO: MasterCountryListDTO = new MasterCountryListDTO();
    private masterUserListDTO: MasterUserListDTO = new MasterUserListDTO();
    private copyMasterCaseUser: CaseUserDTO = new CaseUserDTO();
    private copyMasterCaseAdmin = { caseId: 0, caseAdminId: 0 }; 

    errorMsgCont: message = new message();
    errorMessage: string;
    isDuplicate: Subject<any> = new Subject();
    infoMessage: any = [];
    toggleTooltip: boolean = false;
    toggleDisabled: boolean = false;
    selectPrimaryCase: string;

    @Input() step: number;
    @Input() viewMode: string;
    @Input() caseDTOObject: CaseDTO;
    @Output() validateEvent:EventEmitter<any> = new EventEmitter();
    @ViewChild('tooltip') tooltip: ElementRef;

    constructor( private caseSetUpManagementService: CaseSetUpManagementService, 
                 private render: Renderer ) { }

    ngOnInit() {
        this.initializePrimaryCase();

        //Observable (Subject)
        this.isDuplicate.subscribe(res => { 
            if (res) {
                this.errorMsgCont.email.validator = true;
                this.errorMsgCont.email.msg = "Email Already Exist.";
            } 
        });
    }

    ngOnChanges( changes: any ) {
        if( changes.step && this.step == 1 ) {
            this.tickValidators();
            if (this.viewMode == 'edit') {
                this.caseDTOObject.caseAdminId = this.copyMasterCaseAdmin.caseAdminId;
                this.selectPrimaryCase = ( this.viewMode == 'edit' ? 'select-admin' : 'add-admin' );        
            }
        }
        this.copyState();
    }
    
    initializePrimaryCase() {
        // console.log("caseDTOObject(onInit):::", this.caseDTOObject);
        this.loadCountryCodeList();
        this.loadUserList();
        if (this.viewMode == 'add') this.initializeModel();
        this.selectPrimaryCase = ( this.viewMode == 'edit' ? 'select-admin' : 'add-admin' );
        this.copyMasterCaseUser = new CaseUserDTO();
    }
    
    initializeModel() {
        this.caseDTOObject.caseAdminId = 0;
        this.caseDTOObject.primaryCaseAdminUser = new CaseUserDTO(); 
        this.caseDTOObject.primaryCaseAdminUser.allowPasswordChange = true;
        this.caseDTOObject.primaryCaseAdminUser.selectedCountryCode = 'PH';
    }

    loadUserList() {
        this.caseSetUpManagementService.getUserList(this.masterUserListDTO)
            .subscribe( response => this.masterUserListDTO = response )
    }

    loadCountryCodeList() {
        this.caseSetUpManagementService.getCountryCodeList()
            .subscribe( response => this.masterCountryListDTO = response );
    }

    selectCaseAdmin( id ) {
        console.log("id ::", id, "caseAdmin:::", this.caseDTOObject.caseAdminId);
        this.toggleDisabled = true;
        this.masterUserListDTO.resultList.filter( arr => {
            if ( arr.userId == id ) {
                console.log("id(PASSED)!!!::", id);
                this.caseDTOObject.primaryCaseAdminUser = arr;
                this.caseDTOObject.isNewCaseAdmin = false;
                this.tickValidators();
                console.log("primaryCase(RETRIEVED):::", this.caseDTOObject.primaryCaseAdminUser)
                console.log("validateCaseAdmin:::", this.errorMsgCont.caseadmin.validator);
            }
        });
    }

    clear() {
        this.errorMsgCont = new message();            
        this.tickValidators();
        this.initializeModel();
        if ( this.selectPrimaryCase == 'select-admin' ) {
            if (this.viewMode == 'edit') this.caseDTOObject.caseAdminId = this.copyMasterCaseAdmin.caseAdminId;
            console.log("userId(primaryCase):::", this.caseDTOObject.primaryCaseAdminUser.userId);
            return this.selectCaseAdmin( this.caseDTOObject.caseAdminId );
        }
        this.toggleDisabled = false;
    }

    tickValidators() {
        if (this.selectPrimaryCase == 'select-admin') {
            this.toggleDisabled = true;
            Object.keys(this.errorMsgCont).forEach( i => this.errorMsgCont[i].validator = false);
            if (this.caseDTOObject.caseAdminId == 0) this.errorMsgCont.caseadmin.validator = true;
        } else this.errorMsgCont.caseadmin.validator = false;
        this.validateEvent.emit( this.errorMsgCont );
    }

    copyState() {
        if ( this.viewMode != 'edit' && this.copyMasterCaseAdmin.caseAdminId ) return;
        this.copyMasterCaseUser = this.caseDTOObject.primaryCaseAdminUser;
        this.copyMasterCaseAdmin.caseAdminId = this.caseDTOObject.caseAdminId;
        console.info("CopyState(CaseAdminID):::", this.copyMasterCaseAdmin.caseAdminId);
        console.info("CopyState:::", this.copyMasterCaseUser.userName);
    }

    validateFields(field) {
        if (field.target.name === 'userName') this.validateUserName();
        if (field.target.name === 'fullName') this.validateFullName();
        if (field.target.name === 'emailAddress') this.validateEmail();
        if (field.target.name === 'password') this.validatePassword();
        if (field.target.name === 'confirmPassword') this.validateConfirmPassword();
        // if (field.target.name === 'selectedCountryCode') this.validateCountryCode();
        if (field.target.name === 'mobileNumber') this.validateMobile();
        if (field.target.name === 'caseAdmin') this.validateCaseAdmin();
        this.validateEvent.emit( this.errorMsgCont );
    }

    validateCaseAdmin() {
        if (this.caseDTOObject.caseAdminId == 0) {
            this.caseDTOObject.primaryCaseAdminUser = new CaseUserDTO();
            this.errorMsgCont.caseadmin.validator = true;
            return this.errorMsgCont.caseadmin.msg = "No Case Admin selected.";
        }
        this.selectCaseAdmin( this.caseDTOObject.caseAdminId );
        this.toggleTooltip = false;
        this.errorMsgCont.caseadmin.msg = "";
        this.errorMsgCont.caseadmin.validator = false;
    }

    validateUserName() {
        if (!this.caseDTOObject.primaryCaseAdminUser.userName) {
            this.errorMsgCont.username.validator = true;
            return this.errorMsgCont.username.msg = "Value is required.";
        }
        if (this.caseDTOObject.primaryCaseAdminUser.userName.length < 6) {
            this.errorMsgCont.username.validator = true;
            return this.errorMsgCont.username.msg = "Must have at least 6 characters.";
        }
        if (!this.caseDTOObject.primaryCaseAdminUser.userName.match(/^[A-Za-z0-9_.\-@]+$/)) {
            this.errorMsgCont.username.validator = true;
            return this.errorMsgCont.username.msg = "Must only contain numbers, upper/lower case letters, dash ( - ) , underscore ( _ ), period (.) and at sign ( @ ).";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.username.msg = "";
        this.errorMsgCont.username.validator = false;
    }

    validateFullName() {
        if (!this.caseDTOObject.primaryCaseAdminUser.userFullName) {
            this.errorMsgCont.fullname.validator = true;
            return this.errorMsgCont.fullname.msg = "Value is required.";
        }
        if (!this.caseDTOObject.primaryCaseAdminUser.userFullName.match(/^[\u00F1\u00D1A-Za-z0-9 ]+$/)) {
            this.errorMsgCont.fullname.validator = true;
            return this.errorMsgCont.fullname.msg = "Must only contain numbers, upper/lower case letters including (ñ,Ñ) and spaces.";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.fullname.msg = "";
        this.errorMsgCont.fullname.validator = false;
    }

    validateEmail() {
        if (!this.caseDTOObject.primaryCaseAdminUser.emailAddress) {
            this.errorMsgCont.email.validator = false;
            return this.errorMsgCont.email.msg = "Value is required.";
        }
        if (!this.caseDTOObject.primaryCaseAdminUser.emailAddress.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
            this.errorMsgCont.fullname.validator = false;
            return this.errorMsgCont.email.msg = "Must have a valid email format.";
        }
        this.checkDuplicateEmail();
        this.toggleTooltip = false;
        this.errorMsgCont.email.msg = "";
        this.errorMsgCont.email.validator = false;
    }

    validatePassword() {
        if (!this.caseDTOObject.primaryCaseAdminUser.password) {
            this.errorMsgCont.password.validator = true;
            return this.errorMsgCont.password.msg = "Value is required.";
        }
        if (this.caseDTOObject.primaryCaseAdminUser.password.length < 8) {
            this.errorMsgCont.password.validator = true;
            return this.errorMsgCont.password.msg = "Must have at least 8 characters";
        }
        if (!this.checkPassword(this.caseDTOObject.primaryCaseAdminUser.password)) {
            this.errorMsgCont.password.validator = true;
            return this.errorMsgCont.password.msg = "Invalid password format";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.password.msg = "";
        this.errorMsgCont.password.validator = false;
    }

    validateConfirmPassword() {
        if (!this.caseDTOObject.primaryCaseAdminUser.confirmPassword) {
            this.errorMsgCont.confirmpass.validator = true;
            return this.errorMsgCont.confirmpass.msg = "Value is required.";
        }
        if (this.caseDTOObject.primaryCaseAdminUser.password !== this.caseDTOObject.primaryCaseAdminUser.confirmPassword) {
            this.errorMsgCont.confirmpass.validator = true;
            return this.errorMsgCont.confirmpass.msg = "Password did not match";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.confirmpass.msg = "";
        this.errorMsgCont.confirmpass.validator = false;
    }

    // validateCountryCode() {
    //     if (!this.caseDTOObject.primaryCaseAdminUser.selectedCountryCode) {
    //         this.errorMsgCont.countrycode.validator = true;
    //         return this.errorMsgCont.countrycode.msg = "No country code selected.";
    //     }
    //     this.toggleTooltip = false;
    //     this.errorMsgCont.countrycode.msg = "";
    //     this.errorMsgCont.countrycode.validator = false;
    // }

    validateMobile() {
        if (!this.caseDTOObject.primaryCaseAdminUser.mobileNumber) {
            this.errorMsgCont.mobile.validator = true;
            return this.errorMsgCont.mobile.msg = "Value is required.";
        }
        // if (this.caseDTOObject.createdByUser.mobileNumber.length > 10) return this.errorMsgCont.mobile = "Value exceeded. Must be at least 10 digits."
        if (!this.caseDTOObject.primaryCaseAdminUser.mobileNumber.match(/^[0-9]+$/)) {
            this.errorMsgCont.mobile.validator = true;
            return this.errorMsgCont.mobile.msg = "Invalid mobile number.";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.mobile.msg = "";
        this.errorMsgCont.mobile.validator = false;
    }

    checkDuplicateEmail() {
        this.caseSetUpManagementService.hasDuplicateEmail(this.caseDTOObject.primaryCaseAdminUser.emailAddress).subscribe(response => this.isDuplicate.next(response));
    }

    checkPassword(value) {
        let lowerCase: boolean = false;
        let upperCase: boolean = false;
        let digit: boolean = false;
        let specialChars: boolean = false;

        for (let a of value) {
            if (a.match(/^[a-z]+$/)) lowerCase = true;
            if (a.match(/^[A-Z]+$/)) upperCase = true;
            if (a.match(/^[0-9]+$/)) digit = true;
            if (a.match(/^[!@#$%^&*.\-+]+$/)) specialChars = true;
        }
        if (lowerCase && upperCase && digit && specialChars) return true;
        else return false;
    }


    displayInfo(event, field) {
        this.errorMessage = "";
        this.infoMessage = [];
        if (field == 'username') this.infoMessage = ["Must contain at least 6 characters. ", " Can only contain number,upper/lower case letter,dash ( - ) ,underscore ( _ ), period (.) and at sign ( @ )."]
        if (field == 'fullname') this.infoMessage = ["Can only contain number, upper/lower case letter and spaces."];
        if (field == 'password') this.infoMessage = ["Must contain at least 8 characters.", "Must contain at least (1) upper case letter, (1) lower case letter, (1) number, (1) special character (Allowed: !@#$%^&*.-+)."];
        if (field == 'mobile') this.infoMessage = ["Can only contain numbers."];
        if (this.infoMessage) this.displayToolTip(event, null, field);
    }

    displayError(event, message) {
        if (!message) return this.errorMessage = "";
        this.errorMessage = message;
        this.infoMessage = [];
        this.displayToolTip(event, message);
    }
    

    displayToolTip(event, message?: string, field?: string) {
        if (event.type != 'mouseover' && (!message || !field)) return this.toggleTooltip = false;

        document.onmousemove = (e) => {
            this.render.setElementStyle(this.tooltip.nativeElement, 'left', (e.pageX + 18) + 'px');
            this.render.setElementStyle(this.tooltip.nativeElement, 'top', (e.pageY - 20) + 'px');
        }
        this.toggleTooltip = true;
    }

}

class message {
    username: MessageModel = new MessageModel();
    fullname: MessageModel = new MessageModel();
    email: MessageModel = new MessageModel();
    password: MessageModel = new MessageModel();
    confirmpass: MessageModel = new MessageModel();
    mobile: MessageModel = new MessageModel();
    caseadmin: MessageModel = new MessageModel();
}
