import { Inject, inject, Injectable } from '@angular/core';
import { BaseService } from '@core/base/base.service';
import { WmlNotifyBarType } from '@windmillcode/angular-wml-notify';
import { SentryErrorHandler,ErrorHandlerOptions } from '@sentry/angular-ivy';
import { ENV } from '@env/environment';
import { WMLError } from '@core/utility/error-utils';


class SentryErrorHandlerOptions implements ErrorHandlerOptions{

}
@Injectable()
export class GlobalErrorHandler extends SentryErrorHandler {
  constructor(@Inject(SentryErrorHandlerOptions) private configs:ErrorHandlerOptions) {
    super(configs)
    this.baseService =  inject(BaseService);

  }
  private baseService
  override handleError(error:Error) {
    if(error instanceof WMLError && error?.openSystemErrorBanner === "false"){
      console.log("not opening default error")
    }
    else{
      this.baseService.openSystemError()
    }
    if(ENV.type!=="dev"){
      super.handleError(error);
    }
    else{
      console.error(error)
    }
    this.handleError = ()=>{}
  }
}
