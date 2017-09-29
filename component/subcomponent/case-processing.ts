import { Component, OnInit, OnChanges, Input, Output, EventEmitter, ElementRef, Renderer, ViewChild } from "@angular/core";
import { CaseDTO, MasterDBApplianceListDTO, MasterIndexApplianceListDTO } from '../../../template/model/session-bean';
import { CaseSetUpManagementService, MessageModel } from '../../services/case-set-up.service';

@Component({
    selector: 'case-processing',
    templateUrl: 'static/app/modules/case-setup/page/subpage/case-processing.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css']
})

export class CaseProcessing implements OnInit, OnChanges {
    masterDBApplianceList: MasterDBApplianceListDTO;
    masterIndexApplianceList: MasterIndexApplianceListDTO;
    errorMsgCont: message = new message();
    errorMessage: string;
    toggleTooltip: boolean = false;

    @Input() step: number;
    @Input() viewMode: string;
    @Input() caseDTOObject: CaseDTO;
    @Output() validateEvent: EventEmitter = new EventEmitter();
    @ViewChild('tooltip') tooltip: ElementRef;

    constructor( private caseSetUpManagementService: CaseSetUpManagementService,
                 private render: Renderer) {
        this.masterDBApplianceList = new MasterDBApplianceListDTO();
        this.masterIndexApplianceList = new MasterIndexApplianceListDTO();
    }

    ngOnInit() {
        this.initializeProcessing();
    }

    ngOnChanges( changes:any ) {
        if ( changes.step && this.step == 2 ) {
            if (this.viewMode == 'edit') Object.keys(this.errorMsgCont).forEach( i => this.errorMsgCont[i].validator = false);
            // console.log("errorMsgCont(processing): ", this.errorMsgCont);
            this.validateEvent.emit( { name: 'processing', obj: this.errorMsgCont } );
        }
    }

    initializeProcessing() {
        this.loadDBApplianceList();
        this.loadIndexApplianceList();
        this.caseDTOObject.ecadbapplianceId = 0;
        this.caseDTOObject.ecaindexApplianceId = 0;
    }

    loadDBApplianceList() {
        this.caseSetUpManagementService.getProcessingDBApplianceList(this.masterDBApplianceList)
            .subscribe(response => this.masterDBApplianceList.resultList = response);
    }

    loadIndexApplianceList() {
        this.caseSetUpManagementService.getIndexApplianceList(this.masterIndexApplianceList)
            .subscribe(response => this.masterIndexApplianceList.resultList = response);
    }

    validateFields(field) {
        if ( this.viewMode == 'view' ) return;
        if (field.target.name === 'processDBAppliance') this.validateDBAppliance();
        if (field.target.name === 'processIndexAppliance') this.validateIndexAppliance();
        this.validateEvent.emit( { name: 'processing', obj: this.errorMsgCont, flag: true } );
    }

    validateDBAppliance() {
        if (this.caseDTOObject.ecadbapplianceId == 0) {
            this.errorMsgCont.processingdb.validator = true;
            return this.errorMsgCont.processingdb.msg = "Please select an item";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.processingdb.validator = false;
        this.errorMsgCont.processingdb.msg = "";
    }
    validateIndexAppliance() {
        if (this.caseDTOObject.ecaindexApplianceId == 0) {
            this.errorMsgCont.processingindex.validator = true;
            return this.errorMsgCont.processingindex.msg = "Please select an item";
        }
        this.toggleTooltip = false;
        this.errorMsgCont.processingindex.validator = false;
        this.errorMsgCont.processingindex.msg = "";
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
    processingdb: MessageModel = new MessageModel();
    processingindex: MessageModel = new MessageModel();
}
