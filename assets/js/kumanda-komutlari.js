
//bu kodlar yz ve ben tarafından özenle yapıldı. Ağ trafiği ve console incelenerek en az ağ ve hata ile yapıldı.
var config_ip = "192.168.1.76";

//ip çerezi kontrol, kayıt, güncelle, sil işlemleri başlangıç (ip sabit ve değişmeyecekse bu tüm bloğu silip yerine var config_ip = "192.168.1.9"; yazabilirsin.)
   
var config_ip;


//bu blok kod satırının başında olmalı çünkü başka fonksiyonlara erişiyor.
//tüm verileri güncelle butonu fonksiyonu başlangıç çalışmıyor düzelt
function verileriGuncelle() {
    try {
        // Tüm verileri güncelleme işlemleri burada yapılır
        TvAktifKaynakBilgisiGuncelle();
        TvBilgisiniGuncelle();
        sesBilgisiniGuncelle();
        acilirMenuKaynaklarListesiniGuncelle();
        aktifKaynakGuncelle();
        //aktifKanalGuncelle(); // Eğer kanalları güncellemeniz gerekiyorsa
        //acilirMenuFavoriKanallarListesiniGuncelle(); // Eğer favori kanalları güncellemeniz gerekiyorsa
        console.log("Veriler başarıyla güncellendi.");
    } catch (error) {
        console.error("Veri güncelleme hatası:", error);
    }
    alert("✓");
}
//tüm verileri güncelle butonu fonksiyonu bitiş




// Çerez kontrol fonksiyonu
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
// Çerez kontrolü
var savedIp = getCookie('IP-address');
if (!savedIp) {
    // Çerez bulunamadı, uyarı kutusu göster
    //alert("TV'ye bağlanılamadı! Sağ alttaki çarka basarak tv ip adresini yazın.");
} else {
    // Çerez bulundu, IP adresini al
    config_ip = savedIp;
    document.addEventListener("DOMContentLoaded", function() { //bunun içine aldım çünkü js htmlden önce yüklenince inputu bulamıyor.
        document.getElementById("ipaddress_txt").value = config_ip;
    });
    console.log("IP Adresi Çerezden Alındı: " + config_ip);
}



function showcookie() {
    console.log(getCookie('IP-address'))
}


function saveSettings() {
    setCookie('IP-address', $("#ipaddress_txt").val(), 90);
    config_ip=$("#ipaddress_txt").val();
    $('#btn_clear').show()
    TvAktifKaynakBilgisiGuncelle();
    TvBilgisiniGuncelle();
    sesBilgisiniGuncelle();
    acilirMenuKaynaklarListesiniGuncelle();
    aktifKaynakGuncelle();

}

function clearSettings(){
    deleteCookie('IP-address');
    $("#ipaddress_txt").val('') 
    $('#btn_clear').hide()
}

function setCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function deleteCookie(name) {
    setCookie(name,"",-1);
}


//ip çerezi kontrol, kayıt, güncelle, sil işlemleri bitiş














function sendKeyEvent(key) {
    console.log("Sending : " + key);
    $.ajax({
        url: 'http://' + config_ip + ':1925/1/input/key',
        data: JSON.stringify({ "key": key }),
        //dataType: 'json', normalde bu satır var ama ses güncellemesinin çalışması için kadırdım.
        type: 'POST',
        success: function () {
            // Ses güncellemesi için ses tuşlarını dinler ve ses verileini güncelleme fonksiyonunu çalıştırır.
            if (key == 'VolumeUp' || key == 'VolumeDown' || key == 'Mute') {
                // Ses bilgisini güncellemek için AJAX isteği yap
                sesBilgisiniGuncelle();
                console.log("Ses durum verisi güncellendi.");
            }
        },
        error: function (xhr, status, error) {
            console.error("AJAX hatası:", status, error);
        }
    });
}

//Ses verileri çekme ve güncelleme başlangıç
// AJAX isteği yap ve ses bilgisini güncelle
function sesBilgisiniGuncelle() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + config_ip + ':1925/1/audio/volume', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // JSON yanıtını ayrıştır
            var sesBilgisi = JSON.parse(xhr.responseText);
            // Ses bilgisini HTML içeriği ile güncelle
            sesHtmlGuncelle(sesBilgisi);
        }
    };
    xhr.send();
}
// HTML içeriğini ses bilgisi ile güncelle
function sesHtmlGuncelle(sesBilgisi) {

    // Mevcut Ses için div
    var mevcutSesDiv = document.getElementById('mevcutSesDiv');
    mevcutSesDiv.innerHTML = 'SES ' + sesBilgisi.current;

    /*
    // Sessiz durumu için div
    var sesDurumuDiv = document.getElementById('sesDurumuDiv');
    sesDurumuDiv.innerHTML = (sesBilgisi.muted ? 'Kapalı' : 'Açık');

    // Min Ses için div
    var minSesDiv = document.getElementById('minSesDiv');
    minSesDiv.innerHTML = '<p>Min Ses: ' + sesBilgisi.min + '</p>';

    // Maks Ses için div
    var maksSesDiv = document.getElementById('maksSesDiv');
    maksSesDiv.innerHTML = '<p>Maks Ses: ' + sesBilgisi.max + '</p>';
    */
}
// Başlangıçta ses bilgisini al ve görüntüle
sesBilgisiniGuncelle();
//Ses verileri çekme ve güncelleme bitiş











