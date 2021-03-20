module.exports = {
  type: "mssql",
  host: "tunganthesis.mssql.somee.com",
  port: 1433,
  database: "tunganthesis",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  synchronize: false,
  logging: true,
  extra: {
    driver: 'msnodesqlv8',
    options: {
      trustedConnection: true,
    },
  },
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  subscribers: ['dist/database/subscriber/*.js'],
  cli: { migrationsDir: 'src/database/migrations' },
};
