const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Op = db.Sequelize.Op;
const Usuario = db.usuario;

exports.generarParqueos = async (req, res) => {
  let response = null;
  try {
    if (!req.body.correo && !req.body.contrasena) {
      res.status(400).send({
        message: "Necesita ingresar el correo y la contraseña.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);

    const usuarioObj = {
      correo: req.body.correo,
      contrasena: hashedPassword,
      role: req.body.role,
    };

    const usuario = Usuario.build(usuarioObj);
    const nuevoUsuario = await usuario.save().catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Error al crear el usuario. Consulte a su administrador.",
      });
    });

    //AGREGAR OBJETOS DE HUESPED, EMPLEADO BASE

    res.send(nuevoUsuario);
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log("hubo un error inesperado", err.message);
  }
};

exports.findAll = (req, res) => {
  const nombre = req.query.correo;
  var condition = nombre ? { nombre: { [Op.iLike]: "%${nombre}%" } } : null;

  Usuario.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error al obtener los usuarios.",
      });
    });
};

exports.findById = async (req, res) => {
  try {
    const usuario = await Usuario.findOne({
      where: { correo: req.body.correo },
    });
    if (!usuario) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const validPassword = await bcrypt.compare(
      req.body.contrasena,
      usuario.contrasena
    );
    if (!validPassword) {
      return res.status(401).send({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.send({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = (req, res) => {
  const id = req.params.id;

  Usuario.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Usuario actualizado exitosamente.",
        });
      } else {
        res.send({
          message: "No se pudo actualizar al usuario.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al actualizar el usuario.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Usuario.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Usuario dado de baja.",
        });
      } else {
        res.send({
          message: "No se pudo dar de baja al usuario.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error al dar de baja al usuario.",
      });
    });
};
