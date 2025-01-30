


function getJWTFromCookie() {
    const name = 'token=';
    const cookieArray = document.cookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim(); // trim ile baştaki ve sondaki boşlukları temizleyin
        if (cookie.indexOf(name) === 0) {
            return decodeURIComponent(cookie.substring(name.length, cookie.length)); // Değerini decode edin
        }
    }
    return null;
}

// JWT'yi almak
const jwt = getJWTFromCookie();
console.log("JWT Token:", jwt);

// Login fonksiyonu
async function loginUser(user) {
    try {
        const response = await axios.post(
            'http://localhost:3001/api/v1/clean/admin/loginuser',
            user,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const token = response.data.token; // API'den gelen token'ı alın
        // Token'ı cookie'ye kaydedin
        document.cookie = `token=${token}; path=/; Secure; SameSite=Strict`;
        console.log("JWT Token Set:", document.cookie);

        return response;  // Yanıtı döndürüyoruz ki giriş işlemi sırasında yanıtı kontrol edebilelim

    } catch (error) {
        console.error("Login Error:", error);
        throw new Error('Giriş işlemi sırasında bir hata oluştu'); // Hata fırlatıyoruz ki çağıran fonksiyon bunu yakalasın
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginBtnID = document.getElementById('loginBtnID');  // Giriş butonu
    console.log(loginBtnID)
    
    const userNameInput = document.getElementById('loginInputID');  // Giriş yapacak kullanıcı adı inputu
    const userPasswordInput = document.getElementById('loginPasswordID');  // Giriş yapacak şifre inputu
    // Giriş işlemi başlatma
    loginBtnID.addEventListener('click', async () => {
        console.log("123123123123")

        const userName = userNameInput.value;  // Kullanıcı mail (veya kullanıcı adı) alınıyor
        const userPassword = userPasswordInput.value;  // Kullanıcı şifresi alınıyor


        // Eğer şifre veya mail boşsa, kullanıcıyı uyar
        if (!userName || !userPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Eksik Bilgi',
                text: 'Lütfen tüm alanları doldurun.',
            });
            return;
        }

        const loginData = { userName, userPassword };  // Giriş verisi oluşturuluyor

        try {
            // Giriş işlemi yapılacak fonksiyonu çağırıyoruz
            const response = await loginUser(loginData);  // loginUser fonksiyonu ile giriş yapılır
            console.log('Giriş Başarılı', response);

            // Giriş başarılıysa success mesajı göster
            Swal.fire({
                icon: 'success',
                title: 'Giriş Başarılı',
                text: 'Başarıyla giriş yaptınız.',
            }).then(() => {
                // Giriş başarılı olduktan sonra başka bir sayfaya yönlendirebilirsiniz
                window.location.href = 'http://127.0.0.1:5502/front/film-temp/pages/main.html#'; // Örneğin, bir kontrol paneline yönlendirme
            });

        } catch (error) {
            console.error('Giriş hatası:', error);

            // Giriş hatasında error mesajı göster
            Swal.fire({
                icon: 'error',
                title: 'Giriş Başarısız!',
                text: 'Geçersiz mail veya şifre.',
            });
        }
    });
});
