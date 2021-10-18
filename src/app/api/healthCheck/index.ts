import * as restify from "restify";
import { IApiController } from "../IApiController";
import { HealthCheckController } from "./healthCheck.controller";

export class HealthCheckApi implements IApiController {
  constructor(private apiPrefix: string) {
    this.apiPrefix = apiPrefix;
  }
  public register(server: restify.Server): void {
    const healthCheckController = new HealthCheckController();

    server.get(`${this.apiPrefix}`, async (req, res, next) => await healthCheckController.index(req, res, next));

  }
}