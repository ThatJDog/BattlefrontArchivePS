import { Table } from './table.js';

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

    drop(tableName, filterFn) {
        this.getTable(tableName).drop(filterFn);
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