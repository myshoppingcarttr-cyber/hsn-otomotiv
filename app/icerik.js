// HSN Otomotiv – canlı site içeriği: yönetim panelinde ("Site içeriği") yapılan değişiklikleri sayfaya uygular.
// Sayfanın kendisi statik (SEO için varsayılan metinler HTML'de); bu betik Supabase'deki site_content tablosunu okur,
// varsayılan metni (window.HSN_VARSAYILAN) yeni metinle değiştirir, duyuru bandı / duyurular / galeri eklerini çizer.
(function () {
  "use strict";
  var CFG = window.HSN_CONFIG || {}, V = window.HSN_VARSAYILAN;
  if (!CFG.supabaseUrl || !CFG.supabaseAnonKey || !V) return;
  var ONBELLEK = "hsn-icerik-v1";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };

  // Metin düğümlerinde birebir eşleşen varsayılanı yenisiyle değiştir
  function metinDegistir(es) {
    if (!es.length) return;
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), n, list = [];
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) {
      var v = t.nodeValue, tr = v.trim();
      if (!tr) return;
      es.forEach(function (p) { if (tr === p[0]) v = v.replace(p[0], p[1]); else if (p[2] && v.indexOf(p[0]) >= 0) v = v.split(p[0]).join(p[1]); });
      if (v !== t.nodeValue) t.nodeValue = v;
    });
  }

  function uygula(I) {
    var es = [];
    var ekle = function (eski, yeni, parca) { if (eski && yeni && eski !== yeni) es.push([eski, yeni, parca]); };

    // İletişim
    var il = I.iletisim || {};
    ekle(V.tel_txt, il.tel_txt, true); ekle(V.saat, il.saat, true);
    // Sayfalarda saat aralığı farklı biçimlerde de geçiyor ("Pzt – Cmt · 08:00 – 19:30", "08:00 – 19:30"): yalnız saat kısmını da değiştir
    var SA = /\d{1,2}[:.]\d{2}\s*[–-]\s*\d{1,2}[:.]\d{2}/, sa0 = (V.saat || "").match(SA), sa1 = (il.saat || "").match(SA);
    if (sa0 && sa1) ekle(sa0[0], sa1[0], true);
    ekle(V.adres, il.adres, false); ekle(V.adres_1, il.adres_1, false); ekle(V.adres_2, il.adres_2, false);
    if (il.tel_txt) {
      var yeniTel = "+90" + String(il.tel_txt).replace(/\D/g, "").slice(-10);
      document.querySelectorAll('a[href="tel:' + V.tel + '"]').forEach(function (a) { a.setAttribute("href", "tel:" + yeniTel); });
    }
    // Hakkımızda
    var hk = I.hakkimizda || {};
    ekle(V.about.title, hk.title); ekle(V.about.lead, hk.lead);
    (hk.body || []).forEach(function (p, i) { ekle(V.about.body[i], p); });
    // Hizmet açıklamaları ve fotoğrafları
    var hz = I.hizmetler || {};
    Object.keys(hz).forEach(function (id) {
      var d = V.services[id], y = hz[id] || {};
      if (!d) return;
      ekle(d[1], y.desc);
      if (y.img) document.querySelectorAll('img[src$="img/' + d[2] + '"]').forEach(function (im) {
        var k = im.closest("li,article,figure,a,div");
        if (k && k.innerText.indexOf(d[0]) >= 0 || (im.closest('[id="' + id + '"]'))) im.src = y.img;
      });
    });
    metinDegistir(es);

    // Galeri: gizlenenler + yeni eklenen fotoğraflar
    var g = I.galeri || {};
    document.querySelectorAll("#shots, .gallery, .mosaic").forEach(function (kap) {
      (g.gizli || []).forEach(function (f) { kap.querySelectorAll('a[href$="img/' + f + '"]').forEach(function (a) { (a.closest("figure") || a).style.display = "none"; }); });
      if (kap.dataset.hsnEk) return;
      kap.dataset.hsnEk = "1";
      var tpl = kap.firstElementChild; if (!tpl) return;
      (g.ekler || []).slice().reverse().forEach(function (e) {
        var c = tpl.cloneNode(true); c.style.display = "";
        var a = c.matches("a") ? c : c.querySelector("a"), im = c.querySelector("img"), fc = c.querySelector("figcaption");
        if (a) a.setAttribute("href", e.url); if (im) { im.src = e.url; im.alt = e.aciklama || "HSN Otomotiv"; } if (fc) fc.textContent = e.aciklama || "";
        kap.insertBefore(c, kap.firstChild);
      });
    });

    // Duyuru bandı (tüm sayfalar, en üstte)
    var du = I.duyuru || {}, eskiBant = document.getElementById("hsn-duyuru");
    if (eskiBant) eskiBant.remove();
    if (du.aktif && du.metin) {
      var b = document.createElement("div");
      b.id = "hsn-duyuru";
      b.style.cssText = "background:" + (du.renk || "#c8102e") + ";color:#fff;text-align:center;padding:10px 16px;font:600 15px/1.4 system-ui,sans-serif;position:relative;z-index:50";
      b.innerHTML = esc(du.metin) + (du.link ? ' <a href="' + esc(du.link) + '" style="color:#fff;text-decoration:underline;margin-left:6px">' + esc(du.linkMetin || "Detay") + "</a>" : "");
      document.body.insertBefore(b, document.body.firstChild);
    }

    // Duyurular / kampanyalar (yalnız ana sayfa, alt bilgiden önce)
    var ds = (I.duyurular || []).filter(function (x) { return x && x.baslik; }), eskiBol = document.getElementById("hsn-duyurular");
    if (eskiBol) eskiBol.remove();
    var anaSayfa = /(^|\/)(index\.html)?$/.test(location.pathname);
    if (ds.length && anaSayfa) {
      var s = document.createElement("section");
      s.id = "hsn-duyurular";
      s.style.cssText = "padding:48px 16px;background:#f4f4f2";
      s.innerHTML = '<div style="max-width:1100px;margin:0 auto"><h2 style="margin:0 0 20px">Duyurular ve kampanyalar</h2><div style="display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">' +
        ds.map(function (x) {
          return '<article style="background:#fff;border:1px solid #e3e3df;border-radius:6px;overflow:hidden">' + (x.img ? '<img src="' + esc(x.img) + '" alt="' + esc(x.baslik) + '" loading="lazy" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block">' : "") +
            '<div style="padding:16px"><small style="color:#777">' + esc(x.tarih || "") + '</small><h3 style="margin:4px 0 8px;font-size:18px">' + esc(x.baslik) + '</h3><p style="margin:0;color:#444;white-space:pre-line">' + esc(x.metin || "") + "</p></div></article>";
        }).join("") + "</div></div>";
      var f = document.querySelector("footer");
      f ? f.parentNode.insertBefore(s, f) : document.body.appendChild(s);
    }
  }

  var calis = function (I) { try { uygula(I || {}); } catch (e) { console.warn("HSN içerik:", e); } };
  // Önce önbellek (anında), sonra güncel veri
  // (metin değişimi varsayılandan yapıldığı için ikinci kez uygulanamaz: içerik değiştiyse önbelleği güncelleyip bir kez yenile)
  var eski = null;
  try { eski = localStorage.getItem(ONBELLEK); if (eski) calis(JSON.parse(eski)); } catch (e) { eski = null; }
  fetch(CFG.supabaseUrl + "/rest/v1/site_content?select=key,value&order=key", { headers: { apikey: CFG.supabaseAnonKey, Authorization: "Bearer " + CFG.supabaseAnonKey } })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (rows) {
      var I = {}; (rows || []).forEach(function (r) { I[r.key] = r.value; });
      var yeni = JSON.stringify(I);
      if (yeni === eski) return;
      try { localStorage.setItem(ONBELLEK, yeni); } catch (e) { return calis(I); }
      eski ? location.reload() : calis(I);
    }).catch(function () {});
})();
