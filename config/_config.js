const ids = {
    secretPhrase: "super_secret_164bf945e9f635a0b1956119dbbf55d5",
    sqlite: {
        dialect: 'sqlite'
    },
    mysql: {
        dialectOptions: {
            socketPath: '/tmp/mysql.sock'
        },
        dialect: 'mysql'
    },
    db_name: 'auth-service',
    db_user: 'user',
    db_password: 'secret'
};

ids.db_options = ids.sqlite;

module.exports = ids;
