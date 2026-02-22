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
      type: dataType.STRING,
      allowNull: false,
      validate: {
        min: 14,
        max: 15,
      },
    },
    //  add username validatore
    password: {
      type: dataType.STRING,
      allowNull: false,
    },
  });
};
