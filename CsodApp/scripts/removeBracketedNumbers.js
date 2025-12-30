const fs = require('fs');
const path = require('path');

// Script to remove bracketed numbers like (6), (7), (11) from Áttekintés exercises
// Example: "1. (6) Azért vagyok..." becomes "1. Azért vagyok..."

function removeBracketedNumbers(jsonPath) {
    try {
        const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
        const exercises = JSON.parse(jsonContent);
        
        let updatedCount = 0;
        
        exercises.forEach((exercise) => {
            // Check if this is an Áttekintés exercise
            if (exercise.title && exercise.title.includes('ÁTTEKINTÉS')) {
                if (exercise.text) {
                    // Remove patterns like "(6)", "(7)", "(11)", etc. from the text
                    const originalText = exercise.text;
                    // Remove patterns like " (6) ", " (7) ", " (11) ", etc.
                    exercise.text = exercise.text.replace(/\s*\([0-9]+\)\s*/g, ' ');
                    // Handle cases like "1 . (11)" or "1. (11)" -> "1."
                    exercise.text = exercise.text.replace(/(\d+)\s*\.\s*\([0-9]+\)/g, '$1.');
                    // Fix spacing issues like "1 . " -> "1. "
                    exercise.text = exercise.text.replace(/(\d+)\s+\./g, '$1.');
                    // Clean up any double spaces
                    exercise.text = exercise.text.replace(/\s{2,}/g, ' ');
                    // Clean up spaces before periods that aren't part of numbers
                    exercise.text = exercise.text.replace(/\s+\./g, '.');
                    
                    if (originalText !== exercise.text) {
                        updatedCount++;
                    }
                }
            }
        });
        
        // Write back to file
        fs.writeFileSync(jsonPath, JSON.stringify(exercises, null, 2), 'utf-8');
        console.log(`Successfully removed bracketed numbers from ${updatedCount} Áttekintés exercises`);
        console.log(`Total exercises: ${exercises.length}`);
    } catch (error) {
        console.error('Error removing bracketed numbers:', error);
        throw error;
    }
}

// Get command line arguments
const args = process.argv.slice(2);
const jsonPath = args[0] || path.join(__dirname, '../data/exercises.json');

removeBracketedNumbers(jsonPath);

