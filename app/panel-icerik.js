// HSN Otomotiv – Servis paneli "Site içeriği" sekmesi: duyuru bandı, iletişim, hakkımızda, hizmetler, galeri, duyurular.
// Kaydedilen her şey Supabase site_content tablosuna yazılır; sitede app/icerik.js ile anında görünür.
(function () {
  "use strict";
  var H = window.HSN, api = H.api, e = H.esc, V = window.HSN_VARSAYILAN || { about: { body: [] }, services: {}, shots: [] };
  var I = {}, kok = null, acik = "duyuru";

  var kart = function (id, baslik, alt, ic) {
    return '<details class="app-card ic-kart" data-k="' + id + '"' + (acik === id ? " open" : "") + '><summary><b>' + baslik + '</b><small class="app-mute"> · ' + alt + '</small></summary><div class="ic-ic">' + ic + "</div></details>";
  };
  var durum = function (el, msg, hata) { var p = el.querySelector(".ic-durum"); if (p) { p.textContent = msg; p.style.color = hata ? "#c8102e" : "#2e7d32"; } };
  var kaydetBtn = '<div class="ic-alt"><button class="btn btn-primary">Kaydet</button><span class="ic-durum"></span></div>';

  function duyuruKart() {
    var d = I.duyuru || {};
    return kart("duyuru", "Duyuru bandı", "sitenin en üstünde kırmızı şerit",
      '<form class="app-form" data-f="duyuru"><label class="chk"><input type="checkbox" name="aktif"' + (d.aktif ? " checked" : "") + '> Bandı göster</label>' +
      '<label>Metin<input name="metin" maxlength="160" placeholder="Örn: Kış bakım kampanyası: antifriz + akü kontrolü ücretsiz!" value="' + e(d.metin) + '"></label>' +
      '<label>Bağlantı (isteğe bağlı)<input name="link" placeholder="randevu.html" value="' + e(d.link) + '"></label>' +
      '<label>Bağlantı yazısı<input name="linkMetin" placeholder="Randevu al" value="' + e(d.linkMetin) + '"></label>' +
      '<label>Renk<input name="renk" type="color" value="' + e(d.renk || "#c8102e") + '"></label>' + kaydetBtn + "</form>");
  }
  function iletisimKart() {
    var d = I.iletisim || {};
    return kart("iletisim", "İletişim ve çalışma saatleri", "tüm sayfalarda",
      '<form class="app-form grid2" data-f="iletisim">' +
      '<label>Telefon (görünen)<input name="tel_txt" value="' + e(d.tel_txt || V.tel_txt) + '"></label>' +
      '<label>Çalışma saatleri<input name="saat" value="' + e(d.saat || V.saat) + '"></label>' +
      '<label class="span2">Adres (tek satır)<input name="adres" value="' + e(d.adres || V.adres) + '"></label>' +
      '<label>Adres 1. satır<input name="adres_1" value="' + e(d.adres_1 || V.adres_1) + '"></label>' +
      '<label>Adres 2. satır<input name="adres_2" value="' + e(d.adres_2 || V.adres_2) + '"></label>' +
      '<div class="span2">' + kaydetBtn + "</div></form>");
  }
  function hakkimizdaKart() {
    var d = I.hakkimizda || {}, body = d.body || V.about.body;
    return kart("hakkimizda", "Hakkımızda", "ana sayfa ve hakkımızda bölümü",
      '<form class="app-form" data-f="hakkimizda"><label>Başlık<input name="title" value="' + e(d.title || V.about.title) + '"></label>' +
      '<label>Giriş paragrafı<textarea name="lead" rows="4">' + e(d.lead || V.about.lead) + "</textarea></label>" +
      body.map(function (p, i) { return '<label>Paragraf ' + (i + 2) + '<textarea name="body' + i + '" rows="4">' + e(p) + "</textarea></label>"; }).join("") + kaydetBtn + "</form>");
  }
  function hizmetKart() {
    var d = I.hizmetler || {};
    return kart("hizmetler", "Hizmetler", Object.keys(V.services).length + " hizmet: açıklama ve fotoğraf",
      '<form class="app-form" data-f="hizmetler">' + Object.keys(V.services).map(function (id) {
        var s = V.services[id], y = d[id] || {}, img = y.img || "img/" + s[2];
        return '<div class="ic-hz"><img src="' + e(img) + '" alt=""><div><b>' + e(s[0]) + '</b><textarea name="d_' + id + '" rows="2">' + e(y.desc || s[1]) + '</textarea>' +
          '<label class="ic-dosya">Fotoğrafı değiştir<input type="file" accept="image/*" data-hz="' + id + '"></label><input type="hidden" name="i_' + id + '" value="' + e(y.img || "") + '"></div></div>';
      }).join("") + kaydetBtn + "</form>");
  }
  function galeriKart() {
    var g = I.galeri || {}, gizli = g.gizli || [], ekler = g.ekler || [];
    return kart("galeri", "Galeri", ekler.length + " yeni fotoğraf · " + gizli.length + " gizli",
      '<div data-f="galeri"><label class="btn btn-outline ic-dosya">+ Fotoğraf ekle<input type="file" accept="image/*" multiple data-gal="ekle"></label>' +
      '<p class="app-mute">Fotoğrafın üstüne tıklayınca gizlenir / yeniden gösterilir. Yeni eklenenler en başta görünür.</p><div class="ic-gal">' +
      ekler.map(function (x, i) { return '<figure class="ic-yeni"><img src="' + e(x.url) + '"><input data-ac="' + i + '" placeholder="Açıklama" value="' + e(x.aciklama) + '"><button type="button" class="linkbtn" data-sil="' + i + '">Sil</button></figure>'; }).join("") +
      V.shots.map(function (s) { var gz = gizli.indexOf(s[0]) >= 0; return '<figure data-giz="' + e(s[0]) + '" class="' + (gz ? "gz" : "") + '"><img src="img/' + e(s[0]) + '"><figcaption>' + e(s[1]) + (gz ? " · gizli" : "") + "</figcaption></figure>"; }).join("") +
      "</div>" + kaydetBtn + "</div>");
  }
  function duyurularKart() {
    var ds = I.duyurular || [];
    return kart("duyurular", "Duyurular ve kampanyalar", ds.length + " kayıt · ana sayfada",
      '<div data-f="duyurular">' + ds.map(function (x, i) {
        return '<div class="ic-du"><b>' + e(x.baslik) + '</b> <small class="app-mute">' + e(x.tarih) + '</small><p>' + e(x.metin) + '</p><button type="button" class="linkbtn" data-dsil="' + i + '">Kaldır</button></div>';
      }).join("") +
      '<form class="app-form" data-f="duyuru-ekle"><label>Başlık<input name="baslik" required maxlength="80" placeholder="Örn: Ekim ayı fren bakım kampanyası"></label>' +
      '<label>Metin<textarea name="metin" rows="3" maxlength="600"></textarea></label>' +
      '<label class="ic-dosya">Fotoğraf (isteğe bağlı)<input type="file" accept="image/*" name="img"></label>' +
      '<div class="ic-alt"><button class="btn btn-primary">Duyuru ekle</button><span class="ic-durum"></span></div></form></div>');
  }

  function ciz() {
    kok.innerHTML = '<style>.ic-kart summary{cursor:pointer;padding:4px 0}.ic-ic{margin-top:14px}.ic-alt{display:flex;gap:12px;align-items:center;margin-top:8px}.ic-durum{font-size:14px}' +
      '.ic-hz{display:flex;gap:12px;align-items:flex-start;border-top:1px solid #eee;padding:10px 0}.ic-hz img{width:96px;height:64px;object-fit:cover;border-radius:4px}.ic-hz>div{flex:1;display:grid;gap:6px}' +
      '.ic-dosya input{display:block;margin-top:4px}.ic-gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin:10px 0}.ic-gal figure{margin:0;cursor:pointer}.ic-gal img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:4px}' +
      '.ic-gal figure.gz img{opacity:.25}.ic-gal figcaption{font-size:12px}.ic-yeni{outline:2px solid #2e7d32;outline-offset:2px;cursor:default!important}.ic-yeni input{width:100%;font-size:12px}.ic-du{border-top:1px solid #eee;padding:8px 0}.chk{display:flex;gap:8px;align-items:center}</style>' +
      '<p class="app-mute">Burada yaptığınız değişiklikler kaydettiğiniz anda sitede görünür. Sitede görmek için sayfayı yenileyin.</p>' +
      duyuruKart() + iletisimKart() + hakkimizdaKart() + hizmetKart() + galeriKart() + duyurularKart();
    kok.querySelectorAll("details").forEach(function (d) { d.addEventListener("toggle", function () { if (d.open) acik = d.dataset.k; }); });
    bagla();
  }

  function kaydet(key, value, el) {
    var b = el.querySelector(".btn-primary"); if (b) b.disabled = true;
    durum(el, "Kaydediliyor…");
    return api.saveContent(key, value).then(function () { I[key] = value; durum(el, "Kaydedildi ✓"); if (b) b.disabled = false; })
      .catch(function (x) { durum(el, "Kaydedilemedi: " + x.message, true); if (b) b.disabled = false; throw x; });
  }
  var formObj = function (f) { var o = {}; new FormData(f).forEach(function (v, k) { if (typeof v === "string") o[k] = v.trim(); }); return o; };

  function bagla() {
    var f1 = kok.querySelector('[data-f="duyuru"]'), f2 = kok.querySelector('[data-f="iletisim"]'), f3 = kok.querySelector('[data-f="hakkimizda"]'), hf = kok.querySelector('[data-f="hizmetler"]');
    if (f1) f1.onsubmit = function (ev) { ev.preventDefault(); var o = formObj(f1); o.aktif = f1.aktif.checked; kaydet("duyuru", o, f1); };
    if (f2) f2.onsubmit = function (ev) { ev.preventDefault(); kaydet("iletisim", formObj(f2), f2); };
    if (f3) f3.onsubmit = function (ev) {
      ev.preventDefault(); var o = formObj(f3), body = []; Object.keys(o).filter(function (k) { return /^body\d+$/.test(k); }).sort().forEach(function (k) { body.push(o[k]); });
      kaydet("hakkimizda", { title: o.title, lead: o.lead, body: body }, f3);
    };
    if (hf) {
      hf.querySelectorAll("[data-hz]").forEach(function (inp) {
        inp.onchange = function () {
          var id = inp.dataset.hz, file = inp.files[0]; if (!file) return;
          durum(hf, "Fotoğraf yükleniyor…");
          api.uploadImage(file).then(function (url) { hf.querySelector('[name="i_' + id + '"]').value = url; inp.closest(".ic-hz").querySelector("img").src = url; durum(hf, "Fotoğraf yüklendi, kaydetmeyi unutmayın"); })
            .catch(function (x) { durum(hf, "Yüklenemedi: " + x.message, true); });
        };
      });
      hf.onsubmit = function (ev) {
        ev.preventDefault(); var o = formObj(hf), d = {};
        Object.keys(V.services).forEach(function (id) { var x = {}; if (o["d_" + id] && o["d_" + id] !== V.services[id][1]) x.desc = o["d_" + id]; if (o["i_" + id]) x.img = o["i_" + id]; if (x.desc || x.img) d[id] = x; });
        kaydet("hizmetler", d, hf);
      };
    }
    var gk = kok.querySelector('[data-f="galeri"]');
    if (gk) {
      var g = JSON.parse(JSON.stringify(I.galeri || { gizli: [], ekler: [] })); g.gizli = g.gizli || []; g.ekler = g.ekler || [];
      var gkaydet = function () { return kaydet("galeri", g, gk).then(ciz); };
      gk.querySelector('[data-gal="ekle"]').onchange = function () {
        var files = [].slice.call(this.files); if (!files.length) return;
        durum(gk, files.length + " fotoğraf yükleniyor…");
        files.reduce(function (p, file) { return p.then(function () { return api.uploadImage(file).then(function (url) { g.ekler.unshift({ url: url, aciklama: "" }); }); }); }, Promise.resolve())
          .then(gkaydet).catch(function (x) { durum(gk, "Yüklenemedi: " + x.message, true); });
      };
      gk.querySelectorAll("[data-giz]").forEach(function (fig) { fig.onclick = function () { var n = fig.dataset.giz, i = g.gizli.indexOf(n); i >= 0 ? g.gizli.splice(i, 1) : g.gizli.push(n); gkaydet(); }; });
      gk.querySelectorAll("[data-sil]").forEach(function (b) { b.onclick = function () { if (confirm("Bu fotoğraf galeriden kaldırılsın mı?")) { g.ekler.splice(+b.dataset.sil, 1); gkaydet(); } }; });
      gk.querySelectorAll("[data-ac]").forEach(function (inp) { inp.onchange = function () { g.ekler[+inp.dataset.ac].aciklama = inp.value.trim(); kaydet("galeri", g, gk); }; });
      gk.querySelector(".btn-primary").onclick = function () { kaydet("galeri", g, gk); };
    }
    var dk = kok.querySelector('[data-f="duyurular"]');
    if (dk) {
      var ds = (I.duyurular || []).slice();
      dk.querySelectorAll("[data-dsil]").forEach(function (b) { b.onclick = function () { if (confirm("Duyuru kaldırılsın mı?")) { ds.splice(+b.dataset.dsil, 1); kaydet("duyurular", ds, dk).then(ciz); } }; });
      var df = dk.querySelector('[data-f="duyuru-ekle"]');
      df.onsubmit = function (ev) {
        ev.preventDefault(); var o = formObj(df), file = df.img.files[0];
        (file ? api.uploadImage(file) : Promise.resolve("")).then(function (url) {
          ds.unshift({ baslik: o.baslik, metin: o.metin, img: url, tarih: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) });
          return kaydet("duyurular", ds, df);
        }).then(ciz).catch(function (x) { durum(df, "Eklenemedi: " + x.message, true); });
      };
    }
  }

  window.HSNIcerik = {
    goster: function (el) {
      kok = el; kok.innerHTML = '<div class="app-card"><p class="app-mute">İçerik yükleniyor…</p></div>';
      api.getContent().then(function (x) { I = x || {}; ciz(); }).catch(function (x) { kok.innerHTML = '<div class="app-card"><p class="app-err">İçerik okunamadı: ' + e(x.message) + "</p></div>"; });
    }
  };
})();
