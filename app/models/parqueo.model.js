module.exports = (sequelize, Sequelize) => {
  sequelize
    .query(
      "CREATE SEQUENCE PARQUEO_SEQ START WITH 1 INCREMENT BY 1"
    )
    .catch(() => { });

  const Pago = sequelize.define("pago", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      defaultValue: Sequelize.literal("nextval('parqueo_seq')"),
    },
    identificador: {
      type: Sequelize.STRING,
    },
    estado: {
      type: Sequelize.ENUM("libre", "ocupado", "reservado"),
    },    
  });
  return Pago;
};
