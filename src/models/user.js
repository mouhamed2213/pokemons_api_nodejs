export const userModel = (sequelize, dataType) => {
  // define user model
  return sequelize.define("User", {
    id: {
      type: dataType.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: dataType.STRING(255),
      allowNull: false,
    },
    //  add username validatore
    password: {
      type: dataType.STRING,
      allowNull: false,
    },
  });
};
