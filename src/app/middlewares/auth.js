import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não informado' });
  }
  const [, token] = authHeader.split(' ');
  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decoded.id;
  } catch (err) {
    return res.status(401).json({ error: '' });
  }

  return next();
};

const checkToken = async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ erro: 'Token inválido' });
  }
  try {
    await promisify(jwt.verify)(token, authConfig.secret);
    return res.status(200).json();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export { auth, checkToken };
