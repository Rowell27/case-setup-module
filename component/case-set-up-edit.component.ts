import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CaseDTO, CaseUserDTO, UIStepMenuItem } from '../../template/model/session-bean';
import { Router, ActivatedRoute }               from '@angular/router';
import { MenuItem }                             from 'primeng/primeng';

import { CaseSetUpManagementService }           from "../services/case-set-up.service";

@Component({
    selector: 'isi-case-set-up-edit',
    templateUrl: 'static/app/modules/case-setup/page/case-set-up-edit.component.html',    
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class CaseSetUpEditComponent implements OnInit {
    arr = [];
    values= [];
    validators= [];
    private caseDTO: CaseDTO = new CaseDTO();
    private steps: UIStepMenuItem[];
    private activeStep : number;
    private action: string;
    private mode: string;
    private modalHeader: string;
    private modalMessage: string;
    private isVisibleConfirmation: boolean = false;
    private next_flag_state: boolean = false;

    // @ViewChild('caseDetails') caseDetails:CaseDetails;
    // @ViewChild('primaryCase') primaryCase:CasePrimaryCaseAdmin;
    // @ViewChild('fileUpload') fileUpload:CaseLogoUpload;

    constructor( private router: Router,
                 private route: ActivatedRoute,
                 private caseSetUpManagementService: CaseSetUpManagementService) {}

    ngOnInit() {
        this.initializeSteps();

        this.route.params.subscribe( params => {
            this.caseDTO.caseId = params['id'];
            this.mode = params['mode'];
            this.loadSelectedCase( this.caseDTO.caseId );
        });      
    }
    
    initializeSteps(){
        this.steps = [
            {label: 'Case Resource', hasErrors: false},
            {label: 'Case Admin Selection', hasErrors: false},
            {label: 'Appliance Selection', hasErrors: false},
            {label: 'Other Setup', hasErrors: false}
        ];
        this.activeStep = 0;
    }

    loadSelectedCase( caseId ) {
        // console.log("loadSelectedCase ID::::", caseId);

        if ( this.mode && this.mode == 'edit' && caseId ) {
            this.caseSetUpManagementService.getMasterCase( caseId )
                .subscribe( res => {
                    this.caseDTO = res;
                    // console.log("caseDTODetails ::::::", this.caseDTO)
                });
        }
        // console.log( "steps:::", this.steps);
    }

    validateStep( values ) {
        if(values['name']){
            // this.validators = [];
            // this.arr = [];

            this.validators.push( values['obj'] );
            console.log("Validators:::", this.validators);
            // if( this.validators['validators'] )

            this.validators.filter ( validate => {
                // console.log('validate' , this.validators.length);
                let counter: number = 0;
                for( let key in validate ){
                    counter++;
                    console.log("Validators:::" + counter + " - " +  (this.validators.length * 2) );
                    if ( counter == this.validators.length * 2 ) {
                        console.log("hahahahahah!!");
                        return this.validators = [];
                    }
                    this.arr.push( validate[ key ] );
                }
            });
            console.log('arrrrrrrrr', this.arr );

            let ctr: number = 0;
            for (let key in this.arr) {
                console.log( 'key', key, this.arr[key].validator)
                ctr++;
                console.log("Arrrr:::" + ctr + " = " + this.arr.length);
                if ( this.arr[key].validator ) {
                    this.steps[ this.activeStep ].hasErrors = true;
                    console.log( "STEPS:::", this.steps[ this.activeStep ].hasErrors );
                    break;
                }
                else this.steps[ this.activeStep ].hasErrors = false;

                if ( ctr == this.arr.length ) return this.arr = [];
            }

            // this.validators.filter( values => {
            //     for (let key in values) {
            //         console.log( 'key', key, values[key].validator)
            //         if( values[key].validator ) {
            //             this.steps[ this.activeStep ].hasErrors = true;
            //             break;
            //         }
            //         else this.steps[ this.activeStep ].hasErrors = false;
            //     }
            //     console.log("Validators(count):::", this.validators.length);
            //     this.validators = [];
            //     console.log("Validators(after LOOP)::", this.validators);
            // });

            
            // console.log("values (with NAME)::::", values['name']);
            // if( !values.flag ) {
            //     console.log('flag ("If" PASSED) :::', values.flag)
            //     this.values = values;
            //     this.arr.push( this.values['obj']) 
            // }
            // else {
            //     console.log('flag PASSED! arr (VALUES) :::', this.arr)
            //     this.arr.filter( re =>{
            //         console.log('re (FILTERED)', re)
            //         if( re != values['obj']) {
            //             re = values['obj']
            //             console.log( 're VALUES (FETCH from values[obj]) :::', re );
            //             // console.log('pusssh', values['obj'])
            //         }
            //     })
            // }       
            // // console.log( 'keys ()', values );
      
            // this.arr.filter( arg =>{
            //     console.log( 'arg (FILTERED)::::', arg );
            //     for( let key in arg ){
            //         console.log(key , arg[key].validator );
                    
            //         if( arg[key].validator ) {                        
            //             this.steps[ this.activeStep ].hasErrors = true;
            //             console.log("STEPS (if)!:: ", key , this.steps[this.activeStep].label, this.steps[this.activeStep].hasErrors)
            //             // this.validators.push( arg[key].validator );
            //             break;
            //         }
            //         else this.steps[ this.activeStep ].hasErrors = false;
            //         console.log("STEPS (else)!:: ", key , this.steps[this.activeStep].label, this.steps[this.activeStep].hasErrors)
            //         // else validators.push( false );
            //     }
                
            // })
            
        }
        else{
            for (let key in values) {
                console.log( 'key', key, values[key].validator)
                if( values[key].validator ) {
                    this.steps[ this.activeStep ].hasErrors = true;
                    break;
                }
                else this.steps[ this.activeStep ].hasErrors = false;
            }
            // this.looper( values )
        }
    }


    looper( obj ){
        for (let key in obj) {
            console.log( 'key', key, obj[key].validator)
            if( obj[key].validator ) {
                this.steps[ this.activeStep ].hasErrors = true;
                break;
            }
            else this.steps[ this.activeStep ].hasErrors = false;
        }
    }

    initializeModal( type ) {
        this.isVisibleConfirmation = true;
        // this.action = type;
        // if ( type == 'submit') this.modalMessage = "Are you sure you want to save changes?";
        // else this.modalMessage = "Are you sure you want to cancel changes?";
    }

    onCancel() {
        this.isVisibleConfirmation = false
        $('.ui-modal-bg').remove();
    }

    submitCase() {
        this.caseDTO.createdByUserId = 0;
        this.caseDTO.masterClient = 1;
        this.caseDTO.caseFileRepository = '';
        this.caseDTO.webUrl = '';

        this.caseDTO.newCase = (this.mode == 'add' && !this.caseDTO.caseId ? true : false);
        this.caseDTO.isNewCaseAdmin = (!this.caseDTO.caseAdminId ? true : false);
        
        console.log("CaseDTO: ", this.caseDTO);
        this.caseSetUpManagementService.createCase( this.caseDTO )
            .subscribe( res => {
                // this.caseDTO = new CaseDTO();
                console.log("Finished!");
            });
    }

    routeToList() {
        setTimeout((router: Router) => {
            this.router.navigate(['case-setup']);;
        }, 1000);
    }

    applyclass(){
        let element = document.getElementById('psteps');
        // element.children
        // console.log( 'element', element.children[0].children[0].children );
    }

}


