const express = require('express')
const router = express.Router()
const { upload } = require('../../helpers/multer'); 
const { inputControllerMiddleware } = require('../../middleware/inputController')
const { setCategoryToSystem, updateCategoryToSystem, deleteCategoryToSystem, getCategoryToSystem, setAdmin, registerUser, setFilm, listingFilm, addFavoriteFilm, listingFavorite, updatePersona, removePersona, listingPersona, deleteFilm, updateFilm, loginUser,  } = require('../../controllers/Admin/admin')
const { setSystemCategoryInput, updateSystemCategoryInput, deleteSystemCategoryInput, getSystemCategoryInput,setAdminInput, setFilmInput, listingFilmInput, registerUserInput, addFavoriteFilmInput, listFavoritesInput, updatePersonaInput, removePersonaInput, listingPersonaInput, removeFilmInput, updateFilmInput, loginUserInput, } = require('../../controllers/Admin/types')

// router.route('/setsystemcategory').post(inputControllerMiddleware(setSystemCategoryInput, setCategoryToSystem, 'post', true))
// router.route('/updatesystemcategory').post(inputControllerMiddleware(updateSystemCategoryInput, updateCategoryToSystem, 'post', true))
// router.route('/deletesystemcategory').post(inputControllerMiddleware(deleteSystemCategoryInput, deleteCategoryToSystem, 'post', true))
// router.route('/getsystemcategory/:userId/:categoryId?').get(inputControllerMiddleware(getSystemCategoryInput, getCategoryToSystem, 'get', true))



router.route('/setadmin').post(inputControllerMiddleware(setAdminInput, setAdmin, 'post', true))

router.route('/newregister').post(inputControllerMiddleware(registerUserInput, registerUser, 'post', true))

router.route('/newfilm').post(
    upload.single('photo'), // Multer middleware dosyayı işliyor
    inputControllerMiddleware(setFilmInput, setFilm, 'post', true) // Input kontrolü ve setFilm çağrısı
);

 

router.route('/listingfilm').post(inputControllerMiddleware(listingFilmInput, listingFilm, 'post', true))

router.route('/favoriekle').post(inputControllerMiddleware(addFavoriteFilmInput, addFavoriteFilm, 'post', true));

router.route('/listingfavori').post(inputControllerMiddleware(listFavoritesInput, listingFavorite, 'post', true));

router.route('/updatepersona').post(inputControllerMiddleware(updatePersonaInput, updatePersona, 'post', true));

router.route('/removepersona').post(inputControllerMiddleware(removePersonaInput, removePersona, 'post', true));

router.route('/listpersona').post(inputControllerMiddleware(listingPersonaInput, listingPersona, 'post', true))

router.route('/removefilm').post(inputControllerMiddleware(removeFilmInput, deleteFilm, 'post', true))

router.route('/updatefilm').post(inputControllerMiddleware(updateFilmInput, updateFilm, 'post', true))

router.route('/loginuser').post(inputControllerMiddleware(loginUserInput, loginUser, 'post', true))





module.exports = router;
