module.exports = {
	selectUserCount: function () {
		return `SELECT count(*) as count
                    FROM users
                      WHERE email LIKE ?;`;
	},

	insertUser: function () {
		return `INSERT INTO users (email, user_name)
            VALUES (?, ?);`;
	},

	insertUserPassword: function () {
		return `INSERT INTO logins (user_id, hashed_password)
              VALUES (?, ?);`;
	},

	selectUserProfile: function () {
		return `SELECT email, user_name, user_id,
    entry_date AS user_added_date, 
    last_updated_date AS last_password_change
    FROM users
    JOIN logins
    ON users.id = logins.user_id
    WHERE 
    user_id = ?
    LIMIT 1;`;
	},

	// selectUserIdFromEmailPassword: function () {
	// 	return `SELECT user_id
	//   FROM users
	//   JOIN logins
	//   ON users.id = logins.user_id
	//   WHERE email LIKE ?
	//   AND hashed_password LIKE ?
	//   LIMIT 1;`;
	// },

	selectUserByEmail: function () {
		return `SELECT users.id, logins.hashed_password
            FROM users
            JOIN logins ON users.id = logins.user_id
            WHERE users.email = ?
            LIMIT 1;`;
	},

	insertNewtoken: function () {
		return `INSERT INTO tokens
    (user_id, token)
    VALUES (?, ?);`;
	},

	deleteAllTokens: function () {
		return `DELETE tokens FROM tokens
    JOIN users
    ON tokens.user_id = users.id
    WHERE 
    user_id = ?;`;
	},

	selectIdFromToken: function (token) {
		return `SELECT user_id 
    FROM tokens 
    WHERE token = '${token}'
    LIMIT 1;`;
	},

	deleteUserViaId: function (user_id) {
		return `DELETE FROM users 
              WHERE
               id = '${user_id}'
                  LIMIT 1;`;
	},

	updateUserViaId: function (user_id, payload) {
		return `UPDATE users
              SET user_name = '${payload.user_name}'
                WHERE 
                   id = '${user_id}'
                    LIMIT 1;`;
	},
	updateEmailViaId: function (user_id, payload) {
		return `UPDATE users
              SET email = '${payload.email}'
                WHERE 
                   id = '${user_id}'
                    LIMIT 1;`;
	},
	updatePasswordViaId: function (user_id, payload) {
		return `UPDATE logins
              SET hashed_password = '${payload.hashedPassword}'
                WHERE 
                   user_id = '${user_id}'
                    LIMIT 1;`;
	},
};
