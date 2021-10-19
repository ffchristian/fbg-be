import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { fidBiggestRectangle, getBiggestRectanguleCoordinates } from "../../../utils";

// Schema
const boardSchema = new Schema<BoardBaseDocument, BoardModel>({
  name: String,
  ipAdress: String,
  // this refers to the touched cells in the board
  area: {
    type: Number,
    default: 0
  },
  // this refers to the saved coodinates to print the largest contine rectangle
  lRectCoodinates: {
    type: [],
    required: true
  },
  // this refers to the last state of the board
  matrixData: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

export interface Board {
  _id: Types.ObjectId | Record<string, unknown>;
  name: string;
  ipAdress: string;
  area: number;
  lRectCoodinates: { x: number, y: number}[];
  matrixData: any;
  findBiggestRectangleCoordinates(boardSize: {width: number, height: number} ): any;
}

export interface BoardBaseDocument extends Board, Document {
  _id: Types.ObjectId | Record<string, unknown>;
}


export interface BoardModel extends Model<BoardBaseDocument> {
  // findCurrentTotal(): Promise<BoardBaseDocument>;
}

// Methods
boardSchema.methods.drawBiggestRectangleFromCoordinates = function(this: BoardBaseDocument): any[] {
  const result: any[] = this.matrixData;
  for (const {x, y} of this.lRectCoodinates) {
    result[x][y] = 2;
  }
  return result;
};

boardSchema.methods.findBiggestRectangleCoordinates = function(this: BoardBaseDocument, boardSize: any): {x: number, y: number}[] {
  const result = fidBiggestRectangle(boardSize.width, boardSize.height,  this.matrixData);
  this.lRectCoodinates = getBiggestRectanguleCoordinates(result.top, result.bottom, result.left, result.right, this.matrixData);
  return this.lRectCoodinates;
};

export default model<BoardBaseDocument, BoardModel>("Board", boardSchema);
