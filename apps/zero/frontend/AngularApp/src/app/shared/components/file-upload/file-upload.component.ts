// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  Input, ElementRef, ViewChild   } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { fromEvent, Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc

import { ENV } from '@env/environment';
import { WMLImage, WMLUIProperty } from '@windmillcode/wml-components-base';
import { ButtonOneParams, ButtonOneParamsTypeEnum } from '../button-one/button-one.component';
import { FormArray, AbstractControl, FormControl } from '@angular/forms';
import { WmlFileUploadComponent, WMLFileUploadItem, WMLFileUploadParams } from '@windmillcode/wml-file-manager';
import { CSSVARS } from '@core/utility/common-utils';



@Component({

  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class FileUploadComponent extends WmlFileUploadComponent  {

  constructor(
    public override  cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService

  ) {
    super(cdref)
  }

  override classPrefix = this.utilService.generateClassPrefix('FileUpload')
  @Input('params') override params: FileUploadParams = new FileUploadParams()
  @HostBinding('class') override myClass: string = this.classPrefix(`View`);

  FileUploadParamsPodTypeEnum = FileUploadParamsPodTypeEnum


  override ngOnInit(): void {
    this.params.button.button.click = this.openFileBrowserToUploadFile
    this.params.button.button.style = {
      ...this.params.button.button.style,
      padding:CSSVARS.spacing5
    }
    this.params.button.text.style ={
      fontSize:CSSVARS.displaySmall,
      fontWeight:"bold"
    }
  }


}


export enum FileUploadParamsPodTypeEnum  {
  PRIMARY,SECONDARY
}
export class FileUploadParams extends WMLFileUploadParams {
  constructor(params:Partial<FileUploadParams>={}){
    super();
    Object.assign(
      this,
      {
        ...params
      }
    )

    if(this.border.type === FileUploadParamsPodTypeEnum.PRIMARY){
      this.border.class = "FileUploadMainBorder0"
    }
    if(this.border.type === FileUploadParamsPodTypeEnum.SECONDARY){
      this.border.class = "FileUploadMainBorder1"
    }
    this.button.type = ButtonOneParamsTypeEnum.SECONDARY

  }
  border= new WMLUIProperty<FileUploadParamsPodTypeEnum>({
    type:FileUploadParamsPodTypeEnum.PRIMARY
  });
  title = new WMLUIProperty({
    text:"Drag File"
  });
  icon = new WMLImage({
    class:"fa-file-lines FileUploadMainIcon0"
  });
  button:ButtonOneParams = new ButtonOneParams()
  subText = new WMLUIProperty();
  override formArray :FormArray<AbstractControl<WMLFileUploadItem>> = new FormArray([])
}


