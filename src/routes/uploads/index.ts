import express from 'express';
const router = express.Router();
import search from './search';
import deletes from './delete';
import get_download from './getdownload';
import { seckey } from '../../middlewares/seckey'
import { validateUserToken } from '../../middlewares/validate.user.token';

router.get('/search', validateUserToken, search);
router.get('/download/:filename', validateUserToken, get_download);
router.post('/delete', validateUserToken, deletes);
router.get('/api_search', seckey, search);
router.get('/api_download/:filename', seckey, get_download);
router.post('/api_delete', seckey, deletes);
export default router;