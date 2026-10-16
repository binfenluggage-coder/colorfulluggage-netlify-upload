(() => {
  'use strict';
  const script = document.currentScript;
  const base = new URL('.', script.src);
  const current = document.documentElement.dataset.locale || 'en';
  const page = document.documentElement.dataset.page || 'index.html';
  const languages = [
    ['en', 'English', 'EN'], ['zh', '简体中文', '中文'],
    ['es', 'Español', 'ES'], ['fr', 'Français', 'FR'],
    ['de', 'Deutsch', 'DE'], ['ar', 'العربية', 'ع'],
    ['ru', 'Русский', 'RU'], ['pt', 'Português', 'PT'],
  ];
  const labels = {
    en: ['Language', 'Menu', 'Show more products', 'Show fewer products', 'Would you prefer to browse in English?', 'View in English', 'Dismiss'],
    zh: ['语言', '菜单', '查看更多产品', '收起产品', '是否使用简体中文浏览？', '查看中文版', '关闭'],
    es: ['Idioma', 'Menú', 'Ver más productos', 'Ver menos productos', '¿Prefiere navegar en español?', 'Ver en español', 'Cerrar'],
    fr: ['Langue', 'Menu', 'Voir plus de produits', 'Voir moins de produits', 'Préférez-vous consulter le site en français ?', 'Voir en français', 'Fermer'],
    de: ['Sprache', 'Menü', 'Weitere Produkte', 'Weniger Produkte', 'Möchten Sie die Website auf Deutsch ansehen?', 'Auf Deutsch ansehen', 'Schließen'],
    ar: ['اللغة', 'القائمة', 'عرض المزيد من المنتجات', 'عرض منتجات أقل', 'هل تفضل تصفح الموقع باللغة العربية؟', 'تصفح بالعربية', 'إغلاق'],
    ru: ['Язык', 'Меню', 'Показать больше', 'Свернуть список', 'Хотите просмотреть сайт на русском языке?', 'Перейти на русский', 'Закрыть'],
    pt: ['Idioma', 'Menu', 'Ver mais produtos', 'Ver menos produtos', 'Prefere navegar em português?', 'Ver em português', 'Fechar'],
  };
  const ui = labels[current] || labels.en;
  const safeGet = (storage, key) => { try { return window[storage].getItem(key); } catch { return null; } };
  const safeSet = (storage, key, value) => { try { window[storage].setItem(key, value); } catch { /* Storage can be disabled in private/file browsing. */ } };
  const targetURL = lang => {
    const url = new URL((lang === 'en' ? '' : lang + '/') + page, base);
    url.search = location.search;
    url.hash = location.hash;
    return url;
  };
  const choose = lang => safeSet('localStorage', 'colorful.language', lang);
  const nav = document.querySelector('body > .nav .nav-inner');
  if (nav) {
    const controls = document.createElement('div');
    controls.className = 'locale-tools';
    const picker = document.createElement('details');
    picker.className = 'locale-picker';
    const summary = document.createElement('summary');
    summary.textContent = languages.find(item => item[0] === current)?.[2] || 'EN';
    summary.setAttribute('aria-label', ui[0]);
    const list = document.createElement('nav');
    list.setAttribute('aria-label', ui[0]);
    for (const [lang, name] of languages) {
      const link = document.createElement('a');
      link.href = targetURL(lang).href;
      link.lang = lang === 'pt' ? 'pt-BR' : lang;
      link.hreflang = link.lang;
      link.dir = lang === 'ar' ? 'rtl' : 'ltr';
      link.textContent = name;
      if (lang === current) link.setAttribute('aria-current', 'true');
      link.addEventListener('click', () => choose(lang));
      list.append(link);
    }
    picker.append(summary, list);
    controls.append(picker);
    const toggle = nav.querySelector('.nav-toggle');
    if (toggle) {
      toggle.textContent = '☰';
      toggle.setAttribute('aria-label', ui[1]);
      toggle.setAttribute('aria-expanded', 'false');
      controls.append(toggle);
      const updateToggle = () => {
        const opened = document.querySelector('.nav-links')?.classList.contains('open');
        toggle.textContent = opened ? '×' : '☰';
        toggle.setAttribute('aria-expanded', String(Boolean(opened)));
      };
      new MutationObserver(updateToggle).observe(document.querySelector('.nav-links'), { attributes: true, attributeFilter: ['class'] });
    }
    nav.append(controls);
    document.addEventListener('click', event => { if (!picker.contains(event.target)) picker.open = false; });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && picker.open) { picker.open = false; summary.focus(); } });
    picker.addEventListener('toggle', () => {
      if (picker.open) {
        document.querySelector('.nav-links')?.classList.remove('open');
        // Hashes can change after opening another product category.
        [...list.children].forEach((link, index) => { link.href = targetURL(languages[index][0]).href; });
      }
    });
  }

  // Translate changing UI text without altering order identifiers or JS keys.
  const dictionary = window.colorfulLocaleCopy || {};
  const dynamic = {
    en: {},
    zh: { 'Private order lookup':'私密订单查询', 'Enter ID':'输入订单编号', 'Enter order ID to view photos':'输入订单编号查看照片', 'Order photo updates':'订单照片更新', 'Enter your order ID to view the current process-node photos uploaded by the factory.':'输入订单编号，查看工厂上传的当前生产节点照片。' },
    es: { 'Private order lookup':'Consulta privada de pedidos', 'Enter ID':'Introduzca el código', 'Enter order ID to view photos':'Introduzca el código para ver fotos', 'Order photo updates':'Fotos del pedido', 'Enter your order ID to view the current process-node photos uploaded by the factory.':'Introduzca el código del pedido para ver las fotos de producción facilitadas por la fábrica.' },
    fr: { 'Private order lookup':'Suivi privé de commande', 'Enter ID':'Saisir le numéro', 'Enter order ID to view photos':'Saisissez le numéro pour voir les photos', 'Order photo updates':'Photos de la commande', 'Enter your order ID to view the current process-node photos uploaded by the factory.':'Saisissez votre numéro de commande pour consulter les photos de production transmises par l’usine.' },
    de: { 'Private order lookup':'Private Auftragsabfrage', 'Enter ID':'Auftragsnummer eingeben', 'Enter order ID to view photos':'Auftragsnummer eingeben, um Fotos zu sehen', 'Order photo updates':'Aktuelle Auftragsfotos', 'Enter your order ID to view the current process-node photos uploaded by the factory.':'Geben Sie Ihre Auftragsnummer ein, um die aktuellen Produktionsfotos des Werks anzusehen.' },
    ar: { 'Private order lookup':'متابعة خاصة للطلب', 'Enter ID':'أدخل رقم الطلب', 'Enter order ID to view photos':'أدخل رقم الطلب لعرض الصور', 'Order photo updates':'تحديثات صور الطلب', 'Enter your order ID to view the current process-node photos uploaded by the factory.':'أدخل رقم طلبك لعرض أحدث صور مراحل الإنتاج التي يرفعها المصنع.' },
    ru: { 'Private order lookup':'Закрытое отслеживание заказа', 'Enter ID':'Введите номер', 'Enter order ID to view photos':'Введите номер заказа для просмотра фотографий', 'Order photo updates':'Фотографии заказа', 'Enter your order ID to view the current process-node photos uploaded by the factory.':'Введите номер заказа, чтобы увидеть фотографии текущего этапа производства, предоставленные фабрикой.' },
    pt: { 'Private order lookup':'Consulta privada de pedidos', 'Enter ID':'Digite o código', 'Enter order ID to view photos':'Digite o código para ver as fotos', 'Order photo updates':'Fotos do pedido', 'Enter your order ID to view the current process-node photos uploaded by the factory.':'Digite o código do pedido para ver as fotos atuais da produção enviadas pela fábrica.' },
  };
  const map = Object.assign({}, dictionary, dynamic[current]);
  const photoLabels = { en:'photos', zh:'照片', es:'fotos', fr:'photos', de:'Fotos', ar:'صور', ru:'фото', pt:'fotos' };
  function translateText(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('script,style,.locale-tools,.locale-suggestion')) continue;
      const source = node.textContent.trim();
      if (map[source] && map[source] !== source) node.textContent = node.textContent.replace(source, map[source]);
      else if (source.endsWith(' photos') && current !== 'en') {
        const stage = source.slice(0,-7);
        node.textContent = `${map[stage] || stage} — ${photoLabels[current]}`;
      }
    }
    document.querySelectorAll('.category-more-btn').forEach(button => {
      const grid = button.parentElement.previousElementSibling;
      const collapsed = grid.classList.contains('category-collapsed');
      const count = [...grid.children].filter(child => child.classList.contains('slot')).length - 3;
      const label = collapsed ? `${ui[2]} (${count})` : ui[3];
      if (button.textContent !== label) button.textContent = label;
    });
  }
  translateText(document.body);
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; observer.disconnect(); translateText(document.body); observer.observe(document.body, { childList: true, subtree: true, characterData: true }); });
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  // Keep submitted chip identifiers stable while composing the customer's message locally.
  if (current !== 'en') document.querySelectorAll('[data-rfq-chip]').forEach(chip => {
    chip.addEventListener('click', () => {
      const message = document.querySelector('textarea[name="message"]');
      if (!message) return;
      const prefix = map['Inquiry tags:'] || ui[0] + ':';
      const lines = message.value.split('\n\n');
      if (/^Inquiry tags:/.test(lines[0]) || lines[0].startsWith(prefix)) lines.shift();
      const selected = [...document.querySelectorAll('[data-rfq-chip].is-active')].map(item => item.textContent.trim());
      message.value = (selected.length ? prefix + ' ' + selected.join(', ') + '.\n\n' : '') + lines.join('\n\n');
    });
  });
  const whatsappMessage = {
    en:'Hello, I would like to learn more about your luggage products.',
    zh:'您好，我想了解贵公司的行李箱产品。',
    es:'Hola, me gustaría recibir información sobre sus productos de equipaje.',
    fr:'Bonjour, je souhaite en savoir plus sur vos collections de bagages.',
    de:'Guten Tag, ich möchte mehr über Ihre Koffermodelle erfahren.',
    ar:'مرحبًا، أود معرفة المزيد عن منتجات حقائب السفر لديكم.',
    ru:'Здравствуйте! Хочу узнать больше о ваших чемоданах.',
    pt:'Olá, gostaria de saber mais sobre seus modelos de malas.',
  };
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    const url = new URL(link.href);
    url.searchParams.set('text', whatsappMessage[current]);
    link.href = url.href;
  });

  const preferred = safeGet('localStorage', 'colorful.language');
  if (languages.some(([lang]) => lang === preferred) && preferred !== current) {
    location.replace(targetURL(preferred).href);
    return;
  }
  const normalize = language => language?.toLowerCase().split('-')[0];
  const suggested = (navigator.languages || [navigator.language]).map(normalize).find(lang => languages.some(([code]) => code === lang));
  if (!preferred && suggested && suggested !== current && !safeGet('sessionStorage', 'colorful.language.dismissed')) {
    const text = labels[suggested];
    const aside = document.createElement('aside');
    aside.className = 'locale-suggestion';
    aside.lang = suggested;
    aside.dir = suggested === 'ar' ? 'rtl' : 'ltr';
    aside.setAttribute('aria-label', text[0]);
    const message = document.createElement('p'); message.textContent = text[4];
    const link = document.createElement('a'); link.textContent = text[5]; link.href = targetURL(suggested).href; link.addEventListener('click', () => choose(suggested));
    const dismiss = document.createElement('button'); dismiss.type = 'button'; dismiss.textContent = '×'; dismiss.setAttribute('aria-label', text[6]);
    dismiss.addEventListener('click', () => { safeSet('sessionStorage', 'colorful.language.dismissed', '1'); aside.remove(); });
    aside.append(message, link, dismiss);
    document.body.append(aside);
  }
})();
