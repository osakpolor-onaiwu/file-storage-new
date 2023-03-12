import express from 'express';
const router = express.Router();
import upload from './upload';
import { seckey } from '../../middlewares/seckey';
import { validateUserToken } from '../../middlewares/validate.user.token';

router.post('/upload', validateUserToken, upload);
router.post('/api_upload', seckey, upload);
//other methods here

export default router;