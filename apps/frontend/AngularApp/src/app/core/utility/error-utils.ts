export class WMLError extends Error {
  constructor(params:Partial<WMLError>={}){
    super(params.message)
    Object.assign(
      this,
      {
        ...params
      }
    )
  }

  openSystemErrorBanner: "false"|"true"= "true"
}
