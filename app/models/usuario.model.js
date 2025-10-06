module.exports = (sequelize, Sequelize) => {
  sequelize
    .query(
      "CREATE SEQUENCE USUARIO_SEQ START WITH 1 INCREMENT BY 1"
    )
    .catch(() => { });

  const Usuario = sequelize.define("usuario", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      defaultValue: Sequelize.literal("nextval('usuario_seq')"),
    },    
    correo: {
      type: Sequelize.STRING,
    },
    placa: {
      type: Sequelize.STRING,
      unique: true,
    },
    contrasena: {
      type: Sequelize.STRING,
    },
    nombres: {
      type: Sequelize.STRING,
    },
    apellidos: {
      type: Sequelize.STRING,
    },
    tipo_licencia: {
      type: Sequelize.ENUM("C", "B", "A", "M", "E")
    },
    licencia: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.ENUM("admin", "usuario")
    },
  });
  return Usuario;
};
