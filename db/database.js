export class Database {
    constructor(schema = null) {
        this.tables = {}; // Object to store data for each table

        // If a schema is provided, create tables based on it
        if (schema) {
            for (const tableName of Object.keys(schema)) {
                this.createTable(tableName, schema[tableName]);
            }
        }
    }

    // Create a new table with predefined fields
    createTable(tableName, schema) {
        if (this.tables[tableName]) {
            throw new Error(`Table ${tableName} already exists.`);
        }
        this.tables[tableName] = {
            schema, // Predefined fields for validation
            records: [], // Store records
        };
    }

    // Insert a record into a table
    insert(tableName, record) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} does not exist.`);
        }

        const { schema, records } = this.tables[tableName];

        // Validate the record against the schema
        for (const field of schema) {
            if (!(field in record)) {
                throw new Error(`Missing field "${field}" in record for table ${tableName}.`);
            }
        }

        // Ensure no extra fields are present
        for (const key in record) {
            if (!schema.includes(key)) {
                throw new Error(`Unexpected field "${key}" in record for table ${tableName}.`);
            }
        }

        // Add record to the table
        records.push(record);
    }

    // Select records from a table with an optional filter
    select(tableName, filterFn = () => true) {
        if (!this.tables[tableName]) {
            throw new Error(`Table ${tableName} does not exist.`);
        }

        return this.tables[tableName].records.filter(filterFn);
    }
}