import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ElementRef, Renderer, ApplicationRef, NgZone, ChangeDetectorRef } from "@angular/core"
 import { Subject } from "rxjs/Subject";
@Component({
    selector: 'isi-accordion',
    templateUrl: 'static/app/modules/case-setup/treeview-accordion/accordion.component.html',
    styleUrls: ['static/app/modules/case-setup/treeview-accordion/accordion.component.css']
})

export class AccordionComponent implements OnInit, OnChanges {
    @Input() subjectListener: Subject<any> = new Subject();
    @Input() childCounter: any;
    @Input() isRecursive: boolean;
    @Input() isChild: boolean = false;
    @Input() iteratedContent: string;
    @Input() iteratedLabel: string;
    @Input() childIteration: string;
    @Input() object;
    @Input() transition;
    @Input() behavior;
    @Output() selected: EventEmitter<any> = new EventEmitter();
    @Output() expand: EventEmitter<any> = new EventEmitter();
    @Output() childExpand: EventEmitter<any> = new EventEmitter();

    constructor( private elmref: ElementRef, private render: Renderer, private ref: ApplicationRef, private cdr: ChangeDetectorRef ){}

    ngOnInit(){
      // console.log( 'obj', this.object)
      this.subjectListener.subscribe( res =>{
        console.log( 'detect ', res );
        this.object = res;
        console.log('childIteration ', this.object[this.childIteration]);
        console.log( 'object from res' , this.object );
        // this.ref.tick()
      })
    }

    ngOnChange( change: any ){
      if( change.object ) console.log( 'changed ');
    }

    test( val ){
      console.log( 'test', val );
    }

    isChildFolder( val ) {
      // console.log( 'child chceked', val , this.childCounter );
      if( val && this.childCounter && val[this.childCounter].length > 0 )return true;
      return false;
    }

    expandTree( indx, object ){
      let param = {
        index: indx,
        obj: object
      }
      console.log("objID", param)
      if( ! this.isChild ) this.expand.emit( param )
      else {
        // console.log( this.isChild )
        console.log('master', this.object );
        this.childExpand.emit( param )
      }

      // this.ref.tick();
      // this.cdr.detectChanges();
    }

    testChange( event, object ){

      if( event.target.checked && object[this.childIteration] ) {
        // console.log("selected", object)
        // this.selected.emit( object );
          // this.render.setElementProperty(this.elmref.nativeElement[1], 'max-height', 10 + 10 * object[this.childIteration].length + "em")
          // console.log( this.elmref.nativeElement )
          // console.log( event.target.nextSibling.parentElement.childNodes[5]);
          // event.target.nextSibling.parentElement.childNodes[5].maxHeight = 10 + 10* object[this.childIteration].length + "em";
      }
    }

    selectedItem( val ) {
        this.selected.emit( val );
    }
}
