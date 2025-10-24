const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");

const app = express();

// var corsOptions = {
//   origin: "http://localhost:8081",
// };

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve Swagger documentation
const swaggerSpec = require("./app/config/swagger.config");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

const db = require("./app/models");
db.sequelize.sync();

/**
 * @swagger
 * /: 
 *   get:
 *     summary: Test
 *     tags: [Servicios Up]
 *     description: Test Proyecto Levantado
 *     responses:
 *       200:
 *         description: Test Proyecto Levantado
 */
app.get("/", (req, res) => {
  res.json({ message: "Proyecto Parking API ✅" });
});

try {
  require("./app/routes/usuario.routes")(app);
  console.log("✅ usuario.routes.js cargado correctamente");
} catch (err) {
  console.error("❌ Error al cargar usuario.routes.js:", err.message);
}
try {
  require("./app/routes/reserva.routes")(app);
  console.log("✅ reserva.routes.js cargado correctamente");
} catch (err) {
  console.error("❌ Error al cargar reserva.routes.js:", err.message);
}
try {
  require("./app/routes/parqueo.routes")(app);
  console.log("✅ parqueo.routes.js cargado correctamente");
} catch (err) {
  console.error("❌ Error al cargar parqueo.routes.js:", err.message);
}

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado correctamente en el puerto ${PORT}.`);
});
