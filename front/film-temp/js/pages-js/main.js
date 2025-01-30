
function getJWTFromCookie() {
    const name = 'token=';
    const cookies = document.cookie.split(';'); // Çerezleri ayrıştır

    for (const cookie of cookies) {
        const trimmedCookie = cookie.trim(); // Boşlukları temizle
        if (trimmedCookie.startsWith(name)) {
            // Token'i ayıkla ve geri döndür
            return decodeURIComponent(trimmedCookie.substring(name.length));
        }
    }
    return null; // Token bulunamadıysa null döndür
}

function parseJWT(token) {
    if (!token) {
        console.error("Geçersiz token:", token);
        return null;
    }

    try {
        const payload = token.split('.')[1]; // JWT'nin payload kısmını al
        if (!payload) {
            console.error("JWT payload kısmı bulunamadı.");
            return null;
        }

        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/'); // Base64 düzeltmeleri
        const decodedPayload = atob(base64); // Base64 çözümle
        const parsedPayload = JSON.parse(decodedPayload); // JSON olarak çözümle
        console.log("decoded payload: ",decodedPayload);
        console.log("Çözümlenen Payload:", parsedPayload);  

        // `userId` veya `userID` gibi farklı anahtarları kontrol et
        const userID = parsedPayload.userId || parsedPayload.userID;

        if (!userID) {
            console.error("Payload içinde 'userId' bulunamadı.");
            return null;
        }

        return userID; // Bulunan userId'yi döndür
    } catch (error) {
        console.error('JWT çözümleme hatası:', error);
        return null; // Hata durumunda null döndür
    }
}

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
  async function listingFavorite(userID) {
    try {
        const response = await axios.post(
            'http://localhost:3001/api/v1/clean/admin/listingfavori',
            { userID: userID },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('API Response', response.data);
        return response.data.data;
    } catch (error) {
        console.error('Hata', error);
        throw error;
    }
}

    



  
  async function addToFavorite(filmID, userID) {
    const jwt = getJWTFromCookie();
    try {
        const response = await axios.post(
            'http://localhost:3001/api/v1/clean/admin/favoriekle',
            {
                filmID: filmID, 
                userID: userID,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwt}`, // JWT'yi header olarak gönder
                },
            }
        );
        if (response.status !== 200) {
            throw new Error('Favoriye eklenirken hata oluştu.');
        }

        return response.data;
    } catch (error) {
        console.error('API hatası:', error.message);
        console.error('Sunucu yanıtı:', error.response ? error.response.data : 'Yanıt alınamadı');
    
    }
}


  
  document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const authButtonText = document.getElementById('authButtonText');
  
    // JWT kontrol fonksiyonu
    function isLoggedIn() {
        const jwt = getJWTFromCookie();
        if (jwt) {
            const jwtData = parseJWT(jwt);
            console.log("jwtData", jwtData);
            const userID = jwtData.userID;
            console.log("parseJWT'DEN ALINAN", userID) // userID'yi al
  
            if (userID) {
                console.log("Kullanıcı ID:", userID);
                addToFavorite(filmID, userID); // Favorilere ekleme işlemi
            } else {
                console.error('User ID bulunamadı.');
            }
        } else {
            console.error('JWT bulunamadı.');
        }
        return jwt !== null; // Eğer token varsa giriş yapılmış demektir
    }
  
    // Auth butonunu güncelleme fonksiyonu
    function updateAuthButton() {
        if (isLoggedIn()) {
            authButtonText.textContent = 'Log Out'; // "Register" yerine "Log Out"
            authButton.setAttribute('href', '#'); // Logout için linki kaldır
            authButton.addEventListener('click', handleLogout); // Logout işlevini ekle
        } else {
            authButtonText.textContent = 'Register'; // "Log Out" yerine "Register"
            authButton.setAttribute('href', 'register.html'); // Register sayfasına yönlendir
            authButton.removeEventListener('click', handleLogout); // Logout işlevini kaldır
        }
    }
  
    // Logout işlemi
    function handleLogout(event) {
        event.preventDefault(); // Sayfa yenilemeyi engelle
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;'; // JWT'yi sil
        Swal.fire({
            icon: 'success',
            title: 'Çıkış Yapıldı',
            text: 'Başarıyla çıkış yaptınız.',
        }).then(() => {
            window.location.href = 'login.html'; // Giriş ekranına yönlendirme
        });
    }
  
    // Sayfa yüklendiğinde butonu güncelle
    updateAuthButton();
  });

  
  const createFilmCard = (film) => {
    const div = document.createElement('div');
    div.classList.add('col-xl-3', 'col-lg-4', 'col-md-6');
    div.innerHTML = `
    <div class="gen-carousel-movies-style-3 movie-grid style-3">
        <div class="gen-movie-contain">
            <div class="gen-movie-img">
                <!-- Statik img -->
                <img src="http://localhost:3001/images/${film.photo}" alt="${film.filmName}">
                <div class="gen-movie-add">
                    <div class="wpulike wpulike-heart">
                        <div class="wp_ulike_general_class">
                            <a href="#" class="sl-button text-white favorite-btn ${film.favorite ? "active" : ""}" data-id="${film._id}">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                                </svg>
                            </a>
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
                    <!-- Fancybox butonu -->
                    <a href="${film.filmURL}" 
                       data-fancybox 
                       data-src="${film.filmURL}" 
                       class="gen-button">
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
    `;
    console.log('films', film);
    return div;
};

Fancybox.bind("[data-fancybox]", {
    Toolbar: false,
    smallBtn: true,
    iframe: {
        preload: false,
        css: {
            width: "80%",
            height: "80%",
        },
    },
});

  function getUserIDFromJWT() {
    const token = getJWTFromCookie(); // Çerezden token'ı al
    if (!token) {
        console.error("Token bulunamadı.");
        return null; // Token yoksa null döndür
    }
    
    const userID = parseJWT(token); // Token'ı çözümleyip userID'yi al
    return userID; // userID'yi döndür
}
//   async function renderFilmCards() {
//     const filmContainer = document.getElementById('film-container');
//     try {
//         const userID = getUserIDFromJWT();

//         if (!userID) {
//             throw new Error('Kullanıcı kimliği bulunamadı. Lütfen giriş yapın.');
//         }
//         // API çağrısı
//         const films = await listingFilm(); // listingFilm() içindeki yanıtı alır
//         console.log("FİlmsApıSon", films);


//         const favorites = await listingFavorite(userID); // Favori filmleri alır
//         console.log("favoriteSsson:", favorites)
        
//         // Favori film ID'lerini bir Set'e ekle
//         const favoriteIDs = new Set(favorites.map((fav) => fav._id)); 

//         // Filmleri işleme
//         if (films.length > 0) {
//             films.forEach((film) => {
//                 // Film favori mi kontrol et
//                 const isFavorite = favoriteIDs.has(film._id);

//                 // Her film için kart oluştur
//                 const filmCard = createFilmCard(film, isFavorite);

//                 // Film kartlarını ekle
//                 filmContainer.appendChild(filmCard);
//             });
//         } else {
//             // Film bulunamadı mesajı
//             filmContainer.innerHTML = '<p style="text-align: center; color: red;">Film Bulunamadı.</p>';
//         }
//     } catch (error) {
//         // Hata mesajı
//         filmContainer.innerHTML = '<p style="text-align: center; color: red;">Bir hata oluştu. Lütfen tekrar deneyin.</p>';
//         console.error('Render Hatası:', error);
//     }
// }

async function renderFilmCards() {
    const filmContainer = document.getElementById('film-container');
    try {
        const userID = getUserIDFromJWT();

        if (!userID) {
            throw new Error('Kullanıcı kimliği bulunamadı. Lütfen giriş yapın.');
        }

        // API çağrıları
        const films = await listingFilm(); // listingFilm() içindeki yanıtı al
        console.log("FİlmsApiSon", films);

        const favorites = await listingFavorite(userID); // Favori filmleri al
        console.log("favoriteSsson:", favorites);

        // Favori film ID'lerini bir Set'e ekle
        const favoriteIDs = new Set(favorites.map((fav) => fav._id));

        // Filmleri işleme
        if (films.length > 0) {
            films.forEach((film) => {
                // Film favori mi kontrol et
                const isFavorite = favoriteIDs.has(film._id);

                // Her film için kart oluştur
                const filmCard = createFilmCard(film, isFavorite);

                // Film kartlarını ekle
                filmContainer.appendChild(filmCard);

                // Eğer film favoriyse, butona active sınıfı ekle
                const favoriteButton = filmCard.querySelector('.favorite-btn');
                if (favoriteButton && isFavorite) {
                    favoriteButton.classList.add('active'); // Butona active sınıfı ekle
                }
            });
        } else {
            // Film bulunamadı mesajı
            filmContainer.innerHTML = '<p style="text-align: center; color: red;">Film Bulunamadı.</p>';
        }
    } catch (error) {
        // Hata mesajı
        filmContainer.innerHTML = '<p style="text-align: center; color: red;">Bir hata oluştu. Lütfen tekrar deneyin.</p>';
        console.error('Render Hatası:', error);
    }
}

  

  
  document.addEventListener('DOMContentLoaded', () => {
    renderFilmCards(); // Sayfa yüklendiğinde çalışır
  });



  document.addEventListener('click', (event) => {
    if (event.target.closest('.favorite-btn')) {
        event.preventDefault();

        const button = event.target.closest('.favorite-btn');
        const filmID = button.getAttribute('data-id');
        console.log('Film ID:', filmID);

        // JWT'den token al ve çözümle
        const jwt = getJWTFromCookie();
        const jwtData = parseJWT(jwt);
        console.log("JWT Data:", jwtData);

        const userID = jwtData; // JWT'den userID al
        console.log("userID:", userID);

        if (userID) {
            // Film butonunun isActive durumunu kontrol et
            const isActive = button.classList.contains('active');

            if (isActive) {
                // Eğer film zaten favoriye eklenmişse, favoriden çıkar
                addToFavorite(filmID, userID); // Favoriden çıkarma işlemi
                button.classList.remove('active'); // Butonun stilini değiştir
                console.log('Favoriden çıkarıldı.');
            } else {
                // Eğer film favoriye eklenmemişse, favoriye ekle
                addToFavorite(filmID, userID); // Favoriye ekleme işlemi
                button.classList.add('active'); // Butonu aktif yap
                console.log('Favoriye eklendi.');
            }
        } else {
            console.error('Kullanıcı ID bulunamadı.');
            Swal.fire({
                icon: 'error',
                title: 'Hata',
                text: 'Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.',
            });
        }
    }
});


const displayFavoriteFilms = async () => {
    const token = getJWTFromCookie(); // Token'ı al
    const userID = parseJWT(token); // Token'dan userID'yi al

    if (!userID) {
        console.error("Kullanıcı kimliği bulunamadı!");
        return;
    }

    try {
        const favoriteFilms = await listingFavorite(userID); // Favori filmleri al
        const container = document.getElementById('film-cards-container');
        favoriteFilms.forEach(film => {
            const filmCard = createFilmCard(film);
            container.appendChild(filmCard);
        });
    } catch (error) {
        console.error('Error fetching favorite films:', error);
    }
};

  
//   document.addEventListener('click', (event) => {
//     if (event.target.closest('.favorite-btn')) {
//         event.preventDefault();

//         const button = event.target.closest('.favorite-btn');
//         const filmID = button.getAttribute('data-id');
//         console.log('Film ID:', filmID);

//         // JWT'den token al ve çözümle
//         const jwt = getJWTFromCookie();
//         const jwtData = parseJWT(jwt);
//         console.log("JWT Data:", jwtData); // JWT'nin çözümlemesini kontrol edin
        
//         const userID = jwtData; // JWT'den userID al
//         console.log("jwtDataUSERID", jwtData.userID)
//         console.log("userID: ", userID);

//         if (userID) {
//             // Film butonunun isActive durumunu kontrol et
//             const isActive = button.classList.contains('active');

//             if (isActive) {
//                 // Eğer film zaten favoriye eklenmişse, favoriden çıkar
//                 removeFavorite(filmID, userID);
//                 button.classList.remove('active'); // Butonun stilini değiştir
//                 console.log('Favoriden çıkarıldı.');
//             } else {
//                 // Eğer film favoriye eklenmemişse, favoriye ekle
//                 addToFavorite(filmID, userID);
//                 button.classList.add('active'); // Butonu aktif yap
//                 console.log('Favoriye eklendi.');
//             }
//         } else {
//             console.error('Kullanıcı ID bulunamadı.');
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Hata',
//                 text: 'Kullanıcı bilgileri bulunamadı. Lütfen tekrar giriş yapın.',
//             });
//         }
//     }
// });