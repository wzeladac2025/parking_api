const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

try {
  db.parqueo = require("./parqueo.model.js")(sequelize, Sequelize);
  console.log("✅ Modelo 'parqueo' cargado correctamente.");
} catch (err) {
  console.error("❌ Error al cargar modelo 'parqueo':", err.message);
}
try {
  db.reserva = require("./reserva.model.js")(sequelize, Sequelize);
  console.log("✅ Modelo 'reserva' cargado correctamente.");
} catch (err) {
  console.error("❌ Error al cargar modelo 'reserva':", err.message);
}
try {
  db.usuario = require("./usuario.model.js")(sequelize, Sequelize);
  console.log("✅ Modelo 'usuario' cargado correctamente.");
} catch (err) {
  console.error("❌ Error al cargar modelo 'usuario':", err.message);
}

module.exports = db;
