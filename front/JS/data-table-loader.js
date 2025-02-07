
export function populateTable(container, dataTable) {
    // Clear the container
    container.innerHTML = "";

    // Create table
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Append thead and tbody to table
    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(table); // Append table to the container

    // Determine which columns contain numeric values
    const isNumericColumn = dataTable.schema.map((col) =>
        dataTable.records.every((record) => typeof record[col] === "number")
    );

    // Create table header
    const headerRow = document.createElement("tr");
    dataTable.schema.forEach((col, index) => {
        const th = document.createElement("th");
        th.textContent = col;

        // Align numeric column headers to the right
        if (isNumericColumn[index]) {
            // th.style.textAlign = "right";
        }

        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    // Create table rows
    dataTable.records.forEach((record) => {
        const row = document.createElement("tr");
        dataTable.schema.forEach((col, index) => {
            const td = document.createElement("td");
            const value = record[col];

            td.textContent = value;

            // Align numeric values to the right
            if (isNumericColumn[index]) {
                // td.style.textAlign = "right";
            }

            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
}

export function populateRecordTable(container, dataTable) {
    // Clear the container
    container.innerHTML = "";

    const record = dataTable.getRecord(0);
    const schema = dataTable.schema;

    // Create table
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    // Append tbody to table
    table.appendChild(tbody);
    container.appendChild(table); // Append table to the container

    // Ensure the record is displayed in schema order
    const orderedKeys = schema || Object.keys(record); // Use schema if available, otherwise default to record keys

    // Create table rows based on schema order
    orderedKeys.forEach((key) => {
        if (record.hasOwnProperty(key)) {
            const row = document.createElement("tr");

            // Key Cell (Left)
            const keyCell = document.createElement("td");
            keyCell.textContent = key;
            keyCell.style.fontWeight = "bold"; // Highlight key
            keyCell.style.paddingRight = "10px"; // Add spacing

            // Value Cell (Right)
            const valueCell = document.createElement("td");
            valueCell.textContent = record[key];

            // Append cells to row
            row.appendChild(keyCell);
            row.appendChild(valueCell);
            tbody.appendChild(row);
        }
    });
}