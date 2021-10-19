const getMaxHist = (C: number, row: any[]) => {
  // Create an empty array. The array
  // holds indexes of hist[] array.
  // The bars stored in array are always
  // in increasing order of their heights.
  const result: any = [];
  let topVal; // Top of array
  let left;

  let maxArea = 0; // Initialize max area in current row (or histogram)
  let maxLeft = -1;
  let maxRight = -1;

  let area = 0; // Initialize area with current top

  // Run through all bars of
  // given histogram (or row)
  let i = 0;
  while (i < C) {
    // If this bar is higher than the
    // bar on top array, push it to array
    if (result.length === 0 || row[result[result.length - 1]] <= row[i]) {
        result.push(i++);
    }
    else {
      // If this bar is lower than top
      // of array, then calculate area of
      // rectangle with array top as
      // the smallest (or minimum height)
      // bar. 'i' is 'right index' for
      // the top and element before
      // top in array is 'left index'
      left = result[result.length - 1];
      topVal = row[left];
      result.pop();
      area = topVal * i;

      if (result.length > 0) {
          left = result[result.length - 1] + 1;
          area = topVal * (i - left);
      }

      if (area > maxArea) {
          maxArea = area;
          maxLeft = left;
          maxRight = i - 1;
      }
    }
  }

  // Now pop the remaining bars from
  // array and calculate area with
  // every popped bar as the smallest bar
  while (result.length > 0) {
      left = result[result.length - 1];
      topVal = row[left];
      result.pop();
      area = topVal * i;
      if (result.length > 0) {
          left = result[result.length - 1] + 1;
          area = topVal * (i - left);
      }

      if (area > maxArea) {
          maxArea = area;
          maxLeft = left;
          maxRight = C - 1;
      }
  }
  return {result: maxArea, left: maxLeft, right: maxRight};
};
export const findBiggestRectangle = (R: number, C: number, matrixData: any[]) => {
  let top = 0;
  let bottom = 0;
  const matrix = JSON.parse(JSON.stringify(matrixData));
  for (let i = 1; i < R; i++) {
    for (let j = 0; j < C; j++) {
      matrix[i][j] = matrix[i][j] ? 1 : 0;
    }
  }
  // Calculate area for first row and initialize it as result
  let { result, left, right} = getMaxHist(C, matrix[0]);

  // iterating over row to find maximum rectangular area
  for (let i = 1; i < R; i++) {
    for (let j = 0; j < C; j++) {

        // if matrix[i][j] is 1 then
        // add matrix[i -1][j]
        if (matrix[i][j] === 1) {
            matrix[i][j] += matrix[i - 1][j];
        }
    }
    const maxHistTemp = getMaxHist(C, matrix[i]);
    const tmpResult = maxHistTemp.result;
    const tmpLeft = maxHistTemp.left;
    const tmpRight = maxHistTemp.right;
    // Update result if area with current
    // row (as last row of rectangle) is more
    if (tmpResult > result) {
      left = tmpLeft;
      right = tmpRight;
      bottom = i;
      result = tmpResult;
      top = bottom - (result / (right - left + 1)) + 1;
    }
  }
  return {area: result, top, bottom, left, right};
};
export const getBiggestRectanguleCoordinates = (t: number, b: number, l: number, r: number, A: any[]): any => {
  const coordinates = [];
  for (let x = t; x <= b; x++) {
    for (let y = l; y <= r; y++) {
      coordinates.push({x, y});
    }
  }
  return coordinates;
};
export const initializeBoard = (width: number, height: number) => {
  const matrix = [];
  for (let y = 0; y < height; y++) {
    const cols = [];
    for (let x = 0; x <  width; x++) {
      cols.push(false);
    }
    matrix.push(cols);
  }
  return matrix;
};
