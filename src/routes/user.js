import { Router } from 'express';
const user = require('../controllers/user.controller');
const router = Router();

router.get('/users',user.getAllUsers);

router.get('/:id', user.getUser);

router.post('/createUser', user.createUser);

router.delete('/delete/:id', user.deleteUser);

router.put('/update/:id', user.updateUser);

export default router;
