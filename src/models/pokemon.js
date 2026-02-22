// pokemon model
export const pokemonModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Pokemon",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "This pokemon name already exist",
        },

        // validation
        validate: {
          notNull: { msg: "This field is required" },
          notEmpty: { msg: "pokemon name should not be empty" },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,

        // validation
        validate: {
          is: /^[0-9]+$/,

          min: {
            args: [0],
            msg: "pokemon Hp should have at least 0 hp",
          },
          max: {
            args: [999],
            msg: "maximum pokemon Hp = 999",
          },
        },
      },
      cp: {
        type: DataTypes.STRING,
        allowNull: false,

        // validation
        validate: {
          is: /^[0-9]+$/,
          min: {
            args: [0],
            msg: "pokemon cp should have at least 0 cp",
          },

          max: {
            args: [99],
            msg: "maximum pokemon Cp = 99",
          },
        },
      },

      picture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {},
        get() {
          return this.getDataValue("types").split(",");
        },
        set(types) {
          this.setDataValue("types", types.join(","));
        },
      },
    },
    // other option
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    },
  );

  console.log(Pokemon === sequelize.models.Pokemon);
};

export const UserModel = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
