var config = require('../../config/configdb');
const sql = require('mssql');

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (err) {
        console.error('Error getting database connection:', err);
        throw err; // Re-throw the error to handle it in the calling code
    }
}

module.exports = getConnection;