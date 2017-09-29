import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { CaseDTO } from '../../../template/model/session-bean';
import { CaseSetUpEditExportFolderComponent } from './case-set-up-edit-export-folder.component';

@Component({
    selector: 'case-export-folder',
    templateUrl: 'static/app/modules/case-setup/page/subpage/case-export-folder.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css']
})

export class CaseExportFolder {

    // folderPath: string; 

    @Input() viewMode: string;
    @Input() caseDTOObject: CaseDTO;
    @ViewChild(CaseSetUpEditExportFolderComponent) caseSetUpEditExportFolderComponent: CaseSetUpEditExportFolderComponent;

    constructor() { }

    showExportModal(){
        this.caseSetUpEditExportFolderComponent.showModal();
    }
}