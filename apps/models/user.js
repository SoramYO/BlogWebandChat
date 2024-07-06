var getConnection = require('../common/database');
const sql = require("mssql");

function addUser(user) {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .input('email', sql.NVarChar, user.email)
            .input('password', sql.NVarChar, user.password)
            .input('first_name', sql.NVarChar, user.first_name)
            .input('last_name', sql.NVarChar, user.last_name)
            .input('created_at', sql.DateTime, new Date())
            .query(`INSERT INTO Users (email, password, first_name, last_name, created_at)
                    VALUES (@email, @password, @first_name, @last_name, @created_at)`, (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return reject(err);
                }
                resolve(result);
            });
    });
}
function getUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .input('email', sql.NVarChar, email)
            .query(`SELECT * FROM Users WHERE email = @email`, (err, result) => {
                if (err) {
                    console.error('Error getting user:', err);
                    return reject(err);
                }
                resolve(result.recordset[0]);
            });
    });
}

function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .query(`SELECT * FROM Users`, (err, result) => {
                if (err) {
                    console.error('Error getting users:', err);
                    return reject(err);
                }
                resolve(result.recordset);
            });
    });
}

module.exports = {
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers,
};

