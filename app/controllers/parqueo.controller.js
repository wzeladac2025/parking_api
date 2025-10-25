const db = require("../models");
const Parqueo = db.parqueo;

exports.generarParqueos = async (req, res) => {
  await Parqueo.destroy({ where: {} });
  db.sequelize
    .query("ALTER SEQUENCE PARQUEO_SEQ RESTART WITH 1")
    .catch(() => {});

  try {
    let parqueos = [];
    for (let index = 1; index <= 10; index++) {
      let parqueo = {
        id: index,
        identificador: "PARQUEO" + index,
        estado: "libre",
      };
      parqueos.push(parqueo);
    }

    await Parqueo.bulkCreate(parqueos);
    res.send({ mensaje: "Parqueos creados" });
  } catch (err) {
    res.status(500).send({ message: err.message });
    console.log("hubo un error inesperado", err.message);
  }
};

exports.obtenerParqueos = async (req, res) => {
  const parqueos = await Parqueo.findAll({
    order: [["id", "ASC"]],
  });
  return res.status(200).send(parqueos);
};

exports.findById = async (req, res) => {
  const id = req.params.id;
  const query = await db.sequelize
    .query("select * from parqueos where id = " + id, {
      model: Parqueo,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error al obtener el parqueo.",
      });
    });

  const parqueo = query[0]?.dataValues;
  if (!parqueo) {
    return res.status(404).send({ message: "Parqueo no registrado." });
  }
  return res.send({
    id: parqueo.id,
    estado: parqueo.estado,
  });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  const query = await db.sequelize
    .query("select * from parqueos where id = " + id, {
      model: Parqueo,
      mapToModel: true,
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Error al obtener el parqueo.",
      });
    });

  const parqueo = query[0]?.dataValues;
  if (!parqueo) {
    return res.status(404).send({ message: "Parqueo no registrado." });
  }

  //ACTUALIZAR ESTADO
  await Parqueo.update(
    {
      estado: req.body.estado,
    },
    {
      where: {
        id: parqueo.id,
      },
    }
  )
    .then((id) => {
      if (id == 1) {
        return res.status(200).send({
          id: parqueo.id,
          estado: req.body.estado,
        });
      } else {
        return res.status(401).send({
          mensaje: "No se actualizo el parqueo.",
        });
      }
    })
    .catch(() => {
      return res.status(500).send({
        mensaje: "Error al actualizar el parqueo.",
      });
    });
};
