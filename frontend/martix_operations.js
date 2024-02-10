class MatrixOperations {
    static transpose(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        let transposedMatrix = [];
        for (let j = 0; j < cols; j++) {
            let newRow = [];
            for (let i = 0; i < rows; i++) {
                newRow.push(matrix[i][j]);
            }
            transposedMatrix.push(newRow);
        }
        return transposedMatrix;
    }
}

module.exports = MatrixOperations;