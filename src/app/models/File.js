import Sequelize, { Model } from 'sequelize';
import { v4 as uuid } from 'uuid';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.path}`;
          },
        },
      },
      {
        hooks: {
          beforeCreate: (user, _) => {
            user.id = uuid();
          },
        },
        sequelize,
      }
    );
  }
}

export default File;
