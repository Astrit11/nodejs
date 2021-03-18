import { Router } from 'express';
const user = require('../controllers/user.controller');
const router = Router();
const passport =  require("passport");

router.get('/account',passport.authenticate("jwt",{session:false}),user.TestPassport);

router.get('/users',user.getAllUsers);

router.post('/login/',user.LoginUser);

router.get('/:id', user.getUser);

router.post('/register', user.registerUser);

router.delete('/delete/:id', user.deleteUser);

router.put('/update/:id', user.updateUser);



export default router;
