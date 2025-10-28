const db = require("../models");
const Reserva = db.reserva;

exports.create = async (req, res) => {
  try {
    const reservaObj = {
      id_usuario: req.body.id_usuario,
      id_parqueo: req.body.id_parqueo,
      fecha_inicio: req.body.fecha_inicio,
      fecha_fin: req.body.fecha_fin,
      estado: "confirmada",
    };

    const reserva = Reserva.build(reservaObj);
    const nuevaReserva = await reserva.save().catch((err) => {
      res.status(500).send({
        mensaje:
          err.message ||
          "Error al crear la reserva. Consulte a su administrador.",
      });
    });

    res.send(nuevaReserva);
  } catch (err) {
    res.status(500).send({ mensaje: err.message });
    console.log("Hubo un error inesperado", err.message);
  }
};

exports.update = (req, res) => {
  const id = req.params.id;

  Reserva.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          mensaje: "Reserva actualizado exitosamente.",
        });
      } else {
        res.send({
          mensaje: "No se pudo actualizar la reserva.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        mensaje: "Error al actualizar la reserva.",
      });
    });
};
