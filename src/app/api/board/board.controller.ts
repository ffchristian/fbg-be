import * as restify from "restify";
import { initializeBoard } from "../../../utils";
import Board from "./board.model";
interface IBoardInput {
  coordinates: {x: number, y: number};
  value: boolean;
}
export class BoardController {
  private boardSize = {width: 15, height: 15};
  public async findByBoardName(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      const boardName = req.params.boardName;
      if (!boardName) {
        throw {message: "The body data was not set correctly.", statuCode: 400 };
      }
      let board = await Board.findOne({name: boardName}).exec();
      if (!board) {
        board = new Board({name: boardName, matrixData: initializeBoard(this.boardSize.width, this.boardSize.height)});
      }
      else {
        board.findBiggestRectangleFromSelectedOnes();
      }
      await board.save();
      return res.send(200, {area: board.area, matrixData: board.matrixData, lRectCoodinates: board.lRectCoodinates});
    } catch (error: any) {
      if (error.statuCode) {
        return res.send(error.statuCode, {message: error.message});
      }
      res.send(500, {message: error.message});
    }
    return next();
  }

  public async updateByBoardName(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      const boardName: string = req.params.boardName;
      const { coordinates,  value}: IBoardInput = req.body;
      if (!coordinates || value === undefined || !boardName) {
        throw {message: "The body data was not set correctly.", statuCode: 400 };
      }
      const board = await Board.findOne({name: boardName}).exec();
      if (!board) {
        throw {message: "The board you're looking for was not found", statuCode: 404 };
      }
      board.area = !!value ? board.area + 1 : board.area - 1;
      const data = board.matrixData;
      data[coordinates.x][coordinates.y] = value;
      board.matrixData = [];
      board.set("matrixData", data);
      board.findBiggestRectangleFromSelectedOnes();
      await board.save();
      return res.send(200, {area: board.area, lRectCoodinates: board.lRectCoodinates});
    } catch (error: any) {
      if (error.statuCode) {
        return res.send(error.statuCode, {message: error.message});
      }
      res.send(500, {message: error.message});
    }
    return next();
  }
  public async bulkUpdateByBoardName(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      const { bulkData }: { bulkData: IBoardInput[] } = req.body;
      const { boardName }: { boardName: string } = req.params.name;
      if (!bulkData || !boardName) {
        throw {message: "The body data was not set correctly.", statuCode: 400 };
      }
      const board = await Board.findOne({name: boardName}).exec();
      if (!board) {
        throw {message: "The board you're looking for was not found", statuCode: 404 };
      }
      bulkData.forEach( (data: IBoardInput) => {
        board.matrixData[data.coordinates.x][data.coordinates.y] = data.value;
      });
      board.findBiggestRectangleFromSelectedOnes();
      await board.save();
      return res.send(200, {lRectCoodinates: board.lRectCoodinates});
    } catch (error: any) {
      if (error.statuCode) {
        return res.send(error.statuCode, {message: error.message});
      }
      res.send(500, {message: error.message});
    }
    return next();
  }
  public async reset(req: restify.Request, res: restify.Response, next: restify.Next) {
    try {
      const boardName = req.params.boardName;
      if (!boardName) {
        throw {message: "The body data was not set correctly.", statuCode: 400 };
      }
      const board = await Board.findOne({name: boardName}).exec();
      if (!board) {
        throw {message: "The board you're looking for was not found", statuCode: 404 };
      }
      board.matrixData = [];
      board.set("matrixData", initializeBoard(this.boardSize.width, this.boardSize.height));
      board.area = 0;
      board.lRectCoodinates = [];
      await board.save();
      return res.send(200, {matrixData: board.matrixData, lRectCoodinates: board.lRectCoodinates});
    } catch (error: any) {
      if (error.statuCode) {
        return res.send(error.statuCode, {message: error.message});
      }
      res.send(500, {message: error.message});
    }
    return next();
  }

}
