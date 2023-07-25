import {Injectable} from '@angular/core';
import {RouterStateSnapshot, TitleStrategy} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {Title} from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

@Injectable()
export class I18NPageTitleStrategy extends TitleStrategy {
  constructor(private translateService: TranslateService,
              private readonly title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);
    this.translateService.get(title??"nav.pageTitle.default").subscribe((translatedTitle) => {
      this.title.setTitle(translatedTitle);
    })
  }
}




export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function waitFori18nextToLoad(translateService: TranslateService): () => Observable<any> {
  return () => {
    return translateService.use('en')
  }
}


