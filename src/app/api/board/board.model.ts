import { Document, Model, model, Types, Schema, Query } from "mongoose";
import { getCombinations } from "../../../utils";

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
  findBiggestRectangleFromSelectedOnes(): any[];
  drawBiggestRectangleFromCoordinates(): any[];
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
boardSchema.methods.findBiggestRectangleFromSelectedOnes = function(this: BoardBaseDocument): any[] {
  // clousure to reset inner properties and save repetitive code
  const resetComonProperties = () => {
    this.lRectCoodinates = [];
    usedArea.x = 0;
    usedArea.y = 0;
  };

  // getting all possible combinations of cols and rows
  const rowsColArr = getCombinations(this.area);
  // int all properties
  const usedArea = {x: 0, y: 0};
  this.lRectCoodinates = [];
  let trier = 0;

  // Due the selected area there are one or many combinations for cols and rows
  // to make the largest rectagule so we loop in the possibilities
  for (const rowsColItem of rowsColArr) {
    const ROWS = rowsColItem.ROWS;
    const COLS = rowsColItem.COLS;
    let colIndexCotinuer = 0;
    // looping into the board game MATRIX
    for (let x = 0; x < this.matrixData.length; x++) {
      usedArea.x = 0;
      for (let y = 0; y < this.matrixData[x].length; y++) {

        // if the area used in the first loop is the same as the amount of possibles ROWS
        // it means the rectanglue needs to be continued below
        if (usedArea.x === ROWS) { break; }

        // if the possition is free and the possition above (if exist) and the looped are is still between the continuer
        // wich dictates where to continue the drawing once the area in x was reached
        // then save the possition on the coodinates structure
        if (this.matrixData[x][y] === false
            && ( (!!this.matrixData[x - 1] && this.matrixData[x - 1][y] === false && (y >= colIndexCotinuer && y <= colIndexCotinuer + (ROWS - 1)) )
            && (usedArea.y <= this.matrixData.length && usedArea.y <= this.matrixData[0].length )
            || usedArea.y === 0)
        ) {

          this.lRectCoodinates.push({x, y});
          if (usedArea.x === 0 && usedArea.y === 0) {
            colIndexCotinuer = y;
          }
          usedArea.x++;
        }
        // if the continuity is broken we figure below the reason and depens on it
        // we reset the resetComonProperties and do some other ajustments
        if ( (this.matrixData[x][y] === true && y >= colIndexCotinuer)
            || usedArea.y > this.matrixData.length || usedArea.y > this.matrixData[0].length) {
          resetComonProperties();
          if (colIndexCotinuer + ROWS > this.matrixData[x].length) {
            colIndexCotinuer = 0;
          } else if (x + COLS > this.matrixData.length) {
            colIndexCotinuer--;
            x = 0;
            trier++;
          } else if ((!!this.matrixData[x - 1] && this.matrixData[x - 1][y] === false) ) {
            if (y > 0 && this.matrixData[x - 1][y - 1] === false) { colIndexCotinuer++; }
            x --;
            y = colIndexCotinuer;
            trier++;
          } else if (!this.matrixData[x - 1]) {
            colIndexCotinuer++;
            y = colIndexCotinuer;
            trier++;
          }
          if (trier >= this.matrixData.length *  this.matrixData.length && this.lRectCoodinates.length !== ROWS * COLS) {
            this.lRectCoodinates = [];
            x = this.matrixData.length - 1;
            y = this.matrixData.length - 1;
          }
        }
      }
      if (this.lRectCoodinates.length) { usedArea.y++; }
      if (this.lRectCoodinates.length === ROWS * COLS) {
        return this.lRectCoodinates;
      }
    }
  }
  return [];
};

export default model<BoardBaseDocument, BoardModel>("Board", boardSchema);
