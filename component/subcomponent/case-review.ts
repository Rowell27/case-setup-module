import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer } from "@angular/core";
import { CaseDTO, MasterDBApplianceListDTO, MasterIndexApplianceListDTO } from '../../../template/model/session-bean';
import { CaseSetUpManagementService, MessageModel } from '../../services/case-set-up.service';
import { CaseProcessing } from './case-processing';

@Component({
    selector: 'case-review',
    templateUrl: 'static/app/modules/case-setup/page/subpage/case-review.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css']
})

export class CaseReview implements OnInit, OnChanges {
    masterDBApplianceList: MasterDBApplianceListDTO;
    masterIndexApplianceList: MasterIndexApplianceListDTO;
    errorMsgCont: message = new message();
    errorMessage: string;
    msgContObj: any;
    toggleTooltip: boolean = false;

    @Input() step: number;
    @Input() viewMode: string;
    @Input() caseDTOObject: CaseDTO;
    @Output() validateEvent: EventEmitter = new EventEmitter();
    @ViewChild('tooltip') tooltip: ElementRef;
    @ViewChild(CaseProcessing) caseProcessing: CaseProcessing;

    constructor( private caseSetUpManagementService: CaseSetUpManagementService,
                 private render: Renderer) {
        this.masterDBApplianceList = new MasterDBApplianceListDTO();
        this.masterIndexApplianceList = new MasterIndexApplianceListDTO();
    }

    ngOnInit() {
        this.initializeReview();
    }

    ngOnChanges( changes:any ) {
        if ( changes.step && this.step == 2 ) {
            if (this.viewMode == 'edit') Object.keys(this.errorMsgCont).forEach( i => this.errorMsgCont[i].validator = false);
            // console.log("errorMsgCont(review): ", this.errorMsgCont);
            this.validateEvent.emit( {name:'review', obj: this.errorMsgCont }  );
        }
    }

    initializeReview() {
        this.loadDBApplianceList();
        this.loadIndexApplianceList();
        this.caseDTOObject.caseApplianceId = 0;
        this.caseDTOObject.masterFileServer = 0;
    }

    loadDBApplianceList() {
        this.caseSetUpManagementService.getReviewDBApplianceList(this.masterDBApplianceList)
            .subscribe( response => this.masterDBApplianceList.resultList = response);
    }
    
    loadIndexApplianceList() {
        this.caseSetUpManagementService.getIndexApplianceList(this.masterIndexApplianceList)
            .subscribe( response => this.masterIndexApplianceList.resultList = response );
    }

    validateFields(field) {
        if ( this.viewMode == 'view' ) return;
        if (field.target.name === 'reviewDBAppliance') this.validateDBAppliance();
        if (field.target.name === 'reviewIndexAppliance') this.validateIndexAppliance()
        this.validateEvent.emit( { name:'review', obj: this.errorMsgCont, flag: true } );
    }

    validateDBAppliance() {
        if (this.caseDTOObject.caseApplianceId == 0) {
            this.errorMsgCont.reviewdb.validator = true;
            return this.errorMsgCont.reviewdb.msg = "Please select an item";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.reviewdb.msg = "";
        this.errorMsgCont.reviewdb.validator = false;
    }

    validateIndexAppliance() {
        if (this.caseDTOObject.masterFileServer == 0) {
            this.errorMsgCont.reviewindex.validator = true;
            return this.errorMsgCont.reviewindex.msg = "Please select an item";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.reviewindex.msg = "";
        this.errorMsgCont.reviewindex.validator = false;
    }
    
    displayError(event, message) {
        if (!message) return this.errorMessage = "";
        this.errorMessage = message;
        this.displayToolTip(event, message);
    }

    displayToolTip(event, message) {
        if (event.type != 'mouseover' || !message ) return this.toggleTooltip = false;
        document.onmousemove = (e) => {
            this.render.setElementStyle(this.tooltip.nativeElement, 'left', (e.pageX + 18) + 'px');
            this.render.setElementStyle(this.tooltip.nativeElement, 'top', (e.pageY - 20) + 'px');
        }
        this.toggleTooltip = true;
    }
}

class message {
    reviewdb: MessageModel = new MessageModel();
    reviewindex: MessageModel = new MessageModel();
}