//Tv verileri çekme ve güncelleme başlangıç
// AJAX isteği yap ve Tv bilgisini güncelle
function TvBilgisiniGuncelle() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + config_ip + ':1925/1/system', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // JSON yanıtını ayrıştır
            var TvBilgisi = JSON.parse(xhr.responseText);
            // Tv bilgisini HTML içeriği ile güncelle
            TvBilgisiHtmlGuncelle(TvBilgisi);
        }
    };
    xhr.send();
}
// HTML içeriğini Tv bilgisi ile güncelle
function TvBilgisiHtmlGuncelle(TvBilgisi) {

    // Tv Menü Dili
    var TvMenuDiliDiv = document.getElementById('TvMenuDiliDiv');
    TvMenuDiliDiv.innerHTML = TvBilgisi.menulanguage;

    // Tv Adı (Anasayfa için)
    var TvAdiAnasayfaDiv = document.getElementById('TvAdiAnasayfaDiv');
    TvAdiAnasayfaDiv.innerHTML = 'BAĞLANDI: '+TvBilgisi.name;

    // Tv Adı (Ayarlar sayfası için)
    var TvAdiDiv = document.getElementById('TvAdiDiv');
    TvAdiDiv.innerHTML = TvBilgisi.name;

    // Tv Ülke Ayarı
    var TvUlkeAyariDiv = document.getElementById('TvUlkeAyariDiv');
    TvUlkeAyariDiv.innerHTML = TvBilgisi.country;

    // Tv Seri Numarası
    var TvSeriNumarasiDiv = document.getElementById('TvSeriNumarasiDiv');
    TvSeriNumarasiDiv.innerHTML = TvBilgisi.serialnumber;

    // Tv Yazılım Versiyonu
    var TvYazilimVersiyonuDiv = document.getElementById('TvYazilimVersiyonuDiv');
    TvYazilimVersiyonuDiv.innerHTML = TvBilgisi.softwareversion;

    // Tv Modeli
    var TvModeliDiv = document.getElementById('TvModeliDiv');
    TvModeliDiv.innerHTML = TvBilgisi.model;

}
// Başlangıçta Tv bilgisini al ve görüntüle
TvBilgisiniGuncelle();
//Tv verileri çekme ve güncelleme bitiş




//Tv aktif kaynak verileri çekme ve güncelleme başlangıç
// AJAX isteği yap ve Tv aktif kaynak bilgisini güncelle
function TvAktifKaynakBilgisiGuncelle() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://' + config_ip + ':1925/1/sources/current', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // JSON yanıtını ayrıştır
            var TvAktifKaynakBilgisi = JSON.parse(xhr.responseText);
            // Tv aktif kaynak bilgisini HTML içeriği ile güncelle
            TvAktifKaynakBilgisiHtmlGuncelle(TvAktifKaynakBilgisi);
        }
    };
    xhr.send();
}
// HTML içeriğini Tv bilgisi ile güncelle
function TvAktifKaynakBilgisiHtmlGuncelle(TvAktifKaynakBilgisi) {

    // Tv Menü Dili
    var TvAktifKaynakBilgisiDiv = document.getElementById('TvAktifKaynakBilgisiDiv');
    TvAktifKaynakBilgisiDiv.innerHTML = TvAktifKaynakBilgisi.id;


}
// Başlangıçta Tv aktif kaynak bilgisini al ve görüntüle
TvAktifKaynakBilgisiGuncelle();
//Tv aktif kaynak verileri çekme ve güncelleme bitiş















