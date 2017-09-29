import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer, OnChanges } from "@angular/core";
import { CaseSetUpEditAddMatterComponent } from './case-set-up-edit-add-matter.component';
import { CaseDTO, MasterMatterListDTO, MasterTimeZoneListDTO, MasterCaseStatusListDTO, MasterMatterDTO } from '../../../template/model/session-bean';
import { MasterMatterService } from '../../services/mastermatter.service';
import { CaseSetUpManagementService, MessageModel } from '../../services/case-set-up.service';

@Component({
    selector: 'case-details',
    templateUrl: 'static/app/modules/case-setup/page/subpage/case-details.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css'],
    providers: [CaseSetUpManagementService, MasterMatterService]
})

export class CaseDetails implements OnInit, OnChanges {
    private masterMatterList: MasterMatterListDTO = new MasterMatterListDTO();
    private masterMatterDTO: MasterMatterDTO = new MasterMatterDTO();
    private masterTimeZoneList: MasterTimeZoneListDTO = new MasterTimeZoneListDTO();
    private masterCaseStatusList: MasterCaseStatusListDTO = new MasterCaseStatusListDTO();
    errorMsgCont: message = new message();
    errorMessage: string;
    isDuplicate: boolean = false;
    toggleTooltip: boolean = false;
    private copyMasterCase = { caseId: 0, caseName: ''};

    @Input() step: number;
    @Input() viewMode: string;
    @Input() caseDTOObject: CaseDTO;
    @Output() validateEvent:EventEmitter<any> = new EventEmitter();
    @ViewChild('tooltip') tooltip: ElementRef;
    @ViewChild(CaseSetUpEditAddMatterComponent) caseSetUpEditAddMatterComponent: CaseSetUpEditAddMatterComponent;

    constructor(private masterMatterService: MasterMatterService,
                private caseSetUpManagementService: CaseSetUpManagementService,
                private render: Renderer) { }

    ngOnInit() {
        this.initializeCaseDetails();
    }

    ngOnChanges( changes: any ){
        // console.log("caseDTO(fromChanges):::", this.caseDTOObject);
        console.log("caseDTO!!:::", this.caseDTOObject)
        if( changes.step && this.step == 0 ) {
            if (this.viewMode == 'edit')  Object.keys(this.errorMsgCont).forEach( i => this.errorMsgCont[i].validator = false);
            // console.log("validators::::> ", this.errorMsgCont);
            this.validateEvent.emit( this.errorMsgCont );
        }
        this.copyState();
    }

    initializeCaseDetails() {
        this.loadGroupClientList();
        this.loadMatterList();
        this.loadTimeZoneList();
        this.loadCaseStatusList();
        if (this.viewMode == 'add') this.clearCaseDTOObject();
    }

    clearCaseDTOObject(){
        this.caseDTOObject.caseName = '';
        this.caseDTOObject.matterId = 0;
        this.caseDTOObject.zoneId = 268;
        this.caseDTOObject.encodingScheme = '';
        this.caseDTOObject.statusId = 1;
        this.caseDTOObject.demoFlag = true;
        this.caseDTOObject.defaultView = 1;
        
        this.copyMasterCase.caseName = '';
    }

    loadGroupClientList() {
        this.caseSetUpManagementService.getGroupClientList()
            .subscribe( data => {
                if( this.viewMode == 'add' ) {
                    this.caseDTOObject.groupName = data.groupName;
                    this.caseDTOObject.clientName = data.clientName;
                }
            });
    }

    copyState() {
        if ( this.viewMode == 'edit' && !this.copyMasterCase.caseName ) this.copyMasterCase.caseName = this.caseDTOObject.caseName;
    }

    loadMatterList() {
        this.caseSetUpManagementService.getMatterList(this.masterMatterList)
            .subscribe(response => this.masterMatterList.resultList = response );
    }

