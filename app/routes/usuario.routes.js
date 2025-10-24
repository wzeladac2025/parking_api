module.exports = (app) => {
  const security = require("../config/security.config.js");
  const usuario = require("../controllers/usuario.controller.js");
  var router = require("express").Router();

  /**
   * @swagger
   * /api/usuario/register/:
   *   post:
   *     summary: Crear usuario
   *     tags: [Usuario]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                correo:
   *                  type: string
   *                tipoPlaca:
   *                  type: string 
   *                placa:
   *                  type: string
   *                contrasena:
   *                  type: string
   *                role:
   *                  type: string
   *                  enum: [usuario, admin]
   *                nombres:
   *                  type: string
   *                apellidos:
   *                  type: string
   *                tipoLicencia:
   *                  type: string
   *                  enum: [C, B, A, M, E]
   *                licencia:
   *                  type: string
   *     responses:
   *       200:
   *         description: Usuario creado
   *       400:
   *         description: Error al crear Usuario
   */
  router.post("/register/", usuario.create);

  /**
   * @swagger
   * /api/usuario/login/:
   *   post:
   *     summary: Autenticar Usuario
   *     tags: [Usuario]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *                placa:
   *                  type: string
   *                contrasena:
   *                  type: string
   *     responses:
   *       200:
   *         description: Usuario Autenticado
   *       400:
   *         description: Error al autenticar Usuario
   */
  router.post("/login/", usuario.login);

  /**
   * @swagger
   * /api/usuario/{id}:
   *   get:
   *     summary: Obtener usuario por id
   *     tags: [Usuario]
   *     security:
   *        - bearerAuth: []
   *     parameters:
   *        - in: path
   *          name: id
   *          type: string
   *     responses:
   *       200:
   *         description: Usuario encontrado
   */
  router.get("/:id", security.ROLE_TODOS, usuario.findById);

  app.use("/api/usuario", router);
};
