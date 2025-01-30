/* eslint-disable no-unused-vars */
const {
  createCustomError,
  errorRoute,
  databaseActionType,
} = require('../../errors/custom-error');
const { makeActionHistory } = require('../../helpers/actionHistory');
const { sendLoginInfoToCompany, generateRandomPassword, sendEmail } = require('../../helpers/mail');
const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { createSuccessMessage } = require('../../success/custom-success');
const { adminSchema } = require('../../models/admin');
const {Register} = require('../../models/register');
const { Film } = require('../../models/film'); // Film içeri aktarılıyor

// Admin Ekleme Fonksiyonu
const setAdmin = async (input, res, next, results) => {
  const { name, surname } = input;
  try {
      const newCustomer = new adminSchema({
          name,
          surname,
      });
      const savedCustomer = await newCustomer.save();
      return next(createSuccessMessage(2000, savedCustomer));
  } catch (err) {
      console.error(err);
      return next(createCustomError(9000, errorRoute.Enum.general));
  }
};

// Kullanıcı Kaydı Fonksiyonu
const registerUser = async (input, res, next, results) => {
  const { userName, userFirstName, userSurname, userMail, userPassword } = input;
  try {
      const newRegister = new Register({
          userName,
          userFirstName,
          userSurname,
          userMail,
          userPassword,
      });
      const savedRegister = await newRegister.save();
      return next(createSuccessMessage(2000, savedRegister));
  } catch (err) {
      console.error(err);
      return next(createCustomError(1000, errorRoute.Enum.admin));
  }
};

const loginUser = async (input, res, next) => {
  const {userName, userPassword} = input;
  try {
    const user = await Register.findOne({userName, isActive: true});
    if(!user) {
      return next(createCustomError(1000, errorRoute.Enum.general));
    }

    
    const isPasswordValid = user.userPassword === userPassword;

    if(!isPasswordValid) {
      return next(createCustomError(1000, errorRoute.Enum.general,  'Şifre yanlış.'));
    }
    const token = jwt.sign(
      { userID: user._id, userName: user.userName }, // Kullanıcıya ait bilgileri payload olarak ekliyoruz
      process.env.JWT_SECRET, // JWT'nin gizli anahtarını env'den alıyoruz
      { expiresIn: '1h' } // Token'ın geçerlilik süresi (1 saat)
    );
    return res.status(200).json({
      message: 'Giriş başarılı!',
      token: token, // Oluşturduğumuz token
      user: {
        userID: user._id,
        userMail: user.userMail,
        userName: user.userName,
        userFirstName: user.userFirstName,
        userSurname: user.userSurname,
      }
    });
  } catch (error) {
    console.error(error);
    return next(createCustomError(9000, 'Bir hata oluştu.'));
  }
}

const listingPersona = async (input, res, next) => {
  try {
    const personas = await Register.find({ isActive: true })
    console.log("Aktif Kişiler:", personas);
    if(!personas || personas.length === 0) {
      return next(createCustomError(9002, errorRoute.Enum.notFound))
    }
    return next(createSuccessMessage(2002, personas))
  } catch (err) {
    console.error(err)
    return next(createCustomError(9000, errorRoute.Enum.general))
  }
}




const updatePersona = async (input, res, next) => {
  try {
    const {
      updateId, // Bu ID ile işlem yapacağız
      userName,
      userFirstName,
      userSurname,
      userMail,
      userPassword,
      isActive, // Eğer isActive değeri belirtilmemişse eski değeri kullanacağız
    } = input

    // 1. Mevcut kullanıcıyı bul
    const persona = await Register.findById(updateId)

    if (!persona) {
      return next(createCustomError(1002, errorRoute.Enum.custom)) // Kullanıcı bulunamazsa hata
    }

    // 2. Güncellenmek istenen verileri hazırlayın
    const updatedData = {
      userName,
      userFirstName,
      userSurname,
      userMail,
      userPassword,
      isActive: isActive !== undefined ? isActive : persona.isActive, // Varsayılan değer korunur
    }

    // 3. Kullanıcıyı güncelle
    const updatedPersona = await Register.findByIdAndUpdate(
      updateId,
      { $set: updatedData }, // Güncellenmiş veri
      { new: true, runValidators: true } // Seçenekler: yeni veriyi döndür ve doğrulama yap
    )

    if (!updatedPersona) {
      return next(createCustomError(1002, errorRoute.Enum.custom)) // Güncelleme başarısızsa hata
    }

    // 4. Başarı mesajı döndür
    return next(createSuccessMessage(2006, updatedPersona)) // Güncellenmiş kullanıcıyı döndür
  } catch (error) {
    console.error(error)
    return next(createCustomError(9000)) // Genel hata durumu
  }
}

