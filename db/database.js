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
                const matchedRecords = new Set();
                this.records.forEach(recordA => {
                    let matched = false;
                    otherTable.records.forEach(recordB => {
                        if (onCondition(recordA, recordB)) {
                            newRecords.push({ ...recordA, ...recordB });
                            matchedRecords.add(recordB);
                            matched = true;
                        }
                    });
                    if (!matched) {
                        newRecords.push({ ...recordA, ...Object.fromEntries(otherTable.schema.map(k => [k, null])) });
                    }
                });

                otherTable.records.forEach(recordB => {
                    if (!matchedRecords.has(recordB)) {
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


    getRecord(index) {
        return this.records.at(index);
    }

    getLast() {
        return this.records.at(-1);
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

    delete(filterFn) {
        this.records = this.records.filter(record => !filterFn(record));
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
}

export class Database {
    constructor(schema = null) {
        this.tables = {};

        if (schema) {
            for (const tableName of Object.keys(schema)) {
                this.createTable(tableName, schema[tableName]);
            }
        }
    }

    getTableNames(){
        return this.schema;
    }

    /**
     * Loads tables from pre-compiled JSON data.
     * @param {Object} data - The JSON object containing tables and their data.
     */
    loadFromData(data) {
        if (!data || typeof data !== "object" || !data.tables || typeof data.tables !== "object") {
            console.error("Invalid database data provided.");
            return;
        }

        for (const tableName of Object.keys(data.tables)) {
            const tableData = data.tables[tableName];

            if (!tableData || typeof tableData !== "object" || !Array.isArray(tableData.schema) || !Array.isArray(tableData.records)) {
                console.error(`Invalid data format for table '${tableName}'`);
                continue;
            }

            if (!this.tables[tableName]) {
                // Create a new table with the provided schema
                this.tables[tableName] = new Table(tableData.name, tableData.schema);
            }

            // Bulk insert records into the table
            this.tables[tableName].bulkInsert(tableData.records);
        }
    }

    /**
     * Merges existing table data with new data.
     * @param {string} tableName - The name of the table to merge.
     * @param {Array|Object} newData - The new data to merge into the table.
     */
    mergeTableData(tableName, newData) {
        const existingTable = this.tables[tableName];

        if (Array.isArray(existingTable) && Array.isArray(newData)) {
            this.tables[tableName] = [...existingTable, ...newData]; // Merge arrays
        } else if (typeof existingTable === "object" && typeof newData === "object") {
            this.tables[tableName] = { ...existingTable, ...newData }; // Merge objects
        } else {
            console.warn(`Cannot merge table '${tableName}' due to incompatible types.`);
        }
    }    

    /**
     * Factory method: Creates a Database instance from a JSON file
     * @param {string} url - The URL of the JSON file
     * @returns {Promise<Database>} - A promise that resolves to a Database instance
     */
    static async fromFile(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load JSON from ${url}`);
            }
            const jsonData = await response.json();
            const db = new Database();
            db.loadFromData(jsonData);
            return db;
        } catch (error) {
            console.error("Error loading database from file:", error);
            throw error;
        }
    }

    createTable(tableName, schema) {
        if (this.tables[tableName]) {
            throw new Error(`Table ${tableName} already exists.`);
        }
        this.tables[tableName] = new Table(tableName, schema);
    }

    insert(tableName, record) {
        this.getTable(tableName).insert(record);
    }

    select(tableName, filterFn = () => true) {
        return this.getTable(tableName).select(filterFn);
    }

    selectColumns(tableName, columns) {
        return this.getTable(tableName).selectColumns(columns);
    }

    join(tableA, tableB, joinType, onCondition) {
        return this.getTable(tableA).join(this.getTable(tableB), joinType, onCondition);
    }

    update(tableName, filterFn, updateFn) {
        this.getTable(tableName).update(filterFn, updateFn);
    }

    delete(tableName, filterFn) {
        this.getTable(tableName).delete(filterFn);
    }

    getRecord(tableName, index) {
        return this.getTable(tableName).getRecord(index);
    }

    getLast(tableName) {
        return this.getTable(tableName).getLast();
    }

    numRecords(tableName) {
        return this.getTable(tableName).numRecords();
    }

    getTable(tableName) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} does not exist.`);
        }
        return this.tables[tableName];
    }
}