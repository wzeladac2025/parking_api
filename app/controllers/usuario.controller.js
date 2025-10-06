const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = db.usuario;

exports.create = async (req, res) => {
  try {
    if (!req.body.correo && !req.body.contrasena && !req.body.placa) {
      return res.status(400).send({
        mensaje: "Necesita ingresar correo, placa y contraseña.",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.contrasena, 10);

    const usuario = {
      correo: req.body.correo,
      placa: req.body.tipoPlaca + req.body.placa,
      contrasena: hashedPassword,
      role: req.body.role,
      nombres: req.body.nombres,
      apellidos: req.body.apellidos,
      tipo_licencia: req.body.tipoLicencia,
      licencia: req.body.licencia,
    };

    const usuarioJson = Usuario.build(usuario);
    const nuevoUsuario = await usuarioJson
      .save()
      .then(() => {
        return res.status(200).send({
          mensaje: "Usuario registrado exitosamente.",
          correo: nuevoUsuario.correo,
        });
      })
      .catch(() => {
        return res.status(500).send({
          mensaje: "El numero de placa ya se encuentra registrado.",
        });
      });
  } catch (err) {
    return res.status(500).send({ mensaje: err.message });
  }
};

exports.login = async (req, res) => {
  const { placa, contrasena } = req.body;
  try {
    const query = await db.sequelize.query(
      "select * from usuarios where placa = '" + placa + "'",
      {
        model: Usuario,
        mapToModel: true,
      }
    );

    const usuario = query[0]?.dataValues;
    if (!usuario) {
      return res.status(404).send({ message: "Usuario no registrado." });
    }

    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validPassword) {
      return res.status(401).send({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.send({ message: "Login exitoso", access_token: token });
  } catch (err) {
    return res.status(401).send({ message: err.message });
  }
};

exports.findById = async (req, res) => {
  const id = req.params.id;
  const query = await db.sequelize
    .query("select * from usuarios where id = " + id, {
      model: Usuario,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error al obtener el usuario.",
      });
    });

  const usuario = query[0]?.dataValues;
  if (!usuario) {
    return res.status(404).send({ message: "Usuario no registrado." });
  }
  return res.send({
    id: usuario.id,
    correo: usuario.correo,
    role: usuario.role,
  });
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
