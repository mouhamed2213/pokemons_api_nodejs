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
      unique: true,
      validate: {
        notEmpty: {
          msg: "Username cannot be empty",
        },
        len: {
          args: [3, 10],
          msg: "Username must be between 3 and 10 characters",
        },
      },
    },
    //  add username validatore
    password: {
      type: dataType.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "password field should not be empty" },

        len: {
          args: [5],
          msg: "password should containt at least 5 characters",
        },
      },
    },
  });
};