    loadTimeZoneList() {
        this.caseSetUpManagementService.getTimeZoneList()
            .subscribe(response => this.masterTimeZoneList.resultList = response);
    }

    loadCaseStatusList() {
        this.caseSetUpManagementService.getCaseStatusList()
            .subscribe(response => this.masterCaseStatusList.resultList = response);
    }

    onClickAddMatter() {
        this.caseSetUpEditAddMatterComponent.showModalAddMatter();
    }

    getNewMatter( object ){
        this.masterMatterList.resultList.push( object );
        this.caseDTOObject.matterId = object['matterId']
        this.validateMatter();
    }
    
    validateFields(field) {
        if (this.viewMode == 'view') return;
        if (field.target.name === 'caseName') this.validateCaseName();
        if (field.target.name === 'matterName') this.validateMatter();
        // if (field.target.name === 'timeZone') this.validateTimeZone();
        if (field.target.name === 'encodingScheme') this.validateEncodingScheme();
        this.validateEvent.emit( this.errorMsgCont );
    }

    validateCaseName() {
        this.checkDuplicateCase();
        if (!this.caseDTOObject.caseName) {
            this.errorMsgCont.casename.validator = true;
            return this.errorMsgCont.casename.msg = "Value is required.";
        }
        if (!this.caseDTOObject.caseName.match(/^[a-zA-Z0-9_.\- ]+$/)) {
            this.errorMsgCont.casename.validator = true;
            return this.errorMsgCont.casename.msg = "Must only contain numbers, upper/lower case letters, dash ( - ) , underscore ( _ ) and period (.)";
        }
        if (this.isDuplicate) {
            this.errorMsgCont.casename.validator = true;
            return this.errorMsgCont.casename.msg = "Case already exist.";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.casename.msg = "";
        this.errorMsgCont.casename.validator = false;
    }

    validateMatter() {
        if (this.caseDTOObject.matterId == 0) {
            this.errorMsgCont.matter.validator = true;
            return this.errorMsgCont.matter.msg = "Please select a matter.";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.matter.msg = "";
        this.errorMsgCont.matter.validator = false;
    }

    // validateTimeZone() {
    //     if (this.caseDTOObject.zoneId == 0) {
    //         this.errorMsgCont.timezone.validator = true;
    //         return this.errorMsgCont.timezone.msg = "Please select a timezone.";
    //     }
    //     this.toggleTooltip = false;
    //     this.errorMsgCont.timezone.msg = "";
    //     this.errorMsgCont.timezone.validator = false;
    // }

    validateEncodingScheme() {
        if (!this.caseDTOObject.encodingScheme) {
            this.errorMsgCont.encodingscheme.validator = true;
            return this.errorMsgCont.encodingscheme.msg = "Please select an encoding scheme.";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.encodingscheme.msg = "";
        this.errorMsgCont.encodingscheme.validator = false;
    }
    
    checkDuplicateCase() {
        if( this.viewMode == 'edit' && this.copyMasterCase.caseName == this.caseDTOObject.caseName ) return;
        this.caseSetUpManagementService.hasDuplicateCase(this.caseDTOObject.caseName).subscribe(response => this.isDuplicate = response );
    }
    
    displayError(event, message) {
        if (!message) return this.errorMessage = "";
        this.errorMessage = message;
        this.displayToolTip(event, message);
    }

    displayToolTip(event, message) {
        if (event.type != 'mouseover' || !message) return this.toggleTooltip = false;
        document.onmousemove = (e) => {
            this.render.setElementStyle(this.tooltip.nativeElement, 'left', (e.pageX + 18) + 'px');
            this.render.setElementStyle(this.tooltip.nativeElement, 'top', (e.pageY - 18) + 'px');
        }
        this.toggleTooltip = true;
    }
    
}


class message {
    casename: MessageModel = new MessageModel();
    matter: MessageModel = new MessageModel();
    encodingscheme: MessageModel = new MessageModel();;
}
