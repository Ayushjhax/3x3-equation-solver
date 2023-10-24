/**
 * Solver
 * Solves a system of linear equations using Cramer's Rule.
 *
 * @name Solver
 * @function
 * @param {Array} input An array of arrays containing the coefficients and the results. Example:
 *
 *    ```js
 *    [
 *        [3, 1, -5, 5],
 *        [4, 2, 7, 19],
 *        [5, -4, 1, 6]
 *    ]
 *    ```
 * @param {Boolean} raw If it is true, the return value will include additional information. Otherwise, the result array will be returned.
 * @return {Object|Array} The actual result (if `raw` is not true) or an object containing the following fields (if `raw` is true):
 *
 *  - `result` (Array): An array of unknown values.
 *  - `coefficients` (Array): An array of arrays containing the coefficients.
 *  - `results` (Array): The equation results.
 *  - `determinant` (Number): The determinant value.
 *  - `determinants` (Array): An array of determinants for each unknown.
 *  - `solved` (Boolean): If `true`, the system has a solution; otherwise, it does not.
 */
function Solver(input, raw) {
    const n = input.length;
    if (n < 2 || input[0].length !== n + 1) {
        throw new Error('Invalid input format');
    }

    const coefficients = [];
    for (let i = 0; i < n; i++) {
        coefficients.push(input[i].slice(0, n));
    }

    const results = input.map(row => row[n]);
    const dd = calculateDeterminant(coefficients);

    let solved = true;
    if (dd === 0) {
        solved = false;
    }

    const determinants = [];
    for (let i = 0; i < n; i++) {
        const modified = coefficients.map((row, j) => {
            const copy = row.slice();
            copy[i] = results[j];
            return copy;
        });
        determinants.push(calculateDeterminant(modified));
    }

    const result = determinants.map(determinant => determinant / dd);

    if (raw) {
        return {
            result,
            results,
            coefficients,
            determinant: dd,
            determinants,
            solved
        };
    }

    return result;
}

function calculateDeterminant(matrix) {
    const n = matrix.length;
    if (n === 1) {
        return matrix[0][0];
    }
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    let det = 0;
    for (let i = 0; i < n; i++) {
        det += matrix[0][i] * calculateDeterminant(matrix.slice(1).map(row => row.filter((_, j) => j !== i))) * (i % 2 === 0 ? 1 : -1);
    }
    return det;
}

module.exports = Solver;
