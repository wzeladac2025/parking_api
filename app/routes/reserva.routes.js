module.exports = (app) => {
  const security = require("../config/security.config.js");
  const reserva = require("../controllers/reserva.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * /api/reserva/register/:
   *   post:
   *     summary: Crear Reserva
   *     tags: [Reserva]
   *     security:
   *        - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                id_usuario:
   *                  type: number
   *                id_parqueo:
   *                  type: number
   *                fecha_inicio:
   *                  type: string
   *                  format: date
   *                fecha_fin:
   *                  type: string
   *                  format: date
   *                estado:
   *                  type: string
   *                  enum: [confirmada, activa, cancelada, finalizada]
   *     responses:
   *       200:
   *         description: Reserva creada
   *       400:
   *         description: Error al crear registro de Reserva
   */
  router.post("/register/", security.ROLE_TODOS, reserva.create);

  /**
   * @swagger
   * /api/reserva/update/{id}:
   *   put:
   *     summary: Actualizar reserva por id
   *     tags: [Reserva]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     description: Actualizar reserva por id
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                estado:
   *                  type: string
   *                  enum: [confirmada, activa, cancelada, finalizada]
   *     responses:
   *       200:
   *         description: Reserva actualizado
   */
  router.put("/update/:id", security.ROLE_TODOS, reserva.update);

  app.use("/api/reserva", router);
};
