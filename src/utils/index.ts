const findDivisors = (n: any, limit: number = 15): any => {
  const divisorsArr: any = [];
  for (let i = 2; i * i <= n; ++i) {
    if (n % i === 0) {
      if (i > limit) { return findDivisors(n - 1); }
      divisorsArr.push(i);
      if (i !== n / i) {
        if (n / i > limit) {
          divisorsArr[divisorsArr.lenght - 1] = undefined;
          return findDivisors(n - 1);
        }
        divisorsArr.push(n / i);
     }
   }
}

  if ( n === 0 ) {
    return [0];
  }
  if (!divisorsArr.length) {
    return findDivisors(n - 1);
  }
  return divisorsArr;
};
export const getCombinations = (n: number) => {
  const divisorsArr = findDivisors(n);
  if (divisorsArr.length === 1) {
    return [{ROWS: divisorsArr[0], COLS: divisorsArr[0]}];
  }
  const results = [];
  for (let i = 0; i * i <= divisorsArr.length; i += 2) {
    if (i + 1 < divisorsArr.length) {
      results.push({ROWS: divisorsArr[i], COLS: divisorsArr[i + 1]});
      results.push({COLS: divisorsArr[i], ROWS: divisorsArr[i + 1]});
    } else {
      results.push({COLS: divisorsArr[i], ROWS: divisorsArr[i]});
    }
  }
  return results;
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
