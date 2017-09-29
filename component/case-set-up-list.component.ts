import { Component, OnInit, ViewChild }     from '@angular/core';
import { Router, ActivatedRoute }           from '@angular/router';
import { Paginator, MasterCaseListDTO }     from './../../template/model/session-bean';
import { FieldSorterComponent }             from './../../template/modules/field-sorter.module';
import { CaseSetUpManagementService }       from './../services/case-set-up.service';
import { Subject }                          from 'rxjs/Subject'

@Component({
    selector: 'isi-case-set-up-list',
    templateUrl:'static/app/modules/case-setup/page/case-set-up-list.component.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css'],
    providers: [CaseSetUpManagementService]
})

export class CaseSetUpListComponent implements OnInit {

    masterCaseList: MasterCaseListDTO;
    caseName: string = '';
    matterName: string = '';
    caseStatus: string = '';
    lastEditedElement: string = '';
    keywordsListCase = {};
    keywordsListMatter = {};
    idx: number = 0;
    disableColumnFilter: boolean = false;
    sortField_caseName: string = 'caseName';
    sortField_matterName: string = 'matterName';
    sortField_statusId: string = 'statusId';

    indexListener: Subject<any> = new Subject();
    @ViewChild('paginatorCaseList') paginatorCaseList: ElementRef;
    @ViewChild('sortCaseName') sortItems_caseName: ElementRef;
    @ViewChild('sortMatterName') sortItems_matterName: ElementRef;
    @ViewChild('sortCaseStatus') sortItems_caseStatus: ElementRef;

    constructor( private caseSetUpManagementService: CaseSetUpManagementService, private router: Router ) { }
    
    ngOnInit() {
        this.masterCaseList = new MasterCaseListDTO();
        this.masterCaseList.resultList = [];

        this.loadMasterCaseList();
    }

    loadMasterCaseList() {
        this.caseSetUpManagementService.getCaseList(this.masterCaseList)
            .subscribe( response => { 
                this.masterCaseList = response;
                console.log("masterCaseList: ", this.masterCaseList);
            }, error => console.log("Error: ", error))
    }

    onPaginate(value: number) {
        this.masterCaseList.currentPage = <number>value;
        if (this.paginatorCaseList != undefined) this.masterCaseList.viewPerPage = this.paginatorCaseList.itemsPerPage;
        this.loadMasterCaseList();
    }

    filterEvent( id, value, event) {
        this.lastEditedElement = id;
        if((event.type === "keyup" && event.key === "Enter") || event.type === "change") {
            this.masterCaseList.restrictions = [];
            this.executeSearch( id, value);
            this.onBlur();
        }
    }

    executeSearch( eventSource: string, filterValue:string ) {
        this.disableColumnFilter = true;

        if ( filterValue.length >= 3 ) {
            if ( eventSource === 'caseNameFilter ') this.caseName = filterValue;
            else if (eventSource === 'matterNameFilter') this.matterName = filterValue;
        } else if (filterValue.length == 1 && eventSource === 'caseStatusFilter') this.caseStatus = filterValue;
        this.collectQuery();
        this.masterCaseList.currentPage = 1;
        this.loadMasterCaseList();
    }

    collectQuery() {
        if ( this.caseName.length > 0 ) this.masterCaseList.restrictions.push( "caseName" + String.fromCharCode(187) + "LIKE" + String.fromCharCode(187) + this.caseName ); 
        if ( this.matterName.length > 0 ) this.masterCaseList.restrictions.push( "matterName" + String.fromCharCode(187) + "LIKE" +  String.fromCharCode(187)  + this.matterName ); 
        if ( this.caseStatus.length > 0 ) this.masterCaseList.restrictions.push( "statusId" + String.fromCharCode(187) + "=" + String.fromCharCode(187) + this.caseStatus );
    }

    clickSearch() {
        this.masterCaseList.restrictions = [];
        this.executeSearch( this.lastEditedElement, '' );
    }

