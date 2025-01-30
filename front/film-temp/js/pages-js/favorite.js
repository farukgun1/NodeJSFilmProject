// getJWTFromCookie fonksiyonu: Çerezden token al
function getJWTFromCookie() {
    const name = 'token=';
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
        const trimmedCookie = cookie.trim();
        if (trimmedCookie.startsWith(name)) {
            return decodeURIComponent(trimmedCookie.substring(name.length));
        }
    }
    return null;
}

// parseJWT fonksiyonu: JWT token'ını çözümleyip userID'yi al
function parseJWT(token) {
    if (!token) {
        console.error("Geçersiz token:", token);
        return null;
    }

    try {
        const payload = token.split('.')[1];
        if (!payload) {
            console.error("JWT payload kısmı bulunamadı.");
            return null;
        }

        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = atob(base64);
        const parsedPayload = JSON.parse(decodedPayload);
        console.log("decoded payload: ", decodedPayload);
        console.log("Çözümlenen Payload:", parsedPayload);

        const userID = parsedPayload.userId || parsedPayload.userID;

        if (!userID) {
            console.error("Payload içinde 'userId' bulunamadı.");
            return null;
        }

        return userID;
    } catch (error) {
        console.error('JWT çözümleme hatası:', error);
        return null;
    }
}

// listingFavorite fonksiyonu: API'den favori filmleri alırken userID'yi parametre olarak geç
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




// createFilmCard fonksiyonu: Film kartı oluştur
const createFilmCard = (film) => {
    const div = document.createElement('div');
    div.classList.add('col-xl-3', 'col-lg-4', 'col-md-6');
    div.innerHTML = `
    <div class="gen-carousel-movies-style-3 movie-grid style-3">
        <div class="gen-movie-contain">
            <div class="gen-movie-img">
                <img src="http://localhost:3001/images/${film.photo}" alt="${film.filmName}">
                <div class="gen-movie-add">
                    <div class="wpulike wpulike-heart">
                        <div class="wp_ulike_general_class">
                            <a href="#" class="sl-button text-white favorite-btn" data-id="${film._id}"><i class="far fa-heart"></i></a>
                        </div>
                    </div>
                 
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
    `;
    return div;
};

// displayFavoriteFilms fonksiyonu: Favori filmleri göster
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

// Sayfa yüklendiğinde favori filmleri göster
document.addEventListener('DOMContentLoaded', displayFavoriteFilms);
