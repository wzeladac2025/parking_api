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
    const nuevoUsuario = await usuarioJson.save().catch(() => {
      return res.status(500).send({
        mensaje: "El numero de placa ya se encuentra registrado.",
      });
    });

    return res.status(200).send({
      mensaje: "Usuario registrado exitosamente.",
      correo: nuevoUsuario.correo,
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
      return res.status(404).send({ mensaje: "Usuario no registrado." });
    }

    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validPassword) {
      return res.status(401).send({ mensaje: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.send({ mensaje: "Sesion Iniciada.", access_token: token });
  } catch (err) {
    return res.status(401).send({ mensaje: err.message });
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