    clearColumnFilterValue() {
        this.caseName = '';
        this.matterName = '';
        this.caseStatus = '';
    }

    onBlur(){
        this.keywordsListMatter = {}
        this.keywordsListCase = {};
    }

    onKeyDown( field, id, event ) {
        let doc = document.getElementById(id);

        if ( !doc || (event.keyCode != 40 && event.keyCode != 38) ) return;
        let list = doc.children;

        console.log( "Selected", doc.children[this.idx].innerHTML, list.length, this.idx );
        if ( field == 'caseNameFilter' ) this.caseName = doc.children[this.idx].innerHTML;
        else this.matterName = doc.children[this.idx].innerHTML;

        if ( event.keyCode == 40 ) this.idx += 1; 
        if ( event.keyCode == 38 ) this.idx -= 1;
        if ( list.length == this.idx ) this.idx = 0;
        if ( this.idx < 0 ) this.idx = list.length - 1;
    
    }


    // selectedKeyword ( id ) {
    //     if ( this.idx == id ) return true;
    //     else return false;
    // }

    autoSuggest( eventSource: string, filterValue ) {
        let criteria;
        this.idx = 0;
        if( !this.caseName ) this.keywordsListCase = {}; 
        if( !this.matterName ) this.keywordsListMatter = {};
        if( filterValue.length < 3 ) return;

        if ( eventSource == 'caseNameFilter') criteria = 'getsuggestedmastercase?caseName=' + filterValue;
        else criteria = 'getsuggestedmastermatters?matterName=' + filterValue;
        this.caseSetUpManagementService.getSuggestions( criteria )
            .subscribe( response => {
                if( eventSource == 'caseNameFilter' ) this.keywordsListCase = response;
                else this.keywordsListMatter = response;
            }, error => console.log("Error: ", error) );
    }

    selectItem( field, value ){
        if ( field == 'caseNameFilter' ) this.caseName = value;
        if ( field == 'matterNameFilter' ) this.matterName = value;
        this.onBlur();
    }

    sortContent( field ) {
        this.checkSortField( field );
        
        if ( this.sortItems_caseName.orderSequence == '' &&  this.sortItems_matterName.orderSequence == '' && this.sortItems_caseStatus.orderSequence == '' ) {
            this.masterCaseList.orderBy = '';
        }
        else {
            if ( field == 'caseNameSort' ) this.masterCaseList.orderBy = this.sortItems_caseName.sortField + ' ' + this.sortItems_caseName.orderSequence;
            if ( field == 'matterNameSort') this.masterCaseList.orderBy = this.sortItems_matterName.sortField + ' ' + this.sortItems_matterName.orderSequence;
            if ( field == 'caseStatusSort') this.masterCaseList.orderBy = this.sortItems_caseStatus.sortField + ' ' + this.sortItems_caseStatus.orderSequence;
        }
        
        this.loadMasterCaseList();
    }

    checkSortField( value ) {
        if ( value == 'caseNameSort') {
            this.sortItems_matterName.resetSortField();
            this.sortItems_caseStatus.resetSortField();
        }
        if ( value == 'matterNameSort') {
            this.sortItems_caseName.resetSortField();
            this.sortItems_caseStatus.resetSortField();
        }
        if ( value == 'caseStatusSort') {
            this.sortItems_caseName.resetSortField();
            this.sortItems_matterName.resetSortField();
        }
    }

    clickReset() {
        this.masterCaseList.restrictions = [];
        this.masterCaseList.orderBy = '';
        this.masterCaseList.currentPage = 1;
        this.sortItems_caseName.resetSortField();
        this.sortItems_matterName.resetSortField();
        this.sortItems_caseStatus.resetSortField();
        this.clearColumnFilterValue();
        this.loadMasterCaseList();
        this.disableColumnFilter = false;
    }

}
