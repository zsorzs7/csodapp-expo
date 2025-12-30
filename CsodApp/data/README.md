# Exercises Data

This directory contains the exercises data in JSON format.

## Converting CSV to JSON

To convert a CSV file to JSON format:

1. Place your CSV file in the project root and name it `exercises.csv`
2. Run the conversion script:
   ```bash
   npm run convert-csv
   ```

Or specify custom paths:
```bash
node scripts/csvToJson.js path/to/input.csv data/exercises.json
```
klm;kk
## CSV Format

The CSV file should have headers in the first row. Example:
```csv
index,title,text
0,First Exercise,1This is the first exercise text.
1,Second Exercise,1This is the second exercise text.
```

The `index` column is optional - if not provided, it will be auto-generated based on row order.

## JSON Format

The JSON file should be an array of exercise objects:
```json
[
  {
    "index": 0,
    "title": "Exercise Title",
    "text": "Exercise text content"
  }
]
```

