function getJWTFromCookie() {
  const name = 'token='
  const cookieArray = document.cookie.split(';')
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim() // trim ile baştaki ve sondaki boşlukları temizleyin
    if (cookie.indexOf(name) === 0) {
      return decodeURIComponent(cookie.substring(name.length, cookie.length)) // Değerini decode edin
    }
  }
  return null
}
const jwt = getJWTFromCookie()

// async function setFilm(film) {
//     console.log(film)
//     try {
//       const response = await axios.post(
//         'http://localhost:3001/api/v1/clean/admin/newfilm',
//         film,
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       )
//       console.log(response.data)
//       return response.data
//     } catch (error) {
//       console.error('Kullanıcı ekleme hatası', error)
//       throw error
//     }
//   }
  
  async function updateFilm(filmID,updatedFilmData) {
      console.log("güncellencek veri:", updatedFilmData);
      try {
          const response = await axios.post(
              'http://localhost:3001/api/v1/clean/admin/updatefilm',
              { filmID, ...updatedFilmData }, // Virgül eklendi
              {
                  headers: {
                      'Content-Type': 'application/json' // 'Content-Type' düzeltildi
                  }
              }
          );
          return response.data // Yanıtı döndür
      } catch (error) {
          console.error('Film güncelleme hatası:', error);
          throw error; // Hata yönetimis
      }
  }
  
  async function deleteFilm(deleteFilmId) {
      console.log(deleteFilmId)
    
      Swal.fire({
        icon: 'warning',
        title: 'Emin misiniz?',
        text: 'Bu filmi silmek üzeresiniz.',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Evet, sil!',
        cancelButtonText: 'Hayır, vazgeç',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await axios.post(
              'http://localhost:3001/api/v1/clean/admin/removefilm',
              { deleteFilmId },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            
            // Success message and page reload
            Swal.fire({
              icon: 'success',
              title: 'Film silindi!',
              text: 'Film başarıyla silindi.',
              confirmButtonText: 'Tamam',
            }).then(() => {
              location.reload(); // Sayfayı yeniden yükle
            });
            
            return response.data;
          } catch (error) {
            console.error('Silme Hatası', error);
            Swal.fire({
              icon: 'error',
              title: 'Hata!',
              text: 'Filmi silerken bir hata oluştu.',
            });
            throw error;
          }
        }
      });
    }
    document.addEventListener('DOMContentLoaded', fetchFilms)
    
    
    
    async function listingFilm() {
      try {
          const response = await axios.post(
              'http://localhost:3001/api/v1/clean/admin/listingfilm',
              {},
              {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              },
          );
          console.log('API Response:', response.data);
          return response.data.data;
      } catch (error) {
          console.error('Silme Hatası', error);
          throw error;
      }
    }
  

    
  
  // async function fetchFilms() {
  //   try {
  //     const films = await listingFilm() // listingFilm fonksiyonuyla film verilerini al
  //     updateFilmTable(films) // Verileri tabloya ekle
  //     console.log("filmsData", films);
  //   } catch (error) {
  //     console.error('Film listeleme hatası:', error)
  //   }
  // }
  async function fetchFilms() {
    try {
      const films = await listingFilm(); // listingFilm'den gelen veriyi al
      console.log("filmsData", films); // films'i konsolda kontrol et
      if (films && films.length > 0) {
        updateFilmTable(films); // Verileri tabloya ekle
      } else {
        console.error('Filmler verisi boş veya hatalı.');
      }
    } catch (error) {
      console.error('Film listeleme hatası:', error);
    }
  }
 
  document.addEventListener('DOMContentLoaded', () => {
    $('#filmKaydetBtn').click(async function (e) {
      e.preventDefault(); // Formun otomatik gönderilmesini engelle
      
      console.log("IMDB Element:", $("input#inputIMDB").val()); 
      var formData = new FormData();
      formData.append("filmName", $('#inputFilmname').val());
      formData.append("filmDirector", $('#inputYonetmen').val());
      formData.append("filmTur", $('#inputTur').val());
      formData.append("filmIMDB", $('#inputIMDB').val());
      formData.append("photo", $('#inputFilmImage')[0].files[0]); 
      formData.append("filmURL", $('#inputVideoLink').val());

      console.log("Film URL:", $('#inputVideoLink').val());
    

      try {
     
       
        const response = await axios.post('http://localhost:3001/api/v1/clean/admin/newfilm', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response)
        Swal.fire({
          icon: 'success',
          title: 'Kayıt Başarılı',
          text: 'Film başarıyla eklendi.',
        }).then(() => {
          location.reload(); // Sayfayı yenileyerek film listesi güncellenebilir
        });
  
        // Kaydetme sonrası listeyi güncellemek için
        const films = await listingFilm(); // ListingFilm API'sini çağır ve sonucu al
        updateFilmTable(films.data); // Filmleri tabloya ekle
      } catch (error) {
        console.error('Kayıt hatası:', error);
        Swal.fire({
          icon: 'error',
          title: 'Kayıt başarısız!',
          text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        });
      }
    });
  });
  
  async function updateFilmTable(films) {
    const tableBody = document.getElementById('dataTable')
    tableBody.innerHTML = ''
  
    films.forEach((film, index) => {
      const row = document.createElement('tr');
  
      const filmData = film;
  
      row.innerHTML = `
              <td>${tableBody.rows.length + 1}</td>
              <td>${film.filmName}</td>
              <td>${film.filmDirector}</td>
              <td>${film.filmTur}</td>
              <td>${film.filmIMDB}</td>
              <td>
                  <button class="btn btn-sm btn-warning" onclick="updateFilms('${encodeURIComponent(JSON.stringify(film))}')">Düzenle</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteFilm('${film._id}')">Sil</button>
              </td>
          `
  
      tableBody.appendChild(row)
    })
  }
  
  async function updateFilms(film) {
      film = JSON.parse(decodeURIComponent(film));
      $('#editModal').modal('show');
      document.getElementById('inputEditFilmId').value = film._id; // Film ID'sini gizli inputa yerleştir
      document.getElementById('inputEditFilmname').value = film.filmName;
      document.getElementById('inputEditYonetmen').value = film.filmDirector;
      document.getElementById('inputEditTur').value = film.filmTur;
      document.getElementById('inputEditIMDB').value = film.filmIMDB;
      
  
  
  };
  
  document.addEventListener('DOMContentLoaded', async function () {
      document.getElementById('updateFilmModalBtn').addEventListener('click', async () => {
          const filmID = document.getElementById('inputEditFilmId').value;
          const updatedFilmData = {
              filmName: document.getElementById('inputEditFilmname').value,
              filmDirector: document.getElementById('inputEditYonetmen').value,
              filmTur: document.getElementById('inputEditTur').value,
              filmIMDB: document.getElementById('inputEditIMDB').value,
          };
          console.log('Film ID:', filmID);
          console.log('Updated Film Data:', updatedFilmData);
          try {
              // Film güncelleme işlemini başlat
              await updateFilm(filmID, updatedFilmData);
              $('#editModal').modal('hide');
              Swal.fire({
                  icon: 'success',
                  title: 'Başarılı!',
                  text: 'Film başarıyla güncellendi.',
              }).then(() => {
                location.reload()
              })
          } catch (error) {
              console.error('Film güncelleme hatası:', error);
              Swal.fire({
                  icon: 'error',
                  title: 'Hata!',
                  text: 'Film güncellenirken bir sorun oluştu.',
              });
          }
      });
  });
  
  
  
  
  
  
  
  
  
  
  // Güncelleme butonuna tıklama olayını dinle
  
  
  