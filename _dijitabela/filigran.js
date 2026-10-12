/* Dijitabela marka filigranı (Patron 11 Eki 2026, KALICI KURAL): ürettiğimiz her şeyin arka planında
   Dijitabela adının varyasyonları görünsün (dijitabela.com.tr · Dijitabela · Diji Tabela · Dijital Tabela · DJ Tabela · dijitabela.com).
   - Desen SVG ARKA PLAN GÖRSELİ olarak çizilir (DOM'da metin değil): Google "gizli metin" spam kuralına girmez, aramada ceza riski yok.
   - Sayfaların altına GÖRÜNÜR "Tasarım: Dijitabela · dijitabela.com.tr" bağlantısı eklenir (markanın arama motorunca tanınmasını sağlayan asıl kısım).
   Kullanım: <script src=".../filigran.js" data-gucu="0.05" data-kredi="1"></script>
     data-gucu  : desen saydamlığı (site 0.04 varsayılan; video sahnesi 0.07)
     data-kredi : "0" ise altbilgi bağlantısı eklenmez (video/görsel sahneleri)
     data-renk  : desen rengi (varsayılan: açık zeminde koyu, koyu zeminde açık; otomatik)
   Satılan müşteri sitelerinde desen kaldırılır, yalnız altbilgi bağlantısı kalır (window.DJ_FILIGRAN = false). */
(function () {
  if (window.DJ_FILIGRAN === false || window.__djFiligran) return; window.__djFiligran = true;
  var s = document.currentScript || {}, ds = (s.dataset || {});
  var guc = parseFloat(ds.gucu || "0.045"), kredi = ds.kredi !== "0";
  var ADLAR = ["dijitabela.com.tr", "Dijitabela", "Diji Tabela", "Dijital Tabela", "DJ Tabela", "dijitabela.com", "DİJİTABELA"]; // Türkçe harfler \u kaçışıyla: dosya hangi karakter kodlamasıyla sunulursa sunulsun bozulmaz
  function renk() {
    if (ds.renk) return ds.renk;
    try { var c = getComputedStyle(document.body).backgroundColor.match(/\d+/g); if (c && c.length >= 3) { var l = (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]); if (c[3] === "0") l = 255; return l < 128 ? "#ffffff" : "#111827"; } } catch (e) {}
    return "#111827";
  }
  function desen(r) {
    var satir = [], y = 34;
    for (var i = 0; i < 6; i++) { var a = ADLAR[i % ADLAR.length], b = ADLAR[(i + 3) % ADLAR.length]; satir.push('<text x="' + (i % 2 ? 0 : 60) + '" y="' + y + '">' + a + "   ·   " + b + "</text>"); y += 52; }
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="620" height="312" viewBox="0 0 620 312"><g fill="' + r + '" font-family="Arial,Helvetica,sans-serif" font-size="22" font-weight="700" letter-spacing="1">' + satir.join("") + "</g></svg>";
    return "url(\"data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg) + "\")";
  }
  function kur() {
    if (!document.body) return;
    var k = document.createElement("div"); k.setAttribute("aria-hidden", "true"); k.className = "dj-filigran";
    k.style.cssText = "position:fixed;left:-50%;top:-50%;width:200%;height:200%;transform:rotate(-16deg);pointer-events:none;z-index:2147483000;background-image:" + desen(renk()) + ";background-repeat:repeat;opacity:" + guc + ";";
    document.body.appendChild(k);
    if (kredi && !document.querySelector(".dj-kredi")) {
      var a = document.createElement("a"); a.className = "dj-kredi"; a.href = "https://dijitabela.com.tr/"; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Tasarım: Dijitabela · dijitabela.com.tr";
      a.style.cssText = "display:block;text-align:center;font:600 12px/1.4 system-ui,sans-serif;padding:14px 16px 18px;color:inherit;opacity:.7;text-decoration:none;position:relative;z-index:1";
      document.body.appendChild(a);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", kur); else kur();
})();
