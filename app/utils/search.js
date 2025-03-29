const levenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Initialize the matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1, // Insertion
                    matrix[i - 1][j] + 1 // Deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

export const search = (query, list, threshold = 3) => {
    if (!query) {
        return list.map((_, index) => index);
    }

    return list
        .map((item, index) => ({
            item,
            index,
            distance: levenshteinDistance(
                query.toLowerCase(),
                item.toLowerCase().substr(0, query.length)
            ),
        }))
        .filter(({ distance }) => distance <= threshold) // Filter based on the threshold
        .sort((a, b) => a.distance - b.distance) // Sort by distance
        .map(({ index }) => index); // Return only the indices of the matching items
};
