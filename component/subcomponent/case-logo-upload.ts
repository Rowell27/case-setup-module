import { Component, Input, ViewChild, ElementRef, Renderer } from "@angular/core";
import { CaseSetUpManagementService } from '../../services/case-set-up.service';

@Component({
    selector: 'case-logo-upload',
    templateUrl: 'static/app/modules/case-setup/page/subpage/case-logo-upload.html',
    styleUrls: ['static/app/modules/case-setup/styles/case-set-up.component.css']
})

export class CaseLogoUpload {

    imageSrc = 'static/resources/img/logo-login.png';
    
    @Input() viewMode: string;
    @ViewChild('img') image: ElementRef;

    constructor(private render: Renderer) { }

    onChangeFile( val ) {
        let file = val.target.files[0]; 
        let reader = new FileReader();

        reader.addEventListener("load", () => {
            this.imageSrc = reader.result
            this.render.setElementAttribute(this.image.nativeElement, 'src', this.imageSrc);
        }, false)

        if (file) reader.readAsDataURL(file);
    }
}