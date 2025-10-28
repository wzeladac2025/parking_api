const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Op = db.Sequelize.Op;
const Usuario = db.usuario;

exports.create = async (req, res) => {
  let response = null;
  try {
    if (!req.body.correo && !req.body.contrasena) {
      res.status(400).send({
        message: "Necesita ingresar el correo y la contraseña.",
      });
      return;
    }

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