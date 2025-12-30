const fs = require('fs');
const path = require('path');

// Script to fix exercise indices - make each exercise have a unique index starting from 1
// The index will be the position of the item in the array (1-based)

function fixExerciseIndices(jsonPath) {
    try {
        const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
        const exercises = JSON.parse(jsonContent);
        
        // Update each exercise's index to be its position (1-based)
        exercises.forEach((exercise, index) => {
            exercise.index = index + 1;
        });
        
        // Write back to file
        fs.writeFileSync(jsonPath, JSON.stringify(exercises, null, 2), 'utf-8');
        console.log(`Successfully updated indices in ${jsonPath}`);
        console.log(`Total exercises: ${exercises.length}`);
        console.log(`Indices now range from 1 to ${exercises.length}`);
    } catch (error) {
        console.error('Error fixing exercise indices:', error);
        throw error;
    }
}

// Get command line arguments
const args = process.argv.slice(2);
const jsonPath = args[0] || path.join(__dirname, '../data/exercises.json');

fixExerciseIndices(jsonPath);

