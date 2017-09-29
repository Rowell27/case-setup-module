import { Component, OnInit, Input, Output, ViewChild, EventEmitter, Renderer, ElementRef } from '@angular/core';
import { Form } from '@angular/forms';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { MasterStatusDTO, MasterMatterListDTO, MasterMatterDTO } from '../../../template/model/session-bean';
import { CaseSetUpManagementService } from '../../services/case-set-up.service';
import { MasterMatterService } from '../../services/mastermatter.service';

@Component({
    selector: 'isi-add-matter-modal',
    templateUrl: 'static/app/modules/case-setup/page/modal/case-set-up-edit-add-matter.component.html',
    styles: ['static/app/modules/case-setup/styles/case-set-up.component.css'],
    providers: [CaseSetUpManagementService, MasterMatterService]
})

export class CaseSetUpEditAddMatterComponent implements OnInit {

    @Input() isModalAddMatterVisible: boolean = false;
    @Output() emitCreatedMatter: EventEmitter<any> = new EventEmitter();
    @ViewChild('tooltip') tooltip: ElementRef;

    public masterMatterModel: MasterMatterDTO = new MasterMatterDTO();
    public masterMatterList: MasterMatterListDTO = new MasterMatterListDTO();
    private errorMessage: string = '';
    private hasDuplicate: boolean = false;
    private toggleTooltip: boolean = false;


    constructor(private masterMatterService: MasterMatterService,
        private caseSetUpManagementService: CaseSetUpManagementService,
        private render: Renderer) { }

    private masterStatusDTOList: MasterStatusDTO[] = [
        { statusId: 1, statusDescription: 'Active' },
        { statusId: 2, statusDescription: 'Inactive' },
        { statusId: 3, statusDescription: 'ReadOnly' }];


    showModalAddMatter() {
        this.isModalAddMatterVisible = true;
        this.masterMatterModel.matterStatus = 1;
        this.masterMatterModel.clientId = 0;
        this.masterMatterModel.matterDescription = '';
        this.masterMatterModel.matterName = '';
        this.masterMatterModel.matterId = 0;
    }

    clearModel() {
        this.masterMatterModel = new MasterMatterDTO();
    }

    close() {
        this.errorMessage = "";
        this.isModalAddMatterVisible = false;
    }

    loadMatterList() {
        this.caseSetUpManagementService.getMatterList(this.masterMatterList)
            .subscribe(response => this.masterMatterList.resultList = response);
    }

    onSubmitMatter() {
        this.masterMatterService.saveMatter(this.masterMatterModel).subscribe(response => {
            this.emitCreatedMatter.emit(response);
            this.clearModel();
            this.close();
        });

    }

    onCancel() {
        this.close();
    }

    validateFields() {
        if (this.masterMatterModel.matterName === '') return this.errorMessage = "Value is required.";
        if (this.masterMatterModel.matterName.length < 3) return this.errorMessage = "Must have at least 3 characters";
        if (!this.masterMatterModel.matterName.match(/^[a-zA-Z0-9]+$/)) return this.errorMessage = "Must only contain numbers, upper/lower case letters only";
        if (this.checkDuplicateMatter()) return this.errorMessage = "Duplicate Matter Name.";
        this.errorMessage = "";
        this.toggleTooltip = false;
    }

    checkDuplicateMatter() {
        this.masterMatterService.isMatterNameExist(this.masterMatterModel).subscribe(response => this.hasDuplicate = response);
        if (this.hasDuplicate) return this.hasDuplicate;
    }

    displayError(event, message) {
        if (!message) return this.errorMessage = "";
        this.errorMessage = message;
        this.displayToolTip(event, message);
    }

    displayToolTip(event, message: string) {
        // console.log(event.type, message, this.toggleTooltip);
        if (event.type != 'mouseover' || !message) return this.toggleTooltip = false;
        Observable.fromEvent(document.body, 'mousemove').subscribe( e => {
            if ( !this.tooltip ) return;
            this.render.setElementStyle(this.tooltip.nativeElement, 'left', (e.pageX - 590) + 'px');
            this.render.setElementStyle(this.tooltip.nativeElement, 'top', (e.pageY - 330) + 'px');
            this.render.setElementStyle(this.tooltip.nativeElement, 'width', '120px');
        })
        this.toggleTooltip = true;
    }


    // txtMatterName_OnBlur(isValid: boolean) {
    //     // console.log('IS VALID ' + isValid);
    //     if (isValid == false) {
    //         this.errorMessage = 'Value is Required';
    //     }
    //     if (this.masterMatterModel.matterName.length >= 3) {
    //         // console.log(this.masterMatterModel.matterName);
    //         this.masterMatterService.isMatterNameExist(this.masterMatterModel).subscribe(
    //             response => {
    //                 this.hasDuplicate = <boolean>response;
    //                 // console.log('DUPLICATE ' + this.hasDuplicate);
    //                 if (this.hasDuplicate == true) {
    //                     this.errorMessage = 'Duplicate Matter Name';
    //                 } else {
    //                     this.hasDuplicate = false;
    //                     this.errorMessage = '';
    //                 }//end else
    //             }
    //         );
    //     }
    // }
}