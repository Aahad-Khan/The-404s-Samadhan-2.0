import sqlite3 from "sqlite3";
import fs from "fs";

const dbFile = "./notes.db";
if (!fs.existsSync(dbFile)) {
    fs.writeFileSync(dbFile, "");
}

const db = new sqlite3.Database(dbFile);

export function init() {
    const schema = fs.readFileSync("./schema.sql", "utf8");
    db.exec(schema);
}

export function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
}

export function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}
