async function setFilm(film) {
  console.log(film)
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v1/clean/admin/newfilm',
      film,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Kullanıcı ekleme hatası', error)
    throw error
  }
}

async function updateFilm(filmID, updatedFilmData) {
  console.log('güncellencek veri:', updatedFilmData)
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v1/clean/admin/updatefilm',
      { filmID, ...updatedFilmData }, // Virgül eklendi
      {
        headers: {
          'Content-Type': 'application/json', //
        },
      },
    )
    return response.updatedFilmData
  } catch (error) {
    console.error('Film güncelleme hatası:', error)
    throw error
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
          },
        )

        // Success message and page reload
        Swal.fire({
          icon: 'success',
          title: 'Film silindi!',
          text: 'Film başarıyla silindi.',
          confirmButtonText: 'Tamam',
        }).then(() => {
          location.reload() // Sayfayı yeniden yükle
        })

        return response.data
      } catch (error) {
        console.error('Silme Hatası', error)
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: 'Filmi silerken bir hata oluştu.',
        })
        throw error
      }
    }
  })
}

async function listingFilm() {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/v1/clean/admin/listingfilm',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response.data.data
  } catch (error) {
    console.error('Silme Hatası', error)
    throw error
  }
}

const createFilmCard = (film) => {
  const div = document.createElement('div')
  div.classList.add('col-xl-3', 'col-lg-4', 'col-md-6')
  div.innerHTML = `
  <div class="gen-carousel-movies-style-3 movie-grid style-3">
      <div class="gen-movie-contain">
          <div class="gen-movie-img">
              <!-- Statik img -->
              <img src="../images/background/asset-36.jpg" alt="${film.filmName}">
              <div class="gen-movie-add">
                  <div class="wpulike wpulike-heart">
                      <div class="wp_ulike_general_class">
                          <a href="#" class="sl-button text-white"><i class="far fa-heart"></i></a>
                      </div>
                  </div>
                  <ul class="menu bottomRight">
                      <li class="share top">
                          <i class="fa fa-share-alt"></i>
                          <ul class="submenu">
                              <li><a href="#" class="facebook"><i class="fab fa-facebook-f"></i></a></li>
                              <li><a href="#" class="facebook"><i class="fab fa-instagram"></i></a></li>
                              <li><a href="#" class="facebook"><i class="fab fa-twitter"></i></a></li>
                          </ul>
                      </li>
                  </ul>
                  <div class="video-actions--link_add-to-playlist dropdown">
                      <a class="dropdown-toggle" href="#" data-toggle="dropdown"><i class="fa fa-plus"></i></a>
                      <div class="dropdown-menu">
                          <a class="login-link" href="#">Sign in to add this video to a playlist.</a>
                      </div>
                  </div>
              </div>
              <div class="gen-movie-action">
                  <a href="#" class="gen-button">
                      <i class="fa fa-play"></i>
                  </a>
              </div>
          </div>
          <div class="gen-info-contain">
              <div class="gen-movie-info">
                  <h3><a href="#">${film.filmName}</a></h3>
              </div>
              <div class="gen-movie-meta-holder">
                  <ul>
                      <li>${film.filmDirector}</li>
                      <li><a href="#"><span>${film.filmTur}</span></a></li>

                  </ul>
              </div>
          </div>
      </div>
  </div>
  `
  console.log('films', film)
  return div
}
async function renderFilmCards() {
  const films = await listingFilm()

  const filmContainer = document.getElementById('film-container')

  if (films.length > 0) {
    films.forEach((film) => {
      const filmCard = createFilmCard(film)
      filmContainer.appendChild(filmCard)
    })
  } else {
    filmContainer.innerHTML = '<p>Film Buklunamadı.</p>'
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if ($('#film-container').length > 0) {
    renderFilmCards()
  }
})

document.addEventListener('DOMContentLoaded', () => {
  $('#filmKaydetBtn').click(async function () {
    var formData = $('#addDataForm').serializeArray()
    var data = {}

    formData.forEach(function (item) {
      data[item.name] = item.value
    })

    try {
      // Filmi kaydetme işlemi
      const response = await setFilm(data)
      console.log('Kayit Başarılı', response)

      Swal.fire({
        icon: 'success',
        title: 'Kayıt Başarılı',
        text: 'Kayıt işlemi başarıyla tamamlandı.',
      }).then(() => {
        location.reload()
      })

      // Kaydetme sonrası listeyi güncellemek için
      const films = await listingFilm() // ListingFilm API'sini çağır ve sonucu al
      updateFilmTable(films.data) // Filmleri tabloya ekle
    } catch (error) {
      console.error('Kayıt hatası:', error)
      Swal.fire({
        icon: 'error',
        title: 'Kayıt başarısız!',
        text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      })
    }
  })
})

async function updateFilmTable(films) {
  console.log('films', films)
  const tableBody = document.getElementById('dataTable')
  console.log(tableBody)
  tableBody.innerHTML = ''

  films.forEach((film, index) => {
    const row = document.createElement('tr')

    const filmData = film

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
  film = JSON.parse(decodeURIComponent(film))
  $('#editModal').modal('show')
  document.getElementById('inputEditFilmId').value = film._id // Film ID'sini gizli inputa yerleştir
  document.getElementById('inputEditFilmname').value = film.filmName
  document.getElementById('inputEditYonetmen').value = film.filmDirector
  document.getElementById('inputEditTur').value = film.filmTur
  document.getElementById('inputEditIMDB').value = film.filmIMDB
}

document.addEventListener('DOMContentLoaded', async function () {
  document
    .getElementById('updateFilmModalBtn')
    .addEventListener('click', async () => {
      const filmID = document.getElementById('inputEditFilmId').value
      const updatedFilmData = {
        filmName: document.getElementById('inputEditFilmname').value,
        filmDirector: document.getElementById('inputEditYonetmen').value,
        filmTur: document.getElementById('inputEditTur').value,
        filmIMDB: document.getElementById('inputEditIMDB').value,
      }
      console.log('Film ID:', filmID)
      console.log('Updated Film Data:', updatedFilmData)
      try {
        // Film güncelleme işlemini başlat
        await updateFilm(filmID, updatedFilmData)
        $('#editModal').modal('hide')
        Swal.fire({
          icon: 'success',
          title: 'Başarılı!',
          text: 'Film başarıyla güncellendi.',
        }).then(() => {
          location.reload()
        })
      } catch (error) {
        console.error('Film güncelleme hatası:', error)
        Swal.fire({
          icon: 'error',
          title: 'Hata!',
          text: 'Film güncellenirken bir sorun oluştu.',
        })
      }
    })
})

// Güncelleme butonuna tıklama olayını dinle
