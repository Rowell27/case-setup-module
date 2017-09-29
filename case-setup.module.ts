import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { Routes, RouterModule }             from '@angular/router';
import { FormsModule }                      from '@angular/forms'
import { CaseSetUpListComponent }           from './component/case-set-up-list.component';
import { CaseSetUpEditComponent }           from './component/case-set-up-edit.component';
import { CaseSetUpViewComponent }           from './component/case-set-up-view.component';
import { CaseDetails }                      from './component/subcomponent/case-details';
import { CasePrimaryCaseAdmin }             from './component/subcomponent/case-primary-case';
import { CaseLogoUpload }                   from './component/subcomponent/case-logo-upload';
import { CaseProcessing }                   from './component/subcomponent/case-processing';
import { CaseReview }                       from './component/subcomponent/case-review';
import { CasePOTF }                         from './component/subcomponent/case-potf';
import { CaseExportFolder }                 from './component/subcomponent/case-export-folder';
import { CaseSetUpEditAddMatterComponent }  from './component/subcomponent/case-set-up-edit-add-matter.component';
import { CaseSetUpEditExportFolderComponent }  from './component/subcomponent/case-set-up-edit-export-folder.component';
import { CaseSetUpManagementService }       from './services/case-set-up.service';
import { MasterMatterService }              from './services/mastermatter.service';
import { PaginatorModule }                  from './../template/modules/paginator.module';
import { FieldSorterModule }                from './../template/modules/field-sorter.module';
import { StepsModule }                      from 'primeng/primeng';
import { ModalModule }                      from './../template/modules/modal.module';
import { AccordionComponent }               from './treeview-accordion/accordion.component';
import { ConfirmationModalModule }          from './../template/modules/confirmation-modal.module';


@NgModule({
    imports: [
      CommonModule,
      PaginatorModule,
      FieldSorterModule,
      FormsModule,
      StepsModule,    
      ModalModule,   
      ConfirmationModalModule,   
      RouterModule.forChild([
          { path: '', component: CaseSetUpListComponent },
          { path: ':mode', component: CaseSetUpEditComponent },
          { path: ':mode/:id', component: CaseSetUpEditComponent },
          { path: ':mode/case/:id', component: CaseSetUpViewComponent }
      ]),
    ],
    declarations: [ 
        CaseSetUpListComponent,
        CaseSetUpViewComponent,
        CaseSetUpEditComponent,
        CaseDetails,
        CasePrimaryCaseAdmin,
        CaseLogoUpload,
        CaseProcessing,
        CaseReview,
        CasePOTF,
        CaseExportFolder, 
        CaseSetUpEditAddMatterComponent,
        CaseSetUpEditExportFolderComponent ,
        AccordionComponent
    ],
    providers: [ CaseSetUpManagementService, MasterMatterService ],
    bootstrap: [ CaseSetUpListComponent ]
})
export class CaseSetupModule { }
