import { Component, OnInit, Input } from "@angular/core";
import { CaseDTO } from '../../../template/model/session-bean';

@Component({
    selector : 'case-potf',
    templateUrl : 'static/app/modules/case-setup/page/subpage/case-potf.html',
    styleUrls : ['static/app/modules/case-setup/styles/case-set-up.component.css']
})

export class CasePOTF implements OnInit {

    @Input() viewMode: string;
    @Input() caseDTOObject: CaseDTO;
    constructor () {}

    ngOnInit() {
        this.caseDTOObject.ocrtimeout = 2;
        this.caseDTOObject.maxFileSize = 20;
    }
}