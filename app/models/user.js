const crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      isAlphanumeric: true,
      notEmpty: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      isEmail: true,
    },
    password: {
      type: DataTypes.VIRTUAL,
      set: function(val) {
        if (!this.passwordSalt) {
          this.setDataValue('passwordSalt', crypto.randomBytes(32).toString('hex'));
        }

        const hash = crypto.createHash('sha512');
        hash.update(val);
        hash.update(this.passwordSalt);
        this.setDataValue('passwordHash', hash.digest('hex'));
      }
    },
    passwordSalt: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      is: /^[a-z0-9]+$/,
      isLowercase: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      is: /^[a-z0-9]+$/,
      isLowercase: true,
    }
  });
};
