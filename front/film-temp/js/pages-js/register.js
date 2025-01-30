

// Axios'un dahil edilmesi gerekiyor

async function registerUser(Register) {
    try {
        const response = await axios.post(
            'http://localhost:3001/api/v1/clean/admin/newregister',
            Register,
            {
                headers: {
                    'Content-Type': 'application/json',
                    
                }
            }
        );
        console.log(response.data); // Başarılı yanıtı logla
        return response.data;
    } catch (error) {
        console.error('Kullanıcı ekleme hatası:', error);
        throw error; // Hataları yakala ve logla
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('pms_user_login');
    const userMailInput = document.getElementById('pms_user_email');
    const userFirstnameInput = document.getElementById('pms_first_name');
    const userSurnameInput = document.getElementById('pms_last_name');
    const userPasswordInput = document.getElementById('pms_pass1');
    const userPasswordInputTwo = document.getElementById('pms_pass2');
    const RegisterBtn = document.getElementById('pms_register');

    // userPasswordInput.addEventListener('input', () => {
    //     const password = userPasswordInput.value;

    //     if(password.length < 4) {
    //         RegisterBtn.disabled = true;
    //         alert("Şifre en az 4 karakter olmalı");
    //     } else {
    //         RegisterBtn.disabled = false;
    //     }
    // });

    // Kayıt işlemi başlatma
    RegisterBtn.addEventListener('click', async () => {
        const userName = userNameInput.value;
        const userMail = userMailInput.value;
        const userFirstName = userFirstnameInput.value;
        const userSurname = userSurnameInput.value;
        const userPassword = userPasswordInput.value;
        const userPasswordTwo = userPasswordInputTwo.value;

        if (userPassword !== userPasswordTwo) {
            Swal.fire({
                icon: 'error',
                title: 'Şifreler uyuşmuyor!',
                text: 'Lütfen şifreyi doğru girin.',
            });
            return; // Şifreler eşleşmiyorsa işlem yapılmasın
        }

        const register = { userName, userMail, userFirstName, userSurname, userPassword }; // şuanlık 2.sifreyi almadım

        try {
            const response = await registerUser(register);
            console.log('Kayıt Başarılı', response);

            // Kayıt başarılıysa success mesajı göster ve sayfayı yenile
           // Kayıt başarılıysa success mesajı göster ve sayfayı yenile
            Swal.fire({
                icon: 'success',
                title: 'Kayıt Başarılı',
                text: 'Kayıt işlemi başarıyla tamamlandı.',
            }).then(() => {
                //window.location.reload(); // Sayfa yenilenir, form sıfırlanır
            });

        } catch (error) {
            console.error('Kayıt hatası:', error);

            // Kayıt hatasında error mesajı göster
            Swal.fire({
                icon: 'error',
                title: 'Kayıt başarısız!',
                text: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            });
        }
    });
});









