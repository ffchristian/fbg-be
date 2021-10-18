import * as restify from "restify";
import { IApiController } from "../app/api/IApiController";
import { IInitializable } from "./IInitializable";
import * as CorsMiddleware from "restify-cors-middleware2";
import { connect } from "mongoose";

export class ApiServer implements IInitializable {

  public name: string = "ApiServer";

  public restifyServer?: restify.Server;

  constructor(public apiControllers: IApiController[]) { }

  public async Initialize(): Promise<any> {
    const connectionString: string = process.env.MONGO_URL || "";
    await connect(connectionString, { });

    this.restifyServer = restify.createServer();

    this.restifyServer.use(restify.plugins.queryParser());
    this.restifyServer.use(restify.plugins.bodyParser());

    const cors =  CorsMiddleware({
      preflightMaxAge: 5,
      origins: ["*", /^http?:\/\/localhost(:[\d]+)?$/],
      allowHeaders: ["*"],
      exposeHeaders: []
    });

    this.restifyServer.pre(cors.preflight);
    this.restifyServer.use(cors.actual);

    this.apiControllers.forEach((apiController) => {
      if (this.restifyServer !== undefined) {
        apiController.register(this.restifyServer);
      }
    });

    console.log("rest server starting...");

    return new Promise<void>((resolve, reject) => {
      if (this.restifyServer !== undefined) {
        this.restifyServer.listen(process.env.PORT, () => {
          if (this.restifyServer !== undefined) {
            console.log("%s is online on %s", this.restifyServer.name, this.restifyServer.url);
          }
          resolve();
        });
      }

    });
  }

}
