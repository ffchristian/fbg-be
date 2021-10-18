import * as restify from "restify";
import { IApiController } from "../IApiController";
import { BoardController } from "./board.controller";

export class BoardApi implements IApiController {
  private endpoint = "board";
  constructor(private apiPrefix: string) {
    this.apiPrefix = apiPrefix;
  }
  public register(server: restify.Server): void {
    const boardController = new BoardController();

    server.get(`${this.apiPrefix}/${this.endpoint}/:boardName`, async (req, res, next) => await boardController.findByBoardName(req, res, next));
    server.put(`${this.apiPrefix}/${this.endpoint}/:boardName`, async (req, res, next) => await boardController.updateByBoardName(req, res, next));
    server.put(`${this.apiPrefix}/${this.endpoint}/bulk/:boardName`, async (req, res, next) => await boardController.bulkUpdateByBoardName(req, res, next));
    server.put(`${this.apiPrefix}/${this.endpoint}/reset/:boardName`, async (req, res, next) => await boardController.reset(req, res, next));
  }
}