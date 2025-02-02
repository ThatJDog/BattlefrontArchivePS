export class Table {
    constructor(name, schema) {
        this.name = name;
        this.schema = schema; // Predefined fields for validation
        this.records = []; // Store records
    }

    insert(record) {
        // Validate the record against the schema
        for (const field of this.schema) {
            if (!(field in record)) {
                throw new Error(`Missing field "${field}" in record for table ${this.name}.`);
            }
        }

        // Ensure no extra fields are present
        for (const key in record) {
            if (!this.schema.includes(key)) {
                throw new Error(`Unexpected field "${key}" in record for table ${this.name}.`);
            }
        }

        this.records.push(record);
    }

    select(filterFn = () => true) {
        // Create a new table with the same schema but only filtered records
        const newTable = new Table(`${this.name}_query`, this.schema);
        newTable.records = this.records.filter(filterFn);
        return newTable;
    }

    selectColumns(columns) {
        // Validate that all selected columns exist
        for (const column of columns) {
            if (!this.schema.includes(column)) {
                throw new Error(`Column "${column}" does not exist in table "${this.name}".`);
            }
        }

        // Create a new table with the selected columns only
        const newTable = new Table(`${this.name}_columns`, columns);
        newTable.records = this.records.map(record =>
            Object.fromEntries(columns.map(col => [col, record[col]]))
        );
        return newTable;
    }

    getRecord(index) {
        if (typeof(index) === 'int')
            return this.records.at(index);
        else 
            return this.records[index];
    }

    getLast() {
        return this.records.at(-1);
    }

    has(column, value) {
        return this.records.some(record => record[column] === value);
    }

    numRecords() {
        return this.records.length;
    }

    update(filterFn, updateFn) {
        this.records.forEach((record, index) => {
            if (filterFn(record)) {
                this.records[index] = updateFn({ ...record }); // Ensure immutability
            }
        });
    }

    /**
     * Deletes records based on a filter function, a column name, or an array of column names.
     * @param {Function|string|string[]} filter - A filter function, column name, or array of column names.
     */
    clean(filter) {
        if (typeof filter === "function") {
            // If a function is provided, use it to filter records
            this.records = this.records.filter(record => !filter(record));
        } else if (typeof filter === "string") {
            // If a single column name is provided, remove records where the column is null or undefined
            this.records = this.records.filter(record => record[filter] !== null && record[filter] !== undefined);
        } else if (Array.isArray(filter)) {
            // If an array of column names is provided, remove records where all specified columns are null or undefined
            this.records = this.records.filter(record => 
                filter.some(col => record[col] !== null && record[col] !== undefined)
            );
        } else {
            throw new Error("Invalid argument: filter must be a function, a column name (string), or an array of column names.");
        }
    }

    /**
     * Removes specified columns from the table schema and records.
     * @param {string|string[]} columns - A single column name or an array of column names to remove.
     */
    drop(columns) {
        if (typeof columns === "string") {
            columns = [columns]; // Convert single column to an array
        }

        if (!Array.isArray(columns)) {
            throw new Error("Invalid argument: columns must be a string or an array of strings.");
        }

        // Validate that all specified columns exist in the schema
        const invalidColumns = columns.filter((col) => !this.schema.includes(col));
        if (invalidColumns.length > 0) {
            throw new Error(`Invalid columns: ${invalidColumns.join(", ")} do not exist in table "${this.name}".`);
        }

        // Create a new schema excluding the specified columns
        const newSchema = this.schema.filter((col) => !columns.includes(col));

        // Create a new table with the updated schema
        const newTable = new Table(`${this.name}_columns_removed`, newSchema);

        // Copy records without the deleted columns
        newTable.records = this.records.map((record) =>
            Object.fromEntries(newSchema.map((col) => [col, record[col]]))
        );

        return newTable;
    }

    /**
     * Keeps only the specified columns in the table schema and records.
     * @param {string|string[]} columns - A single column name or an array of column names to keep.
     * @returns {Table} - A new table containing only the specified columns.
     */
    keep(columns) {
        if (typeof columns === "string") {
            columns = [columns]; // Convert single column to an array
        }

        if (!Array.isArray(columns)) {
            throw new Error("Invalid argument: columns must be a string or an array of strings.");
        }

        // Validate that all specified columns exist in the schema
        const invalidColumns = columns.filter((col) => !this.schema.includes(col));
        if (invalidColumns.length > 0) {
            throw new Error(`Invalid columns: ${invalidColumns.join(", ")} do not exist in table "${this.name}".`);
        }

        // Create a new table with only the specified columns
        const newTable = new Table(`${this.name}_columns_kept`, columns);

        // Copy records only with the kept columns
        newTable.records = this.records.map((record) =>
            Object.fromEntries(columns.map((col) => [col, record[col]]))
        );

        return newTable;
    }

    split(columnName) {
        const splitTables = {};
        
        this.records.forEach(record => {
            const key = record[columnName];
            if (!splitTables[key]) {
                splitTables[key] = new Table(`${this.name}_${key}`, this.schema);
            }
            splitTables[key].records.push({ ...record });
        });

        return Object.values(splitTables);
    }

    split(columns) {
        if (!Array.isArray(columns)) {
            columns = [columns];
        }
        
        const splitTables = {};
        
        this.records.forEach(record => {
            const key = columns.map(col => record[col]).join('_');
            if (!splitTables[key]) {
                splitTables[key] = new Table(`${this.name}_${key}`, this.schema);
            }
            splitTables[key].records.push({ ...record });
        });

        return Object.values(splitTables);
    }

    /**
     * Bulk inserts records into the table
     * @param {Array<Object>} newRecords - Array of record objects matching the schema
     */
    bulkInsert(newRecords) {
        if (!Array.isArray(newRecords)) {
            console.error(`Invalid records format for table '${this.name}'`);
            return;
        }

        for (const record of newRecords) {
            if (this.validateRecord(record)) {
                this.records.push(record);
            } else {
                console.warn(`Skipping invalid record in table '${this.name}':`, record);
            }
        }
    }

    /**
     * Validates a record against the schema
     * @param {Object} record - The record to validate
     * @returns {boolean} - Returns true if valid, false otherwise
     */
    validateRecord(record) {
        return this.schema.every(column => record.hasOwnProperty(column));
    }

    /**
     * Groups the records by the specified columns and aggregates other columns using the provided functions.
     * @param {string[]|string} groupByColumns - Columns to group by.
     * @param {Object} aggregateFns - An object specifying aggregation functions for other columns.
     * @returns {Table} - A new table with grouped results.
     */
    groupBy(groupByColumns, aggregateFns) {

        if (typeof(groupByColumns) === 'string')
            groupByColumns = [groupByColumns];

        // Validate groupByColumns
        groupByColumns.forEach((col) => {
            if (!this.schema.includes(col)) {
                throw new Error(`Column "${col}" does not exist in table "${this.name}".`);
            }
        });

        const groupedData = {};

        // Group the records
        this.records.forEach((record) => {
            const key = groupByColumns.map((col) => record[col]).join("|"); // Create a composite key
            if (!groupedData[key]) {
                groupedData[key] = [];
            }
            groupedData[key].push(record);
        });

        // Create aggregated records
        const aggregatedRecords = Object.entries(groupedData).map(([key, group]) => {
            const aggregatedRecord = {};
            groupByColumns.forEach((col, idx) => {
                aggregatedRecord[col] = key.split("|")[idx];
            });

            // Apply each aggregation function to the group
            for (const [column, fn] of Object.entries(aggregateFns)) {
                aggregatedRecord[column] = fn(group.map((record) => record[column]));
            }

            return aggregatedRecord;
        });

        // Create a new table with the aggregated data
        const newSchema = [...groupByColumns, ...Object.keys(aggregateFns)];
        const newTable = new Table(`${this.name}_grouped`, newSchema);
        newTable.records = aggregatedRecords;
        return newTable;
    }

    /**
     * Sorts the table by one or more columns.
     * @param {Astring[]|string} columns - Array of column names with optional direction ("asc" or "desc").
     *                          Example: ["Name", "Score desc"].
     * @returns {Table} - A new sorted table.
     */
    sortBy(columns) {

        if (typeof(columns) === 'string')
            columns = [columns];

        const newTable = new Table(`${this.name}_sorted`, this.schema);
        newTable.records = [...this.records]; // Clone records

        newTable.records.sort((a, b) => {
            for (const col of columns) {
                const [columnName, direction = "asc"] = col.split(" ");
                const dirMultiplier = direction.toLowerCase() === "desc" ? -1 : 1;

                if (a[columnName] > b[columnName]) return dirMultiplier;
                if (a[columnName] < b[columnName]) return -dirMultiplier;
            }
            return 0;
        });

        return newTable;
    }

    /**
     * Reorders the columns in the table.
     * @param {string[]} newOrder - Array specifying the desired column order. Columns not included are added to the end in their current order.
     * @returns {Table} - A new table with reordered columns.
     */
    reorderColumns(newOrder) {
        // Validate that all specified columns exist in the schema
        const invalidColumns = newOrder.filter((col) => !this.schema.includes(col));
        if (invalidColumns.length > 0) {
            throw new Error(`Invalid columns in new order: ${invalidColumns.join(", ")}`);
        }

        // Combine specified columns with remaining columns in their original order
        const remainingColumns = this.schema.filter((col) => !newOrder.includes(col));
        const finalOrder = [...newOrder, ...remainingColumns];

        // Create the new table with the updated column order
        const newTable = new Table(`${this.name}_reordered`, finalOrder);
        newTable.records = this.records.map((record) =>
            Object.fromEntries(finalOrder.map((col) => [col, record[col]]))
        );

        return newTable;
    }

    /**
     * Applies a function to all values in a specified column.
     * @param {string} columnName - The name of the column to apply the function to.
     * @param {Function} func - The function to apply to each value in the column.
     * @returns {Table} - A new table with the updated column.
     */
    applyToColumn(columnName, func) {
        // Validate the column exists in the schema
        if (!this.schema.includes(columnName)) {
            throw new Error(`Column "${columnName}" does not exist in table "${this.name}".`);
        }

        // Create a new table with the same schema
        const newTable = new Table(`${this.name}_updated`, this.schema);

        // Apply the function to the specified column
        newTable.records = this.records.map((record) => ({
            ...record,
            [columnName]: func(record[columnName]),
        }));

        return newTable;
    }

    /**
     * Fills `null` values in a specified column with a default value.
     * @param {string} columnName - The name of the column to fill.
     * @param {*} defaultValue - The default value to use for filling `null` values.
     * @returns {Table} - A new table with the updated records.
     */
    fillIfNull(columnName, defaultValue) {
        // Validate the column exists in the schema
        if (!this.schema.includes(columnName)) {
            throw new Error(`Column "${columnName}" does not exist in table "${this.name}".`);
        }

        // Create a new table with the same schema
        const newTable = new Table(`${this.name}_filled`, this.schema);

        // Fill `null` values in the specified column
        newTable.records = this.records.map((record) => ({
            ...record,
            [columnName]: record[columnName] === null ? defaultValue : record[columnName],
        }));

        return newTable;
    }

    /**
     * Adds a computed column based on a function that derives values from other columns.
     * @param {string} newColumnName - The name of the new computed column.
     * @param {Function} computeFn - Function that takes a record and returns the computed value.
     * @returns {Table} - A new table with the computed column added.
     */
    addComputedColumn(newColumnName, computeFn) {
        // Ensure the new column does not already exist
        if (this.schema.includes(newColumnName)) {
            throw new Error(`Column "${newColumnName}" already exists in table "${this.name}".`);
        }

        // Create a new table with the updated schema
        const newSchema = [...this.schema, newColumnName];
        const newTable = new Table(`${this.name}_computed`, newSchema);

        // Compute the new column values
        newTable.records = this.records.map((record) => ({
            ...record,
            [newColumnName]: computeFn(record),
        }));

        return newTable;
    }

    /**
     * Applies a function to each record in the table.
     * @param {Function} callback - A function that receives each record as an argument.
     */
    forEachRecord(callback) {
        this.records.forEach(callback);
    }

    /**
     * Renames a column in all records.
     * @param {string} from - The existing column name.
     * @param {string} to - The new column name.
     * @returns {Table} - A new table with the renamed column.
     */
    renameRecord(from, to) {
        if (!this.schema.includes(from)) {
            throw new Error(`Column "${from}" does not exist in table "${this.name}".`);
        }

        const newSchema = this.schema.map(col => (col === from ? to : col));
        const newTable = new Table(`${this.name}_renamed`, newSchema);

        newTable.records = this.records.map(record => {
            const newRecord = { ...record };
            newRecord[to] = newRecord[from];
            delete newRecord[from];
            return newRecord;
        });

        return newTable;
    }

    /**
     * Filters records in the table based on a given condition.
     * @param {Function} condition - A function that returns `true` for records to keep.
     * @returns {Table} - A new table with only matching records.
     */
    filter(condition) {
        const newTable = new Table(`${this.name}_filtered`, this.schema);
        newTable.records = this.records.filter(condition);
        return newTable;
    }


    /**
     * Replaces the current table's records with a new value while maintaining the schema.
     * @param {Table} newValue - The new table data to replace the current one.
     */
    set(newValue) {
        // Ensure the schema is the same
        const newSchema = newValue.schema;
        if (JSON.stringify(newSchema) !== JSON.stringify(this.schema)) {
            throw new Error(`Schema mismatch: Expected ${JSON.stringify(this.schema)}, got ${JSON.stringify(newSchema)}`);
        }

        // Replace records with the new table's records
        this.records = [...newValue.records];
    }

    /**
     * Reorders the schema of this table to match another table's schema.
     * @param {Table} otherTable - The table whose schema we want to match.
     * @throws {Error} If any column in this table is missing in the other table.
     */
    alignSchema(otherTable) {
        // Validate that all columns in this table exist in the other table's schema
        const missingColumns = this.schema.filter(col => !otherTable.schema.includes(col));
        if (missingColumns.length > 0) {
            throw new Error(`Schema mismatch: Missing columns in target table schema: ${missingColumns.join(", ")}`);
        }

        // Reorder schema to match the order in `otherTable`
        const newSchema = otherTable.schema.filter(col => this.schema.includes(col));

        // Create a new table with the updated schema
        const newTable = new Table(this.name, newSchema);

        // Reorder existing records to match the new schema
        newTable.records = this.records.map(record =>
            Object.fromEntries(newSchema.map(col => [col, record[col]]))
        );

        return newTable;
    }


    /**
     * Performs a SQL-like join operation between two tables.
     * 
     * @param {Table} otherTable - The table to join with.
     * @param {string} joinType - The type of join operation ("INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "CROSS JOIN").
     * @param {function} onCondition - A function that takes two records (one from each table) and returns true if they should be joined.
     * @returns {Table} A new table containing the results of the join.
     * 
     * ### Join Types and Examples:
     * 
     * #### 1. INNER JOIN
     * Returns only the matching rows from both tables based on the `onCondition`.
     * 
     * #### 2. LEFT JOIN
     * Returns all rows from the left table and the matching rows from the right table. If no match is found, the right table columns are set to null.
     * 
     * #### 3. RIGHT JOIN
     * Returns all rows from the right table and the matching rows from the left table. If no match is found, the left table columns are set to null.
     * 
     * #### 4. FULL OUTER JOIN
     * Returns all rows from both tables, matching rows where possible, otherwise filling with nulls.
     * 
     * #### 5. CROSS JOIN
     * Returns the Cartesian product of both tables (every row from Table A paired with every row from Table B).
     */
    join(otherTable, joinType, onCondition) {
        const combinedSchema = [...new Set([...this.schema, ...otherTable.schema])];
        const newTable = new Table(`${this.name}_${joinType}_${otherTable.name}`, combinedSchema);
        const newRecords = [];

        switch (joinType.toUpperCase()) {
            case "INNER JOIN":
                this.records.forEach(recordA => {
                    otherTable.records.forEach(recordB => {
                        if (onCondition(recordA, recordB)) {
                            newRecords.push({ ...recordA, ...recordB });
                        }
                    });
                });
                break;

            case "LEFT JOIN":
                this.records.forEach(recordA => {
                    let matched = false;
                    otherTable.records.forEach(recordB => {
                        if (onCondition(recordA, recordB)) {
                            newRecords.push({ ...recordA, ...recordB });
                            matched = true;
                        }
                    });
                    if (!matched) {
                        newRecords.push({ ...recordA, ...Object.fromEntries(otherTable.schema.map(k => [k, null])) });
                    }
                });
                break;

            case "RIGHT JOIN":
                otherTable.records.forEach(recordB => {
                    let matched = false;
                    this.records.forEach(recordA => {
                        if (onCondition(recordA, recordB)) {
                            newRecords.push({ ...recordA, ...recordB });
                            matched = true;
                        }
                    });
                    if (!matched) {
                        newRecords.push({ ...Object.fromEntries(this.schema.map(k => [k, null])), ...recordB });
                    }
                });
                break;

            case "FULL OUTER JOIN":
                const matchedIndices = new Set();
            
                this.records.forEach((recordA) => {
                    let matched = false;
                    otherTable.records.forEach((recordB, index) => {
                        if (onCondition(recordA, recordB)) {
                            newRecords.push({ ...recordA, ...recordB });
                            matchedIndices.add(index); // Track matched indices
                            matched = true;
                        }
                    });
                    if (!matched) {
                        newRecords.push({ ...recordA, ...Object.fromEntries(otherTable.schema.map(k => [k, null])) });
                    }
                });
            
                // Add unmatched records from otherTable
                otherTable.records.forEach((recordB, index) => {
                    if (!matchedIndices.has(index)) {
                        newRecords.push({ ...Object.fromEntries(this.schema.map(k => [k, null])), ...recordB });
                    }
                });
                break;                

            case "CROSS JOIN":
                this.records.forEach(recordA => {
                    otherTable.records.forEach(recordB => {
                        newRecords.push({ ...recordA, ...recordB });
                    });
                });
                break;

            default:
                throw new Error(`Unknown join type: ${joinType}`);
        }

        newTable.records = newRecords;
        return newTable;
    }
}