const deleteFilm = async (input, res, next) => {
  try {
    const {deleteFilmId} = input;
    const resultFilmList = await Film.findByIdAndUpdate(
      deleteFilmId,
      { isActive: false},
      {new: true},
    )
    if (!resultFilmList) {
      return next(createCustomError(1002, errorRoute.Enum.custom))
    }

    return next(createSuccessMessage(2004, resultFilmList))
  } catch (error) {
    console.error(error)
    return next(createCustomError(9000))
  }
}




const removePersona = async (input, res, next) => {
  try {
    const deleteId = input.deleteId
    const result = await Register.findByIdAndUpdate(
      deleteId,
      {isActive: false},
      {new: true},
    )
    console.log("Silinecek ID:", deleteId);
console.log("Silme Sonucu:", result);

    if(!result) {
      return next(createCustomError(1002, errorRoute.Enum.custom))
    }
    return next(createSuccessMessage(2004, result))
  } catch (error) {
    console.error(error)
    return next(createCustomError(9000))
  }
}




// Film Ekleme Fonksiyonu
// const setFilm = async (input, res, next, results) => {
//   const { filmName, filmDirector,  filmTur, filmIMDB } = input;

//   // Gerekli alanlar kontrol ediliyor
//   if (!filmName || !filmDirector || !filmIMDB) {
//       return next(createCustomError(4000, 'Invalid input data'));
//   }

//   try {
//       const newFilm = new Film({
//           filmName,
//           filmDirector,
//           filmTur,
//           filmIMDB,
//           filmImage
//       });
//       console.log('newFilm:', newFilm);
//       const savedFilm = await newFilm.save();
//       return next(createSuccessMessage(2000, savedFilm)); // savedDepartman yerine savedFilm kullanılıyor
//   } catch (err) {
//       console.error('Error while saving film:', err.message, err.stack);

//       return next(createCustomError(4000, 'Invalid input data'));
//   }
// };

// Film Listeleme Fonksiyonu


// const setFilm = async (req, res, next) => {
//   console.log('req.file:', req.file);   
//   const { filmName, filmDirector, filmIMDB, filmTur } = req.body;  // req.body üzerinden verileri alıyoruz
//   const filmImage = req.file ? `/images/${req.file.filename}` : null; 

//   // Gerekli alanlar kontrol ediliyor
//   if (!filmName || !filmDirector || !filmIMDB) {
//       return next(createCustomError(4000, 'Invalid input data'));
//   }

//   try {
//       const newFilm = new Film({
//           filmName,
//           filmDirector,
//           filmTur,
//           filmIMDB,
//           filmImage,
//       });
//       console.log('newFilm:', newFilm);
//       const savedFilm = await newFilm.save();
//       return next(createSuccessMessage(2000, savedFilm)); // savedFilm kullanılıyor
//   } catch (err) {
//       console.error('Error while saving film:', err.message, err.stack);
//       return next(createCustomError(4000, 'Invalid input data'));
//   }
// };

const setFilm = async (input, res, next, results, req) => {
  try {
    console.log("req", req);
    const photoPath = req.imageFileName;

    console.log("Yüklenen Fotoğraf Yolu:", photoPath);
    console.log("Gelen Input:", input);

    // Film modelini oluştur
    const newFilm = new Film({
      ...input, // Gelen input verilerini ekle
      photo: photoPath, // Fotoğraf yolunu ekle
    });

    // Veritabanına kaydet
    const savedFilm = await newFilm.save();

    // Başarı yanıtı
    return res.status(200).json({
      code: 2000,
      message: "Film başarıyla kaydedildi.",
      data: savedFilm,
    });
  } catch (err) {
    console.error("Error while saving film:", err.message, err.stack);

    // Hata yanıtı
    return res.status(400).json({
      code: 4000,
      message: "Invalid input data",
      error: err.message,
    });
  }
};

