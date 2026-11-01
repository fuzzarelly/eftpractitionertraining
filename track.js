(function () {
  var q = new URLSearchParams(location.search);
  function put(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function get(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } }
  ['gclid','wbraid','gbraid','fbclid','utm_source','utm_medium','utm_campaign'].forEach(function (k) {
    var v = q.get(k); if (v) put('mh_' + k, v);
  });
  function clean(s) { return String(s).replace(/[^A-Za-z0-9_.-]/g, '').slice(0, 80); }
  function clientId() { var m = document.cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/); return m ? m[1].replace('.', '_') : ''; }
  function ref() {
    var p = ['c' + clean(clientId())];
    var c = get('mh_gclid') || get('mh_wbraid') || get('mh_gbraid'); if (c) p.push('g' + clean(c));
    var s = get('mh_utm_source'); if (s) p.push('s' + clean(s));
    return p.join('-').slice(0, 195);
  }
  function decorate() {
    document.querySelectorAll('a[href*="buy.stripe.com"]').forEach(function (a) {
      try { var u = new URL(a.href); u.searchParams.set('client_reference_id', ref()); a.href = u.toString(); } catch (e) {}
    });
    document.querySelectorAll('a[href*="zylvie.com"]').forEach(function (a) {
      try { var u = new URL(a.href);
        ['utm_source','utm_medium','utm_campaign'].forEach(function (k) { var v = get('mh_' + k); if (v) u.searchParams.set(k, v); });
        a.href = u.toString(); } catch (e) {}
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorate); else decorate();
  setTimeout(decorate, 1500);

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-cta]'); if (!a) return;
    var plan = a.getAttribute('data-plan') || 'full';
    var value = plan === 'plan' ? 200 : 497;
    try { gtag('event', 'cta_click', { cta_location: a.getAttribute('data-cta'), plan: plan }); } catch (x) {}
    try { gtag('event', 'begin_checkout', { value: value, currency: 'USD', items: [{ item_name: 'EFT Practitioner Training', price: value }] }); } catch (x) {}
    try { fbq('track', 'InitiateCheckout', { value: value, currency: 'USD', content_name: 'EFT Practitioner Training' }); } catch (x) {}
  });

  var marks = [25, 50, 75, 100], sent = {};
  window.addEventListener('scroll', function () {
    var pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    marks.forEach(function (m) { if (pct >= m && !sent[m]) { sent[m] = 1; try { gtag('event', 'scroll_depth', { percent: m }); } catch (x) {} } });
  }, { passive: true });
})();
