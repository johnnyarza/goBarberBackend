import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        avatar_id: Sequelize.UUID,
      },
      {
        hooks: {
          beforeCreate: (user, _) => {
            user.id = uuid();
          },
          beforeSave: async (user, _) => {
            if (user.password) {
              user.password_hash = await bcrypt.hash(user.password, 8);
            }
          },
        },
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
