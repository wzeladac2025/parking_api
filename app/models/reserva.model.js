module.exports = (sequelize, Sequelize) => {
  const Usuario = require('../models/usuario.model')(sequelize, Sequelize);
  const Parqueo = require('../models/parqueo.model')(sequelize, Sequelize);

  sequelize
    .query(
      "CREATE SEQUENCE RESERVA_SEQ START WITH 1 INCREMENT BY 1"
    )
    .catch(() => { });

  const Reserva = sequelize.define("reserva", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      defaultValue: Sequelize.literal("nextval('reserva_seq')"),
    },
    id_parqueo: {
      type: Sequelize.INTEGER,
    },
    id_usuario: {
      type: Sequelize.INTEGER,
    },
    fecha_inicio: {
      type: Sequelize.DATE,
    },
    fecha_fin: {
      type: Sequelize.DATE,
    },
    estado: {
      type: Sequelize.ENUM("confirmada", "activa", "cancelada", "finalizada"),
    }
  });

  Reserva.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    targetKey: "id"
  });

  Reserva.belongsTo(Parqueo, {
    foreignKey: "id_parqueo",
    targetKey: "id"
  });

  Usuario.hasOne(Reserva, {
    foreignKey: "id_usuario",
    sourceKey: "id"
  });

  Parqueo.hasOne(Reserva, {
    foreignKey: "id_parqueo",
    sourceKey: "id"
  });

  return Reserva;
};
