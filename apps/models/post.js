var getConnection = require('../common/database');
const sql = require("mssql");

function addPost(post) {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .input('title', sql.NVarChar, post.title)
            .input('content', sql.NVarChar, post.content)
            .input('author', sql.NVarChar, post.author)
            .input('created_at', sql.DateTime, new Date())
            .query(`INSERT INTO Posts (title, content, author, created_at)
                    VALUES (@title, @content, @author, @created_at)`, (err, result) => {
                if (err) {
                    console.error('Error inserting post:', err);
                    return reject(err);
                }
                resolve(result);
            });
    });
}
function getAllPosts() {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .query(`SELECT * FROM Posts`, (err, result) => {
                if (err) {
                    console.error('Error getting posts:', err);
                    return reject(err);
                }
                resolve(result.recordset);
            });
    });
}
function getPostById(postId) {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .input('id', sql.Int, postId)
            .query(`SELECT * FROM Posts WHERE id = @id`, (err, result) => {
                if (err) {
                    console.error('Error getting post:', err);
                    return reject(err);
                }
                resolve(result.recordset[0]);
            });
    });
}

function updatePost(post) {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .input('id', sql.Int, post.id)
            .input('title', sql.NVarChar, post.title)
            .input('content', sql.NVarChar, post.content)
            .input('author', sql.NVarChar, post.author)
            .input('updated_at', sql.DateTime, new Date())
            .query(`UPDATE Posts
                    SET title = @title, content = @content, author = @author, updated_at = @updated_at
                    WHERE id = @id`, (err, result) => {
                if (err) {
                    console.error('Error updating post:', err);
                    return reject(err);
                }
                resolve(result);
            });
    });
}

function deletePost(postId) {
    return new Promise(async (resolve, reject) => {
        const pool = await getConnection();
        pool.request()
            .input('id', sql.Int, postId)
            .query(`DELETE FROM Posts WHERE id = @id`, (err, result) => {
                if (err) {
                    console.error('Error deleting post:', err);
                    return reject(err);
                }
                resolve(result);
            });
    });
}

module.exports = {
    addPost: addPost,
    getAllPosts: getAllPosts,
    getPostById: getPostById,
    updatePost: updatePost,
    deletePost: deletePost,
};