//açılır menü kaynak seçimi başlangıç
document.addEventListener("DOMContentLoaded", function () {
    // Fonksiyon: Mevcut kaynağı güncellemek için
    function aktifKaynakGuncelle() {
        $.ajax({
            type: "GET",
            url: "http://" + config_ip + ":1925/1/sources/current",
            dataType: "json",
            success: function (data) {
                $("#tv_sources").val(data.id);
            },
            error: function (error) {
                console.error("Mevcut kaynak güncellenirken hata:", error);
            },
        });
    }

    // Fonksiyon: Kaynakları dropdown'a eklemek için
    function acilirMenuKaynaklarListesiniGuncelle() {
        $.ajax({
            type: "GET",
            url: "http://" + config_ip + ":1925/1/sources",
            dataType: "json",
            success: function (data) {
                var sel = $("#tv_sources");
                sel.empty();
                $.each(data, function (key, value) {
                    sel.append('<option value="' + key + '">' + value.name + '</option>');
                });

                // Mevcut kaynağı seçili olanla eşleştir
                aktifKaynakGuncelle();
            },
            error: function (error) {
                console.error("Kaynaklar alınırken hata:", error);
            },
        });
    }

    // Sayfa yüklendiğinde ilk güncelleme
    acilirMenuKaynaklarListesiniGuncelle();

    // Kaynak değişikliği için olay dinleyici
    $('#tv_sources').change(function () {
        var selectedSourceId = $(this).val();
        console.log(selectedSourceId);

        // Mevcut kaynağı POST isteğiyle değiştir
        $.ajax({
            url: 'http://' + config_ip + ':1925/1/sources/current',
            data: JSON.stringify({ "id": selectedSourceId }),
            dataType: 'json',
            type: 'POST',
            success: function () {
                // Başarılı güncelleme sonrasında mevcut kaynağı tekrar güncelle
                aktifKaynakGuncelle();
            },
            //Hata kontolü yapma çünkü cevap json yerine html dönüyor. İşlem başarılı olsada hata dönüyor ve program düzgün çalışmıyor.
        });
    });
});

//açılır menü kaynak seçimi bitiş




















/*
//açılır menü kanal seçimi başlangıç
document.addEventListener("DOMContentLoaded", function () {
    // Fonksiyon: Mevcut kaynağı güncellemek için
    function aktifKanalGuncelle() {
        $.ajax({
            type: "GET",
            url: "http://" + config_ip + ":1925/1/channels/current",
            dataType: "json",
            success: function (data) {
                $("#tv_kanallar").val(data.id);
            },
            error: function (error) {
                console.error("Mevcut kaynak güncellenirken hata:", error);
            },
        });
    }

// Fonksiyon: Kaynakları dropdown'a eklemek için
function kanalListesiniGuncelle() {
    $.ajax({
        type: "GET",
        url: "http://" + config_ip + ":1925/1/channels",
        dataType: "json",
        success: function (data) {
            var sel = $("#tv_kanallar");
            sel.empty();

            // Sıralı sayıları başlat
            var count = 1;

            $.each(data, function (key, value) {
                sel.append('<option value="' + key + '">' + count + '. ' + value.preset + ' - ' + value.name + '</option>');
                count++;
            });

            // Mevcut kaynağı seçili olanla eşleştir
            aktifKanalGuncelle();
        },
        error: function (error) {
            console.error("Kaynaklar alınırken hata:", error);
        },
    });
}


    // Sayfa yüklendiğinde ilk güncelleme
    kanalListesiniGuncelle();

    // Kaynak değişikliği için olay dinleyici
    $('#tv_kanallar').change(function () {
        var selectedSourceId = $(this).val();
        console.log(selectedSourceId);

        // Mevcut kaynağı POST isteğiyle değiştir
        $.ajax({
            url: 'http://' + config_ip + ':1925/1/channels/current',
            data: JSON.stringify({ "id": selectedSourceId }),
            dataType: 'json',
            type: 'POST',
            success: function () {
                // Başarılı güncelleme sonrasında mevcut kaynağı tekrar güncelle
                aktifKanalGuncelle();
            },
            error: function (error) {
                console.error("Mevcut kaynak güncellenirken hata:", error);
            },
        });
    });
});

//açılır menü kanal seçimi bitiş
*/

























/*
//açılır kanal favori listeleri seçimi başlangıç
document.addEventListener("DOMContentLoaded", function () {
    // Fonksiyon: Mevcut kaynağı güncellemek için

    // Fonksiyon: Kaynakları dropdown'a eklemek için
    function acilirMenuFavoriKanallarListesiniGuncelle() {
        $.ajax({
            type: "GET",
            url: "http://" + config_ip + ":1925/1/channellists",
            dataType: "json",
            success: function (data) {
                var sel = $("#tv_fav_list");
                sel.empty();
                $.each(data, function (key, value) {
                    sel.append('<option value="' + key + '">' + value.name + '</option>');
                });

   
            },
            error: function (error) {
                console.error("Kaynaklar alınırken hata:", error);
            },
        });
    }

    // Sayfa yüklendiğinde ilk güncelleme
    acilirMenuFavoriKanallarListesiniGuncelle();

    // Kaynak değişikliği için olay dinleyici
    $('#tv_fav_list').change(function () {
        var selectedSourceId = $(this).val();
        console.log(selectedSourceId);

        // Mevcut kaynağı POST isteğiyle değiştir
        $.ajax({
            url: 'http://' + config_ip + ':1925/1/channellists',
            data: JSON.stringify({ "id": selectedSourceId }),
            dataType: 'json',
            type: 'POST',
            success: function () {
                // Başarılı güncelleme sonrasında mevcut kaynağı tekrar güncelle
                aktifKaynakGuncelle();
            },
            error: function (error) {
                console.error("Mevcut kaynak güncellenirken hata:", error);
            },
        });
    });
});

//açılır kanal favori listeleri seçimi bitiş
*/





