const listingFilm = async (input, res, next) => {
  try {
      const films = await Film.find({ isActive: true });

      if (!films || films.length === 0) {
          return next(createCustomError(9002, errorRoute.Enum.notFound));
      }
      
    
      return next(createSuccessMessage(2002, films)); 
  } catch (err) {
      console.error(err);
      return next(createCustomError(9000, errorRoute.Enum.general));
  }
};
const addFavoriteFilm = async (input, res, next) => {
  try {
    // Giriş verisini zod ile doğrulama
    // Veriyi doğrulamak için req.body kullanıyoruz.
      let { userID, filmID } = input; 
    // Eğer doğrulama hatası varsa, hata döndür

    // Doğrulanan veriyi al
    
    // Kullanıcıyı veritabanından bul
    const register = await Register.findOne({ _id: userID});
    if (!register) {
      return next(createCustomError(404, 'Kullanıcı bulunamadı.'));
    }
    console.log("register:", register)

    // Film verisini veritabanından bul
    const film = await Film.findOne({ _id: filmID });
    if (!film) {
      return next(createCustomError(404, 'Film bulunamadı.'));
    }
    console.log("film:", film)
    // Film zaten favorilere eklenmiş mi kontrol et
    const isFavorite = register.favorites.includes(filmID);
    if (isFavorite) {
      // Film favorilerden çıkarılıyor
      await register.updateOne({
        $pull: { favorites: filmID }
      });
      return res.status(200).json({
        msg: "Film Favorilerden Çıkarıldı",
        favorites: register.favorites,
      });
    } else {
      register.favorites.push(filmID);
      await register.save();
      return res.status(200).json({
        msg: "Film Favorilere Eklendi",
        favorites: register.favorites,
      })
    }
  } catch (err) {
    console.error('Error while adding favorite:', err.message, err.stack);
    return next(createCustomError(1000, 'Bir hata oluştu.'));
  }
};

const listingFavorite = async (input, res, next) => {
  try {
    const { userID } = input; // Artık sadece userID alıyoruz

    // Kullanıcıyı veritabanından bul
    const register = await Register.findOne({ _id: userID });
    if (!register) {
      return next(createCustomError(1000, errorRoute.Enum.admin));
    }

    // Kullanıcının favori film ID'lerini al
    const favoriteFilmIDs = register.favorites;

    // Eğer favori film ID'leri boşsa, hata döndür
    if (!favoriteFilmIDs || favoriteFilmIDs.length === 0) {
      return next(createCustomError(1000, errorRoute.Enum.admin));
    }

    // Favori film ID'lerine göre filmleri veritabanından çek
    const favoriteFilms = await Film.find({ '_id': { $in: favoriteFilmIDs } });
    if (!favoriteFilms || favoriteFilms.length === 0) {
      return next(createCustomError(1000, errorRoute.Enum.admin));
    }

    // Sonuçları döndür
    return res.status(200).json({
      msg: "Favori filmler başarıyla listelendi.",
      data: favoriteFilms,
    });

  } catch (err) {
    console.error('Error while listing favorite films:', err.message, err.stack);
    return next(createCustomError(9000, 'Bir hata oluştu.'));
  }
};





const updateFilm = async (input,res,next) => {
  try {
    const {
          filmName,
          filmDirector,
          filmTur,
          filmIMDB,
          filmID,
    } = input

    const film = await Film.findById(filmID)

    if(!film) {
      return next(createCustomError(1002, errorRoute.Enum.custom))
    }
    
    const updatedFilmData = {
      filmName,
      filmDirector,
      filmTur,
      filmIMDB,
      filmID,
    }
    const updatedFilm = await Film.findByIdAndUpdate(
      filmID,
      { $set: updatedFilmData},
      {new: true, runValidators: true},
    )

    if(!updatedFilm) {
      return next(createCustomError(1002, errorRoute.Enum.custom))
    }
    return next(createSuccessMessage(2006, updatedFilm))
  }  catch (error) {
    console.error(error)
    return next(createCustomError(9000))
  }
}


module.exports = { setAdmin, registerUser, setFilm, listingFilm, addFavoriteFilm, listingFavorite, updatePersona, removePersona, listingPersona, deleteFilm, updateFilm, loginUser,};
