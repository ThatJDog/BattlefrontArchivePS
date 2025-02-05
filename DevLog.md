## Up to 04/02/25
### Initial Database
- Created Database class (Very simple)
    - Consisted of Database and table class with no methods
### Setup ANTLR
- Setup ANTLR and project
    - ANTLR class parses custom `.pdml` data file
    - `.pdml` or **Parameterised Data Markup Language** is my custom data language which combines features from `.xml` and `.json`. Doesn't support text content between tags (like in `.xml` and `.html`) but supports the following value data types:
        - String: `"example"`
        - Number: `34` or `2.56`
        - Boolean: `true` or `false`
        - Array: `[ 56 67 89 ]`
        - Struct: `{ name="John" age=23 }`
- ANTLR parses into object structured version for easy parsing into the db
### Data converters
- My old data used unorganised data formats so I coded converters to make all my files `.pdml`.

### Parsers
- Coded parsers from parsed `.pdml` files into the database using the tags.

### Testing Database
- Created initial page to view database entries as a html table to help with testing

### Setup Database Schema
- Due to the relaxeed type properties of js, the schema only consists of names but defines the table structure.

### Configuring Database querying
- I then setup my database and table to be queried.
    - Some initial core features:
        - `Select`: Selects rows from a table given function is true (per record), keeping initial table schema. Table method
        - `Join`: Joins two tables together using join method. Merges duplicate column names. Table method
        - `Rename`: Renames columns to prevent collisions. Table method
        - `Drop`: Drop selected columns (updates schema). Table method
        - `Keep`: Drops all columns not specified (updates schema). Table method
        - `Group By`: Use aggrogate function on columns and groups results with selected columns. Table method
        - `Sort By`: Sort columns by selected columns (use asc or desc), supports multiple columns. Table method
        - `Add Computed Column`: Adds a new column and iterates through all records apply func for computed values. Table method
    - All query functions create new table instances to ensure the original database is uneffected
- Then used this to view player stats (over all matches) in my table.

### Setup Pre-processing
- Moved code for parsing pdml files into a new js file to pre-process the database and store the result in json.
- This is to optimise run-time performance.
- Hard work to switch from ES Model to Node.js

### Pre-processing Elo
- Created Elo table
- Calculate elo based on wins and losses. 
    - Winning against an underdog team rewards reduced elo gain (and reduces elo penalty for underdog team)
    - Balanced Teams are awarded a base elo score (eg 30)
    - Underdog teams granted increased elo gain (increased elo penalty to stronger losing team)
- Highlighted parsing issue of matches not sorted.
    - Could be sorted using dynamic sort by's
    - Bad performance, wanted to pre-process instead
    - Added new database feature to help:
        - `Re-Index Column`: Updates column indexing (may be non-number value), while also updating referenced table-column tuples. Database method
        - `Align Schema`: Aligns a schemas columns to match order of another tables columns for make schema matching easier. Table method

### Mockup menu designs

### Profile Menu

### Elo Plot

### Match Score Page
- Table: Blur, rows, querying
- Top: Dynamic timer scg element. Images for scores
- Created logos for empire and rebel
- Added buttons at bottom

### Updated Menu visuals
- Frames and Sections
- Highlight effects
- Coded Navbar.js
- Themes.js

## 05/0-2/25
### Elo Leaderboard
- Added query to display player elo info (+ wins and matches etc)
- Each row is a link to the selected player's profile

### Series lookup
- Added a series lookup to find any series ever played
- Links to the `series.html` page

### Series.html
- Page displaying links to all the matches
- Displays summary scores of the series
- Matches are links to the match scoreboard