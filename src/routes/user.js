import { Router } from 'express';
const user = require('../controllers/user.controller');
const router = Router();

router.get('/users',user.getAllUsers);
router.post('/login/',user.LoginUser);

router.get('/:id', user.getUser);

router.post('/register', user.registerUser);

router.delete('/delete/:id', user.deleteUser);

router.put('/update/:id', user.updateUser);



export default router;
