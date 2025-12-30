const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// CSV to JSON converter with proper handling of quoted fields and multi-line values
// Usage: node scripts/csvToJson.js <input.csv> <output.json>

function csvToJson(csvPath, jsonPath) {
    try {
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        
        // Parse CSV with proper handling of quoted fields and newlines
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true,
            trim: true,
            bom: true
        });
        
        // Process records
        const exercises = records.map((record, index) => {
            const exercise = {};
            
            // Copy all fields from CSV
            Object.keys(record).forEach(key => {
                let value = record[key];
                // Remove surrounding quotes if present and clean up
                if (typeof value === 'string') {
                    value = value.trim();
                }
                exercise[key] = value || '';
            });
            
            // Ensure index is a number
            if (exercise.index !== undefined && exercise.index !== '') {
                exercise.index = parseInt(exercise.index) || index;
            } else {
                exercise.index = index;
            }
            
            return exercise;
        }).filter(exercise => {
            // Filter out completely empty rows
            return exercise.index !== null && exercise.index !== undefined && 
                   (exercise.title || exercise.text || exercise.index);
        });
        
        // Write JSON file
        fs.writeFileSync(jsonPath, JSON.stringify(exercises, null, 2), 'utf-8');
        console.log(`Successfully converted ${exercises.length} exercises from CSV to JSON`);
        console.log(`Output saved to: ${jsonPath}`);
    } catch (error) {
        console.error('Error converting CSV to JSON:', error);
        throw error;
    }
}

// Get command line arguments
const args = process.argv.slice(2);
const inputPath = args[0] || path.join(__dirname, '../exercises.csv');
const outputPath = args[1] || path.join(__dirname, '../data/exercises.json');

// Create data directory if it doesn't exist
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

csvToJson(inputPath, outputPath);
