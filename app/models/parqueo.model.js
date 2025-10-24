module.exports = (sequelize, Sequelize) => {
  sequelize
    .query(
      "CREATE SEQUENCE PARQUEO_SEQ START WITH 1 INCREMENT BY 1"
    )
    .catch(() => { });

  const Parqueo = sequelize.define("parqueo", {
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
  return Parqueo;
};
