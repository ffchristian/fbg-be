import * as restify from "restify";
export class HealthCheckController {
  public async index(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      res.send([
        { name: "api", status: "ok" }
      ]);
    } catch (error: any) {
      res.send(400, {message: error.message});
    }
    return next();
  }
}
