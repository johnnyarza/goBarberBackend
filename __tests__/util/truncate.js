import database from '../../src/database';

export default function truncate() {
  return database.connection.models.User.destroy({ where: { name: 'Teste' } });
}
