module.exports = (app) => {
  const security = require("../config/security.config.js");
  const parqueo = require("../controllers/parqueo.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * /api/parqueo/generar/:
   *   get:
   *     summary: Generar Parqueos
   *     tags: [Parqueo]
   *     security:
   *        - bearerAuth: []
   *     responses:
   *       200:
   *         description: Parqueos creados
   *       400:
   *         description: Error al crear parqueos
   */
  router.get("/generar/", parqueo.generarParqueos);

  /**
   * @swagger
   * /api/parqueo/obtener/:
   *   get:
   *     summary: Obtener Parqueos
   *     tags: [Parqueo]
   *     security:
   *        - bearerAuth: []
   *     responses:
   *       200:
   *         description: Parqueos obtenidos
   *       400:
   *         description: Error al obtener parqueos
   */
  router.get("/obtener/", security.ROLE_TODOS, parqueo.obtenerParqueos);

  /**
   * @swagger
   * /api/parqueo/{id}:
   *   get:
   *     summary: Obtener parqueo por id
   *     tags: [Parqueo]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     responses:
   *       200:
   *         description: Parqueo encontrado
   */
  router.get("/:id", security.ROLE_TODOS, parqueo.findById);

  /**
   * @swagger
   * /api/parqueo/update/{id}:
   *   put:
   *     summary: Actualizar parqueo por id
   *     tags: [Parqueo]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     description: Actualizar parqueo por id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                estado:
   *                  type: string
   *                  enum: [libre, ocupado, reservado]
   *     responses:
   *       200:
   *         description: Parqueo actualizado
   */
  router.put("/update/:id", security.ROLE_TODOS, parqueo.update);

  app.use("/api/parqueo", router);
};
