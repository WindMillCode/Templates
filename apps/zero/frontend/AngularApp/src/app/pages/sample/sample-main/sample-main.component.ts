// angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit,  } from '@angular/core';



// services
import { ConfigService } from '@app/core/config/config.service';
import { UtilityService } from '@app/core/utility/utility.service';
import { BaseService } from '@core/base/base.service';


// rxjs
import { Subject } from 'rxjs';
import { takeUntil,tap } from 'rxjs/operators';

// misc

import { ENV } from '@env/environment';
import { WMLImage, WMLUIProperty,WMLRoute } from '@windmillcode/wml-components-base';
import { SectionsTwoParams, SectionsTwoParamsPartsType, SectionsTwoParamsPartsTypeMultilineBulletType, SectionsTwoParamsPartsTypeMultilineBulletUIProperty } from '@shared/components/sections-two/sections-two.component';
import { ResumeService, SubmitFormToAnalyzeResumeUIResponseBody } from '@shared/services/resume/resume.service';
import { FormsService } from '@shared/services/forms/forms.service';



@Component({

  selector: 'sample-main',
  templateUrl: './sample-main.component.html',
  styleUrls: ['./sample-main.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush



})
export class SampleMainComponent  {

  constructor(
    public cdref:ChangeDetectorRef,

    public utilService:UtilityService,
    public configService:ConfigService,
    public baseService:BaseService,
    public resumeService:ResumeService,
    public formsService:FormsService
  ) { }

  classPrefix = this.utilService.generateClassPrefix('SampleMain')



  @HostBinding('class') myClass: string = this.classPrefix(`View`);
  ngUnsub= new Subject<void>()

  companyLogo = new WMLImage({
    src:"assets/media/sampleMain/nba-logo.png",
    alt:"SampleMain.companyLogoAlt"
  })
  resultsSection = new SectionsTwoParams({
    title:new WMLUIProperty({
      text:"SampleMain.sections.results.title"
    }),
    parts:[
      new WMLUIProperty({
        type:SectionsTwoParamsPartsType.STRIKETHRU
      })
    ]
  })
  factsSection = new SectionsTwoParams({
    title:new WMLUIProperty({
      text:"SampleMain.sections.facts.title"
    }),
    parts:[]
  })
  newsSection = new SectionsTwoParams({
    title:new WMLUIProperty({
      text:"SampleMain.sections.news.title"
    }),
    parts:[]
  })

  recruiterQuestionsSection = new SectionsTwoParams({
    title:new WMLUIProperty({
      text:"SampleMain.sections.questions.title"
    }),
    parts:[]
  })

  populateCompanyInfo =(data?:SubmitFormToAnalyzeResumeUIResponseBody["role"],logo?:SubmitFormToAnalyzeResumeUIResponseBody["companyLogoUrl"])=>{
    this.companyLogo.text =  data ?? "SampleMain.companyLogoText"
    this.companyLogo.src =  logo ?? "assets/media/app/logo.png"
  }
  populateResults = (data?:SubmitFormToAnalyzeResumeUIResponseBody["interviewer"])=>{
    let questions =  Array(3)
    .fill(null)
    .map((nullVal,index0)=>{
      return new WMLUIProperty({
        text:"SampleMain.sections.results.questions.bullets."+index0,
        type:SectionsTwoParamsPartsType.BULLET,
        value:index0
      })
    })

    let answers= Array(3)
    .fill(null)
    .map((nullVal,index0)=>{
      return new WMLUIProperty({
        text:"SampleMain.sections.results.answers.bullets."+index0,
        type:SectionsTwoParamsPartsType.BULLET,
        value:index0
      })
    });

    if(data){
      questions = data.map((pair,index0)=>{
        return new WMLUIProperty({
          text:pair.question,
          type:SectionsTwoParamsPartsType.BULLET,
          value:index0
        })
      })
      answers = data.map((pair,index0)=>{
        return new WMLUIProperty({
          text:pair.answer,
          type:SectionsTwoParamsPartsType.BULLET,
          value:index0
        })
      })
    }

    [
      new WMLUIProperty({
        text:"SampleMain.sections.results.questions.title",
        type:SectionsTwoParamsPartsType.TITLE
      }),
      ...questions,
      new WMLUIProperty({
        type:SectionsTwoParamsPartsType.STRIKETHRU
      }),
      new WMLUIProperty({
        text:"SampleMain.sections.results.answers.title",
        type:SectionsTwoParamsPartsType.TITLE
      }),
      ...answers,
    ]
    .forEach((item:any)=>{
      this.resultsSection.parts.push(item)
    })


  }
  populateFacts = (data?:SubmitFormToAnalyzeResumeUIResponseBody["facts"])=>{
    let facts =Array(3)
    .fill(null)
    .map((nullVal,index0)=>{
      return       new WMLUIProperty({
        text:"SampleMain.sections.facts.bullets."+index0,
        type:SectionsTwoParamsPartsType.BULLET,
        value:index0
      })
    })
    if(data){
      facts = this.covertAIResponsesToBulletFormat( data)
    }
    facts
    .forEach((item:any)=>{
      this.factsSection.parts.push(item)
    })
  }
  populateNews = (data?:SubmitFormToAnalyzeResumeUIResponseBody["news"])=>{
    let news:any= [
      new SectionsTwoParamsPartsTypeMultilineBulletUIProperty({
        multiline:[
          new WMLRoute({
            text:"SampleMain.sections.news.bullets.0",
          }),
          new WMLRoute({
            route:"https://www.washingtonpost.com/sports/2021/02/05/nba-wearable-technology/",
            text:"https://www.washingtonpost.com/sports/2021/02/05/nba-wearable-technology/",
            type:SectionsTwoParamsPartsTypeMultilineBulletType.LINK
          })
        ],
        type:SectionsTwoParamsPartsType.MULTILINE_BULLET,
        value:0
      }),
      new SectionsTwoParamsPartsTypeMultilineBulletUIProperty({
        multiline:[
          new WMLRoute({
            text:"SampleMain.sections.news.bullets.1",
          }),
          new WMLRoute({
            route:"https://www.nba.com/news/nba-launches-nba-vr-app",
            text:"https://www.nba.com/news/nba-launches-nba-vr-app",
            type:SectionsTwoParamsPartsTypeMultilineBulletType.LINK
          })
        ],
        type:SectionsTwoParamsPartsType.MULTILINE_BULLET,
        value:1
      }),
      new SectionsTwoParamsPartsTypeMultilineBulletUIProperty({
        multiline:[
          new WMLRoute({
            text:"SampleMain.sections.news.bullets.2",
          }),
          new WMLRoute({
            route:" https://www.nba.com/article/2020/12/02/nba-replay-center-expansion",
            text:" https://www.nba.com/article/2020/12/02/nba-replay-center-expansion",
            type:SectionsTwoParamsPartsTypeMultilineBulletType.LINK
          })
        ],
        type:SectionsTwoParamsPartsType.MULTILINE_BULLET,
        value:2
      })
    ]
    if(data){
      news = this.covertAIResponsesToBulletFormat( data)
    }
    news
    .forEach((item:any)=>{
      this.newsSection.parts.push(item)
    })
  }
  populateRecruiterQuestions = (data?:SubmitFormToAnalyzeResumeUIResponseBody["candidateQuestions"])=>{
    let recruiterQuestions = Array(3)
    .fill(null)
    .map((nullVal,index0)=>{
      return       new WMLUIProperty({
        text:"SampleMain.sections.questions.bullets."+index0,
        type:SectionsTwoParamsPartsType.BULLET,
        value:index0
      })
    })
    if(data){
      recruiterQuestions = this.covertAIResponsesToBulletFormat( data);
    }

    recruiterQuestions
    .forEach((item:any)=>{
      this.recruiterQuestionsSection.parts.push(item)
    })
  }

  listenForInterviewPrepInfo = ()=>{
    return this.resumeService.submitFormToAnalyzeResumeSubj
    .pipe(
      takeUntil(this.ngUnsub),
      tap((res)=>{

        this.populateCompanyInfo(res?.role,res?.companyLogoUrl)
        this.populateResults(res?.interviewer)
        this.populateFacts(res?.facts)
        this.populateNews(res?.news)
        this.populateRecruiterQuestions(res?.candidateQuestions)


      })
    )

  }

  private covertAIResponsesToBulletFormat( data: string[]) {
    return data.map((text, index0) => {
      return new WMLUIProperty({
        text,
        type: SectionsTwoParamsPartsType.BULLET,
        value: index0
      });
    });
  }

  ngOnInit(): void {
    this.listenForInterviewPrepInfo().subscribe()
  }

  ngOnDestroy(){
    this.ngUnsub.next();
    this.ngUnsub.complete()
  }

}




