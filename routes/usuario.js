//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, postUsuarioAdmin, postUsuarioClient, putUsuario, deleteUsuario } = require('../controllers/usuario');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getUsuarios);

router.post('/agregarA', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postUsuarioAdmin);
router.post('/agregarC', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo').custom( emailExiste ),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    validarCampos,
] ,postUsuarioClient);
router.put('/editar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    check('rol').custom(  esRoleValido ),
    validarCampos
] ,putUsuario);


router.delete('/eliminar/:id', [
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'SUPERADMIN_ROLE', 'COORDINADOR_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteUsuario);


module.exports = router;


// ROUTES