module.exports = {
  HOST: "25.5.74.72",
  USER: "postgres",
  PASSWORD: "root",
  DB: "parking",
  dialect: "postgres",
  port: 5433,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  ssl: false
};
