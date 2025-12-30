const fs = require('fs');
const path = require('path');

// Script to fix empty titles after ÁTTEKINTÉS – Bevezető sections
// Format: "I. ÁTTEKINTÉS - 1. nap", "I. ÁTTEKINTÉS - 2. nap", etc.

function fixAttekintesTitles(jsonPath) {
    try {
        const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
        const exercises = JSON.parse(jsonContent);
        
        let currentSection = null; // {roman: "I", counter: 1}
        
        exercises.forEach((exercise, index) => {
            const title = exercise.title || '';
            
            // Check if this is a "Bevezető" section
            if (title.includes('ÁTTEKINTÉS') && (title.includes('Bevezető') || title.includes('Bevezetés'))) {
                // Extract Roman numeral (I, II, III, IV, V, VI)
                const romanMatch = title.match(/^([IVX]+)\./);
                if (romanMatch) {
                    currentSection = {
                        roman: romanMatch[1],
                        counter: 1
                    };
                }
            }
            // If title is empty and we have a current section, generate title
            else if ((!title || title.trim() === '') && currentSection) {
                exercise.title = `${currentSection.roman}. ÁTTEKINTÉS - ${currentSection.counter}. nap`;
                currentSection.counter++;
            }
        });
        
        // Write back to file
        fs.writeFileSync(jsonPath, JSON.stringify(exercises, null, 2), 'utf-8');
        console.log(`Successfully updated titles in ${jsonPath}`);
        console.log(`Total exercises: ${exercises.length}`);
    } catch (error) {
        console.error('Error fixing titles:', error);
        throw error;
    }
}

// Get command line arguments
const args = process.argv.slice(2);
const jsonPath = args[0] || path.join(__dirname, '../data/exercises.json');

fixAttekintesTitles(jsonPath);

