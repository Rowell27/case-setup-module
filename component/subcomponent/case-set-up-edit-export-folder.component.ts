import { Component, OnInit, Input, Output, EventEmitter, ViewChild, NgZone } from '@angular/core';
import { Form } from '@angular/forms';
import 'rxjs/Rx';
import { MasterExportFolderDTO, MasterExportFolderListDTO } from '../../../template/model/session-bean';
import { Subject } from "rxjs/Subject"
import { CaseSetUpManagementService } from '../../services/case-set-up.service';

@Component({
    selector: 'isi-export-folder-modal',
    templateUrl: 'static/app/modules/case-setup/page/modal/case-set-up-edit-export-folder.component.html',
    styles: ['static/app/modules/case-setup/styles/case-set-up.component.css'],
    providers: [CaseSetUpManagementService]
})

export class CaseSetUpEditExportFolderComponent implements OnInit {
    subjectPasser: Subject<any> = new Subject();
    masterExportFolderListDTO: MasterExportFolderListDTO;
    masterExportFolderDTO: MasterExportFolderDTO;
    folderPath: string;
    toggleModal: boolean = false;
    hasError: boolean = false;

    @Output() emitSelectedFolder: EventEmitter<any> = new EventEmitter();

    constructor( private caseSetUpManagementService: CaseSetUpManagementService, private zone: NgZone ) {
        this.masterExportFolderListDTO = new MasterExportFolderListDTO();
        this.masterExportFolderDTO = new MasterExportFolderDTO();
    }

    ngOnInit() {
        this.buildExportFolderTree();
    }

    showModal() {
        this.toggleModal = true;
    }

    close() {
        this.toggleModal = false;
    }

    reset() {
        this.buildExportFolderTree();
    }

    buildExportFolderTree() {
        this.caseSetUpManagementService.buildFolderTree()
            .subscribe(response => this.loadInitialFolderList());
    }

    loadInitialFolderList() {
        this.caseSetUpManagementService.getInitFolderList()
            .subscribe(response => {
                this.masterExportFolderListDTO = response;
                // console.log("Init folder: ", this.masterExportFolderListDTO);
            });
    }

    loadChildFolderList( arg? ) {
        if( arg ) console.log('arg', arg )
        // if( this.masterExportFolderListDTO )
        if( arg.obj.children.length > 0 ) return; 
        this.caseSetUpManagementService.getChildFolderList( arg.obj )
            .subscribe(response => {
                arg.obj.children = response;
                this.subjectPasser.next( this.masterExportFolderListDTO );
                // console.log( "Childrens: ", response )
                console.log('argObj =-=-=-=-=-=-=-=-=-=-=-=-=', arg.obj.children);
                console.info('TOP --------------------------->', this.masterExportFolderListDTO);
        });

    }

    onClickSubmitSelection( folderPath ) {
        if ( folderPath ) this.emitSelectedFolder.emit( folderPath );
        this.close();
    }

    onClickCancel() {
        this.close();
    }

    selectedPath( value ) {
        console.log( 'get value', value );
        if( value && value.folderId != 1 ) {
            this.folderPath = value.path; 
        }
    }
}