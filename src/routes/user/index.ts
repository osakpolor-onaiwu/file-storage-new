import express from 'express';
import login from './login';
import { extractClientInfo } from '../../middlewares/extract.client.info';
import { validateUserToken } from '../../middlewares/validate.user.token';
import { refreshUserToken } from './refresh-token';
import register from './register';
import user_details from './user.detail';
import userLogout from './logout';
const router = express.Router();

router.post('/register', register);
router.post('/login', extractClientInfo, login);
router.post('/token/referesh', extractClientInfo, refreshUserToken);
router.post('/logout', extractClientInfo, userLogout);
router.get('/user_detail',validateUserToken, user_details);


export default router;