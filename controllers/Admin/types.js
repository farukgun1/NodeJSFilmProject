const { z } = require('zod');

const preInfoStatus = z.enum(['reject', 'first', 'waitForSecond', 'second', 'completed', 'cancelled', 'companyReject'])


const setSystemCategoryInput = z.object({
    userID: z.string(),
    name: z.string(),
    code: z.string(),
    subcategory: z.array(
        z.object({
            isActive: z.boolean().default(true),
            name: z.string(),
            code: z.string()
        }))
})

const updateSystemCategoryInput = z.object({
    categoryId: z.string(),
    userID: z.string(),
    name: z.string(),
    code: z.string(),
    subcategory: z.array(
        z.object({
            isActive: z.boolean(),
            name: z.string(),
            code: z.string()
        }))
})

const deleteSystemCategoryInput = z.object({
    userID: z.string(),
    categoryId: z.string(),
    deletedIds: z.array(z.string())
})

const getSystemCategoryInput = z.object({
    userID: z.string(),
    categoryId: z.string().optional()
})

const inputModel = z.object({
    userID: z.string(),
    name: z.string().optional(),
});

const setAdminInput = z.object({
    name: z.string(),
    surname: z.string().optional()
})


const registerUserInput = z.object({
    userName: z.string(),
    userFirstName: z.string(),
    userSurname: z.string(),
    userMail: z.string(),
    userPassword: z.string(),
})
const setFilmInput = z.object({
    filmName: z.string(),
    filmDirector: z.string(),
    filmTur: z.string(),
    filmKonu: z.string().optional(),
    filmIMDB: z.string(),
    filmURL: z.string(),

})

const addFavoriteFilmInput = z.object({
    userID: z.string(), // userID yerine id
    filmID: z.string(), // filmID yerine filmId
    
  });
  
const updatePersonaInput = z.object({
    userName: z.string(),
    userFirstName: z.string(),
    userSurname: z.string(),
    userMail: z.string(),
    userPassword: z.string(),
    updateId: z.string(),
})

const removePersonaInput = z.object({
    deleteId: z.string(),
})

const removeFilmInput = z.object({
    deleteFilmId: z.string(),
})

const loginUserInput = z.object({
    userName: z.string(),
    userPassword: z.string(),
})

const listingFilmInput = z.object({})   

const listFavoritesInput = z.object({
  
    userID: z.string().optional()
  });

const listingPersonaInput = z.object({
})

const updateFilmInput = z.object({
    filmName: z.string(),
    filmDirector: z.string(),
    filmTur: z.string(),
    filmKonu: z.string().optional(),
    filmIMDB: z.string(),
    filmID: z.string(),
   

})


module.exports = {
    setSystemCategoryInput,
    updateSystemCategoryInput,
    deleteSystemCategoryInput,
    getSystemCategoryInput,
    setAdminInput,
    registerUserInput,
    setFilmInput,
    listingFilmInput,
    addFavoriteFilmInput,
    listFavoritesInput,
    updatePersonaInput,
    removePersonaInput,
    listingPersonaInput,
    removeFilmInput,
    updateFilmInput,
    loginUserInput,
 
}
