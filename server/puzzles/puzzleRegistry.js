const era1Punchcards = require('./era1-punchcards');
const era2Audio = require('./era2-audio');
const era3Github = require('./era3-github');
const era4Siege = require('./era4-siege');

const puzzles = {
    "punchcards": era1Punchcards,
    "audio": era2Audio,
    "github": era3Github,
    "siege": era4Siege
};

function findPuzzle(layerId) {
    const puzzle = puzzles[layerId];
    if (!puzzle) {
        throw new Error(`No validation module found for layer: ${layerId}`);
    }
    return puzzle;
}

module.exports = { findPuzzle };