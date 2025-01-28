const sqlite3 = require('sqlite3').verbose();

function initializeDatabase() {
    const db = new sqlite3.Database(':memory:');

    // Create tables
    db.serialize(() => {
        db.run(`
            CREATE TABLE Tags (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                parent_id INTEGER,
                FOREIGN KEY(parent_id) REFERENCES Tags(id)
            )
        `);

        db.run(`
            CREATE TABLE Attributes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tag_id INTEGER NOT NULL,
                key TEXT NOT NULL,
                value TEXT NOT NULL,
                FOREIGN KEY(tag_id) REFERENCES Tags(id)
            )
        `);
    });

    return db;
}

function insertTag(db, tag, parentId = null) {
    db.run(
        `INSERT INTO Tags (name, parent_id) VALUES (?, ?)`,
        [tag.name, parentId],
        function (err) {
            if (err) throw err;

            const tagId = this.lastID;

            // Insert attributes
            for (const [key, value] of Object.entries(tag.attributes)) {
                db.run(
                    `INSERT INTO Attributes (tag_id, key, value) VALUES (?, ?, ?)`,
                    [tagId, key, value]
                );
            }

            // Insert children
            for (const child of tag.children) {
                insertTag(db, child, tagId);
            }
        }
    );
}

module.exports = {
    initializeDatabase,
    insertTag,
};
