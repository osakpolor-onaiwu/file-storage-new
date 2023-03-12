import express from 'express';
const router = express.Router();
import docRoute from './docs';
import userRoute from './user';
import uploadsRoute from './uploads';

router.get('/',(req,res)=>{
    res.json({
        app:'file storage util',
        status:'running',
    })
});

router.use('/docs', docRoute);
router.use('/user', userRoute);
router.use('/uploads', uploadsRoute);



export default router;