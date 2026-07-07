/* ═══════════════════════════════════════════════════════════════
   TEMPLATE 11 — "Pichwai Azure"
   Vanilla JS · video intro + hero · events carousel · config loader
═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var rmq = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────
     EVENTS DATA  (template defaults)
     Overridden in place by applyConfigPhase1
  ───────────────────────────────────── */
  var EVT_BASE = 'assets/events/';
  var ICON_MAP = {
    mehendi:'mehendi.webp', haldi:'haldi.webp', sangeet:'sangeet.webp',
    shaadi:'shaadi.webp', pheras:'pheras.webp', reception:'reception.webp',
    baraat:'baraat.webp', sagan:'sagan.webp', cocktail:'cocktail.webp',
    engagement:'engagement.webp', tilak:'tilak.webp',
    vidaai:'bidai.webp', bidai:'bidai.webp'
  };
  function iconFor(id, fallbackIdx){
    var f = ICON_MAP[id];
    if (f) return EVT_BASE + f;
    return EVT_BASE + 'custom_' + (((fallbackIdx || 0) % 3) + 1) + '.webp';
  }

  var MAP_URL = 'https://www.google.com/maps/search/?api=1&query=The+Oberoi+Udaivilas+Udaipur+Rajasthan';
  var EVENTS = [
    { id:'mehendi',   name:'Mehendi',   date:'11 Dec 2026', time:'4:00 PM',  venue:'Lotus Courtyard',  note:'Greens & florals encouraged',          map:MAP_URL },
    { id:'haldi',     name:'Haldi',     date:'12 Dec 2026', time:'10:00 AM', venue:'Poolside Courtyard',note:'Yellow / ivory tones',                 map:MAP_URL },
    { id:'sangeet',   name:'Sangeet',   date:'12 Dec 2026', time:'7:30 PM',  venue:'Royal Ballroom',    note:'An evening of music and performances', map:MAP_URL },
    { id:'shaadi',    name:'Shaadi',    date:'13 Dec 2026', time:'9:30 AM',  venue:'Lake Mandap',       note:'Traditional Indian attire',            map:MAP_URL },
    { id:'reception', name:'Reception', date:'13 Dec 2026', time:'7:30 PM',  venue:'Palace Lawns',      note:'Candlelit dinner and celebration',     map:MAP_URL },
    { id:'vidaai',    name:'Vidaai',    date:'14 Dec 2026', time:'9:00 AM',  venue:'Main Courtyard',    note:'A quiet farewell with blessings',      map:MAP_URL }
  ];

  /* ─────────────────────────────────────
     THINGS TO KNOW  (icons in assets/ttk/)
  ───────────────────────────────────── */
  var TTK_BASE = 'assets/ttk/';
  /* type / builder-id → icon file (exact disk casing — Vercel is case-sensitive) */
  var TTK_ICONS = {
    'dress-code':'dress_code.webp', dresscode:'dress_code.webp',
    'venue':'venue.webp',
    'stay-options':'stay.webp', stay:'stay.webp', hotel:'stay.webp',
    'hashtag':'hashtag.webp',
    'transport':'transport.webp', transportation:'transport.webp',
    'gift-registry':'gift_registry.webp', gifts:'gift_registry.webp', registry:'gift_registry.webp',
    'kids-welcome':'kids_welocme.webp', kids:'kids_welocme.webp',
    'photography':'photography.webp', photos:'photography.webp',
    'whatsapp-group':'whatsapp.webp', whatsapp:'whatsapp.webp',
    'parking':'parking.webp',
    'food':'food.webp', catering:'food.webp', meals:'food.webp',
    'weather':'weather.webp'
  };
  function ttkIconFor(type){
    var f = type && TTK_ICONS[type];
    return f ? TTK_BASE + f : null;
  }
  var TTK_ITEMS = [
    { type:'dress-code',   enabled:true,  title:'Dress Code',      description:'Festive Indian elegance. Sarees, lehengas and sherwanis are warmly encouraged.', icon:ttkIconFor('dress-code'), linkLabel:null, linkUrl:null, custom:false },
    { type:'venue',        enabled:true,  title:'Venue',           description:'The Oberoi Udaivilas, Udaipur. All celebrations take place within the palace grounds.', icon:ttkIconFor('venue'), linkLabel:'Open in Maps', linkUrl:MAP_URL, custom:false },
    { type:'stay-options', enabled:true,  title:'Stay Options',    description:'A curated block of rooms has been reserved. Please book by 1st November 2026.', icon:ttkIconFor('stay-options'), linkLabel:null, linkUrl:null, custom:false },
    { type:'hashtag',      enabled:true,  title:'Wedding Hashtag', description:'Share your favourite moments with #AaravMeera.', icon:ttkIconFor('hashtag'), linkLabel:null, linkUrl:null, custom:false },
    { type:'transport',    enabled:false, title:'Transport',       description:'Complimentary shuttle service between the airport and the palace.', icon:ttkIconFor('transport'), linkLabel:null, linkUrl:null, custom:false },
    { type:'gift-registry',enabled:false, title:'Gift Registry',   description:'Your presence is the greatest gift. A registry link is available for those who wish.', icon:ttkIconFor('gift-registry'), linkLabel:'View Registry', linkUrl:'#', custom:false },
    { type:'kids-welcome', enabled:false, title:'Kids Welcome',    description:'Children are warmly welcome. A dedicated kids’ zone will be available at all events.', icon:ttkIconFor('kids-welcome'), linkLabel:null, linkUrl:null, custom:false },
    { type:'photography',  enabled:false, title:'Photography',     description:'A professional photographer will be present. Capture moments freely.', icon:ttkIconFor('photography'), linkLabel:null, linkUrl:null, custom:false },
    { type:'whatsapp-group',enabled:false,title:'WhatsApp Group',  description:'Join our wedding group for live updates and celebration news.', icon:ttkIconFor('whatsapp-group'), linkLabel:'Join Group', linkUrl:'#', custom:false }
  ];

  /* ─────────────────────────────────────
     GALLERY  (ornate frame around each photo)
  ───────────────────────────────────── */
  var GAL_FRAME = 'assets/gallery/gallery_outerframe.webp';
  var DEMO_PHOTOS = [
    'assets/demo/demo_1.webp','assets/demo/demo_2.webp',
    'assets/demo/demo_3.webp','assets/demo/demo_4.webp'
  ];
  var GALLERY_PHOTOS = [
    { src:DEMO_PHOTOS[0], caption:'Together',      wide:true  },
    { src:DEMO_PHOTOS[1], caption:'Getting ready', wide:false },
    { src:DEMO_PHOTOS[2], caption:'The ceremony',  wide:false },
    { src:DEMO_PHOTOS[3], caption:'Celebrations',  wide:false }
  ];

  /* ═══════════════════════════════════════════════════════════
     PHASE 1 — override data arrays from __WEDDING_CONFIG__
  ═══════════════════════════════════════════════════════════ */
  (function applyConfigPhase1(){
    var C = window.__WEDDING_CONFIG__;
    if (!C) return;
    function fmt(iso){
      if (!iso) return '';
      var p = iso.split('-');
      var mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return parseInt(p[2],10)+' '+(mo[parseInt(p[1],10)-1]||'')+' '+p[0];
    }
    if (C.events && C.events.length){
      var mapped = C.events.map(function(ev, i){
        return {
          id:ev.id, name:ev.name,
          icon:iconFor(ev.id, i),
          date:fmt(ev.date), time:ev.time||'',
          venue:ev.venue||'', note:ev.desc||'', map:ev.mapsLink||''
        };
      });
      EVENTS.splice(0, EVENTS.length);
      mapped.forEach(function(e){ EVENTS.push(e); });
    }

    /* ── Things to Know ── */
    if (C.thingsToKnow && C.thingsToKnow.length){
      var TTK_ID_MAP = {
        dresscode:'dress-code', hotel:'stay-options', gifts:'gift-registry',
        kids:'kids-welcome', whatsapp:'whatsapp-group', photos:'photography'
      };
      TTK_ITEMS.forEach(function(item){ item.enabled = false; });
      C.thingsToKnow.forEach(function(ttk){
        var resolved = TTK_ID_MAP[ttk.id] || ttk.id;
        var match = ttk.id && ttk.id.indexOf('ctk_') !== 0
          ? TTK_ITEMS.find(function(it){ return it.type === resolved; })
          : null;
        if (match){
          match.title = ttk.label || match.title;
          match.description = ttk.value || match.description;
          match.enabled = true;
          match.linkLabel = null; match.linkUrl = null;   /* drop demo links; only a real mapsLink re-adds one */
          if (ttk.iconKey) match.icon = TTK_BASE + ttk.iconKey;
          if (ttk.mapsLink){ match.linkLabel = 'Open in Maps'; match.linkUrl = ttk.mapsLink; }
        } else if (ttk.label){
          TTK_ITEMS.push({
            type: ttk.id || ('custom-'+TTK_ITEMS.length),
            enabled:true, title:ttk.label, description:ttk.value||'',
            icon: ttk.iconKey ? TTK_BASE + ttk.iconKey : (ttkIconFor(resolved) || ttkIconFor(ttk.id)),
            linkLabel:null, linkUrl:null, custom:true
          });
        }
      });
    }

    /* ── Gallery ── */
    if (C.gallery){
      if (!C.gallery.show || C.gallery.layout === 'skip'){
        GALLERY_PHOTOS.splice(0);
      } else {
        var photos = (C.gallery.photos || []).filter(Boolean);
        if (photos.length){
          var bride = (C.couple && C.couple.bride) || '';
          var groom = (C.couple && C.couple.groom) || '';
          var cap = bride && groom ? bride + ' & ' + groom : 'Our memories';
          var max = parseInt(C.gallery.layout, 10) || photos.length;
          var mapped = photos.slice(0, max).map(function(src, i){
            return { src:src, caption:cap, wide:(i === 0) };
          });
          GALLERY_PHOTOS.splice(0, GALLERY_PHOTOS.length);
          mapped.forEach(function(p){ GALLERY_PHOTOS.push(p); });
        }
      }
    }

    /* Hide the whole section if turned off in the builder */
    if (C.showThingsToKnow === false){
      TTK_ITEMS.forEach(function(item){ item.enabled = false; });
      var sec = document.getElementById('things');
      if (sec) sec.style.display = 'none';
    }
  })();

  /* ═══════════════════════════════════════════════════════════
     INTRO — tap to begin (iOS-safe gesture handling)
  ═══════════════════════════════════════════════════════════ */
  var intro     = document.getElementById('intro');
  var introVid  = document.getElementById('introVideo');
  var introHint = document.getElementById('introHint');
  var bloom     = document.getElementById('screenBloom');
  var page      = document.getElementById('page');
  var heroVid   = document.getElementById('heroVideo');
  var heroContent = document.getElementById('heroContent');

  var tapped = false, introDone = false, fallbackTimer = null;

  function lockScroll(on){ document.body.classList.toggle('intro-active', on); }

  if (rmq){ skipIntro(); }
  else {
    lockScroll(true);
    try { introVid.load(); } catch(_){}
    introVid.addEventListener('error', function(){ if(!introDone) scheduleReveal(600); });

    var touchHandled = false;
    function gestureStart(){ if (tapped) return; touchHandled = true; firstTap(); }
    intro.addEventListener('touchstart', gestureStart, { passive:true });
    intro.addEventListener('pointerdown', gestureStart, { passive:true });
    intro.addEventListener('click', function(){ if (touchHandled){ touchHandled=false; return; } firstTap(); });
    intro.addEventListener('keydown', function(e){
      if (e.key==='Enter' || e.key===' '){ e.preventDefault(); firstTap(); }
    });
  }

  function firstTap(){
    if (tapped) return;
    tapped = true;
    /* play() FIRST — no async/DOM work before it (iOS gesture token).
       Unmuted so the intro plays with its original sound; the tap is a
       trusted gesture, so unmuted playback is allowed on iOS/Android. */
    introVid.muted = false; introVid.playsInline = true; introVid.volume = 1;
    var p;
    try { p = introVid.play(); } catch(_){ p = null; }

    /* Unconditional safety reveal — fires even if play() never settles
       (undecodable source, hung promise, blocked autoplay, etc.) */
    fallbackTimer = setTimeout(revealHero, 9000);

    if (introHint) introHint.classList.add('is-gone');
    startMusic();

    if (p && p.then){
      p.then(armReveal).catch(function(){
        setTimeout(function(){
          var p2; try { p2 = introVid.play(); } catch(_){ p2 = null; }
          if (p2 && p2.then){ p2.then(armReveal).catch(function(){ scheduleReveal(400); }); }
          else { armReveal(); }
        }, 60);
      });
    } else if (p === null){ scheduleReveal(400); }
    else { armReveal(); }
  }

  function armReveal(){
    introVid.addEventListener('ended', revealHero, { once:true });
    /* duration-based reveal — fires the hero exactly when the clip finishes,
       even if the 'ended' event is dropped (common on mobile Safari). */
    function armDuration(){
      var d = introVid.duration;
      if (d && isFinite(d) && d > 0) setTimeout(revealHero, d * 1000 + 400);
    }
    if (introVid.readyState >= 1) armDuration();
    else introVid.addEventListener('loadedmetadata', armDuration, { once:true });
    /* stall guard */
    var stall = null;
    introVid.addEventListener('waiting', function(){
      if (introDone) return;
      stall = setTimeout(function(){ if(!introDone) revealHero(); }, 5000);
    });
    introVid.addEventListener('playing', function(){ if (stall){ clearTimeout(stall); stall=null; } });
  }

  function scheduleReveal(ms){ if (!introDone) setTimeout(revealHero, ms); }

  function revealHero(){
    if (introDone) return;
    introDone = true;
    if (fallbackTimer){ clearTimeout(fallbackTimer); fallbackTimer = null; }
    try { introVid.pause(); } catch(_){}

    if (bloom) bloom.classList.add('is-blooming');

    setTimeout(function(){
      intro.classList.add('is-fading');
      intro.addEventListener('transitionend', function(){ intro.classList.add('is-gone'); }, { once:true });
      lockScroll(false);
      window.scrollTo(0, 0);   /* always land on the hero, not mid-page */
      page.removeAttribute('aria-hidden');
      page.classList.add('is-visible');
      try { heroVid.play(); } catch(_){}
    }, 700);

    setTimeout(function(){ heroContent.classList.add('is-visible'); showControls(); }, 1000);

    setTimeout(function(){
      if (bloom){ bloom.classList.remove('is-blooming'); bloom.classList.add('is-retreating'); }
    }, 1500);
    setTimeout(function(){ if (bloom) bloom.classList.add('is-gone'); }, 3600);

    initReveals();
  }

  function skipIntro(){
    introDone = true;
    if (intro) intro.classList.add('is-gone');
    lockScroll(false);
    if (page){ page.removeAttribute('aria-hidden'); page.classList.add('is-visible'); }
    if (heroContent) heroContent.classList.add('is-visible');
    try { heroVid.play(); } catch(_){}
    document.querySelectorAll('.reveal-item').forEach(function(el){ el.classList.add('is-in'); });
  }

  /* ═══════════════════════════════════════════════════════════
     SCROLL REVEAL
  ═══════════════════════════════════════════════════════════ */
  function initReveals(){
    var items = document.querySelectorAll('.reveal-item');
    if (!('IntersectionObserver' in window)){
      items.forEach(function(el){ el.classList.add('is-in'); }); return;
    }
    /* Toggle (not unobserve) so reveals replay every time an element
       re-enters view — including when scrolling back up from below. */
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        e.target.classList.toggle('is-in', e.isIntersecting);
      });
    }, { threshold:.18 });
    items.forEach(function(el){ io.observe(el); });
  }

  /* ═══════════════════════════════════════════════════════════
     EVENTS CAROUSEL
  ═══════════════════════════════════════════════════════════ */
  /* Each ceremony is a royal hand-fan that opens (rotateY around its handle
     edge) as it scrolls into view — events reveal one by one. */
  /* "12 Dec 2026" → "12<sup>th</sup> Dec 2026" (ordinal on the day number) */
  function ordinalDate(str, cls){
    cls = cls || 'date-ord';
    return String(str).replace(/\b(\d{1,2})\b/, function(m, d){
      var n = parseInt(d, 10), v = n % 100, last = n % 10, suf = 'th';
      if (v < 11 || v > 13){
        if (last === 1) suf = 'st';
        else if (last === 2) suf = 'nd';
        else if (last === 3) suf = 'rd';
      }
      return d + '<sup class="' + cls + '">' + suf + '</sup>';
    });
  }

  function renderEvents(){
    var list = document.getElementById('eventsList');
    if (!list) return;
    list.innerHTML = '';

    var MAP_PIN = '<svg width="10" height="12" viewBox="0 0 11 14" fill="none" aria-hidden="true" style="display:inline-block;vertical-align:-1px"><path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 4.12 5.5 8.5 5.5 8.5S11 9.62 11 5.5C11 2.46 8.54 0 5.5 0Z" fill="currentColor" opacity=".7"/><circle cx="5.5" cy="5.5" r="2" fill="#faf4e8"/></svg>';

    EVENTS.forEach(function(ev, i){
      var icon = ev.icon || iconFor(ev.id, i);
      var note = ev.note ? '<p class="event-note">'+ev.note+'</p>' : '';
      /* Date and time on their own lines; ordinal superscript on the date */
      var dateHtml = ev.date ? '<span class="event-date">'+ordinalDate(ev.date, 'event-ord')+'</span>' : '';
      var timeHtml = ev.time ? '<span class="event-time">'+ev.time+'</span>' : '';
      var dt = (dateHtml || timeHtml) ? '<p class="event-datetime">'+dateHtml+timeHtml+'</p>' : '';
      var map = ev.map ? '<a class="event-map" href="'+ev.map+'" target="_blank" rel="noreferrer">'+MAP_PIN+' Open in Maps</a>' : '';

      /* Alternate frames: left → right → left … (left card first) */
      var side  = (i % 2 === 0) ? 'left' : 'right';
      var frame = side === 'left' ? 'Event_Card_left.webp' : 'Event_Card_right.webp';

      var card = document.createElement('article');
      card.className = 'event-card event-card--' + side;
      card.setAttribute('role','listitem');
      card.setAttribute('aria-label', (i+1)+' of '+EVENTS.length+': '+ev.name);
      card.innerHTML =
        '<div class="event-card-inner">'+
          '<div class="event-card-panel">'+
            '<img class="event-card-frame" src="assets/events/'+frame+'" alt="" aria-hidden="true" decoding="async" draggable="false">'+
            '<div class="event-card-body">'+
              '<img class="event-illustration" src="'+icon+'" alt="'+ev.name+'" decoding="async" draggable="false">'+
              '<h3 class="event-name">'+ev.name+'</h3>'+
              '<div class="event-rule" aria-hidden="true"></div>'+
              dt +
              (ev.venue ? '<p class="event-venue">'+ev.venue+'</p>' : '')+
              note + map +
            '</div>'+
          '</div>'+
        '</div>';
      list.appendChild(card);
    });

    var cards = list.querySelectorAll('.event-card');

    /* Reduced motion — reveal everything immediately, no fan animation */
    if (rmq || !('IntersectionObserver' in window)){
      cards.forEach(function(c){ c.classList.add('is-open'); });
      return;
    }

    /* Open each fan as it scrolls into view (one by one). Toggle (not
       unobserve) so the fan re-plays whenever a card re-enters view —
       including when the user scrolls back up from below. */
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        e.target.classList.toggle('is-open', e.isIntersecting);
      });
    }, { threshold:.28, rootMargin:'0px 0px -8% 0px' });
    cards.forEach(function(c){ io.observe(c); });
  }

  /* ═══════════════════════════════════════════════════════════
     THINGS TO KNOW — render
  ═══════════════════════════════════════════════════════════ */
  function renderTTK(){
    var grid = document.getElementById('ttkGrid');
    if (!grid) return;
    var active = TTK_ITEMS.filter(function(it){ return it.enabled; });
    if (!active.length){
      var sec = document.getElementById('things');
      if (sec) sec.style.display = 'none';
      return;
    }
    grid.innerHTML = '';
    var count = active.length;
    if (count === 1) grid.classList.add('ttk-grid--single');

    var io = ('IntersectionObserver' in window)
      ? new IntersectionObserver(function(entries){
          entries.forEach(function(e){
            if (e.isIntersecting){ e.target.classList.add('is-in'); io.unobserve(e.target); }
          });
        }, { threshold:.1, rootMargin:'0px 0px -5% 0px' })
      : null;

    active.forEach(function(item, i){
      var lastOdd = count > 1 && count % 2 !== 0 && i === count - 1;
      var card = document.createElement('li');
      card.className = 'ttk-card' + (lastOdd ? ' ttk-card--last-odd' : '');
      card.setAttribute('role','listitem');
      if (!rmq) card.style.transitionDelay = (i * 80) + 'ms';

      /* Icon is left blank for now — real art drops into assets/ttk/ later.
         If an item carries an icon path it renders; otherwise the ring + a
         small placeholder dot fill the circle. */
      var iconInner = item.icon
        ? '<img class="ttk-card-img" src="'+item.icon+'" alt="" decoding="async" loading="lazy" draggable="false" onerror="this.remove();this.parentNode.classList.add(\'ttk-card-icon--blank\')">'
        : '';
      var iconClass = 'ttk-card-icon' + (item.icon ? '' : ' ttk-card-icon--blank');

      var TTK_MAP_PIN = '<svg width="10" height="12" viewBox="0 0 11 14" fill="none" aria-hidden="true" style="display:inline-block;vertical-align:-1px;margin-right:4px"><path d="M5.5 0C2.46 0 0 2.46 0 5.5c0 4.12 5.5 8.5 5.5 8.5S11 9.62 11 5.5C11 2.46 8.54 0 5.5 0Z" fill="currentColor" opacity=".72"/><circle cx="5.5" cy="5.5" r="2" fill="#faf4e8"/></svg>';
      var linkHtml = (item.linkLabel && item.linkUrl)
        ? '<a class="ttk-card-link" href="'+item.linkUrl+'" target="_blank" rel="noreferrer">'+(/map/i.test(item.linkLabel) ? TTK_MAP_PIN : '')+item.linkLabel+'</a>'
        : '';

      card.innerHTML =
        '<div class="ttk-card-shine" aria-hidden="true"></div>'+
        '<div class="ttk-card-inner">'+
          '<div class="ttk-card-icon-wrap" aria-hidden="true">'+
            '<span class="ttk-card-icon-ring"></span>'+
            '<span class="ttk-card-icon-ring ttk-card-icon-ring--outer"></span>'+
            '<div class="'+iconClass+'">'+iconInner+'</div>'+
          '</div>'+
          '<p class="ttk-card-label">'+item.title+'</p>'+
          '<span class="ttk-card-rule" aria-hidden="true"></span>'+
          '<p class="ttk-card-body">'+item.description+'</p>'+
          linkHtml+
        '</div>';

      /* 3D perspective tilt on pointer move (desktop) */
      if (!rmq){
        card.addEventListener('mousemove', function(e){
          if (!card.classList.contains('is-in')) return;
          var r = card.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width  * 0.5)) / (r.width  * 0.5);
          var dy = (e.clientY - (r.top  + r.height * 0.5)) / (r.height * 0.5);
          card.style.transform = 'translateY(-6px) perspective(700px) rotateX('+(-dy*4).toFixed(2)+'deg) rotateY('+(dx*4).toFixed(2)+'deg)';
        });
        card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
      }

      grid.appendChild(card);
      if (io) io.observe(card); else card.classList.add('is-in');
    });
  }

  /* ═══════════════════════════════════════════════════════════
     GALLERY — framed wall + lightbox
  ═══════════════════════════════════════════════════════════ */
  var lbPhotos = [], lbIndex = 0;

  function renderGallery(){
    var featured = document.getElementById('galleryFeatured');
    var photoEl  = document.getElementById('galleryFeaturedPhoto');
    var dotsWrap = document.getElementById('galleryDots');
    var thumbs   = document.getElementById('galleryThumbs');
    if (!featured || !photoEl) return;

    var photos = GALLERY_PHOTOS.filter(function(p){ return p.src && p.src.trim() !== ''; });
    if (!photos.length){
      var sec = document.getElementById('gallery');
      if (sec) sec.style.display = 'none';
      return;
    }
    lbPhotos = photos;
    dotsWrap.innerHTML = '';
    thumbs.innerHTML = '';
    var current = 0;

    function setActive(i, instant){
      i = (i + photos.length) % photos.length;
      current = i;
      var apply = function(){
        photoEl.src = photos[i].src;
        photoEl.alt = photos[i].caption || '';
        featured.classList.remove('is-fading');
      };
      if (instant){ apply(); }
      else {
        featured.classList.add('is-fading');
        setTimeout(apply, 200);
      }
      dotsWrap.querySelectorAll('.gallery-dot').forEach(function(d,k){ d.classList.toggle('is-active', k===i); });
      thumbs.querySelectorAll('.gallery-thumb').forEach(function(t,k){
        var on = k===i; t.classList.toggle('is-active', on);
        /* Skip on the initial (instant) call — scrollIntoView there drags the
           whole page down to the gallery before the hero is even shown. */
        if (on && !instant) t.scrollIntoView({ inline:'center', block:'nearest' });
      });
    }

    photos.forEach(function(photo, i){
      var dot = document.createElement('button');
      dot.className = 'gallery-dot' + (i===0 ? ' is-active' : '');
      dot.setAttribute('role','tab');
      dot.setAttribute('aria-label','Photo '+(i+1));
      dot.addEventListener('click', function(){ setActive(i); });
      dotsWrap.appendChild(dot);

      var thumb = document.createElement('div');
      thumb.className = 'gallery-thumb' + (i===0 ? ' is-active' : '');
      thumb.setAttribute('role','listitem');
      thumb.setAttribute('aria-label','Show photo '+(i+1));
      thumb.innerHTML =
        '<img class="gallery-thumb-photo" src="'+photo.src+'" alt="" decoding="async" loading="lazy">'+
        '<img class="gallery-thumb-art" src="'+GAL_FRAME+'" alt="" aria-hidden="true" decoding="async">';
      thumb.addEventListener('click', function(){ setActive(i); });
      thumbs.appendChild(thumb);
    });

    setActive(0, true);

    /* Prev / next arrows — change photo without opening the lightbox */
    var prevBtn = document.getElementById('galleryPrev');
    var nextBtn = document.getElementById('galleryNext');
    featured.classList.toggle('single', photos.length < 2);
    if (prevBtn) prevBtn.addEventListener('click', function(e){ e.stopPropagation(); setActive(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function(e){ e.stopPropagation(); setActive(current + 1); });

    featured.addEventListener('click', function(){ openLightbox(current); });
    featured.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openLightbox(current); }
    });

    wireLightbox();
  }

  function openLightbox(i){
    var lb = document.getElementById('galleryLightbox');
    if (!lb) return;
    lbIndex = i;
    lb.hidden = false;
    lb.classList.toggle('single', lbPhotos.length === 1);
    document.body.style.overflow = 'hidden';
    showLbPhoto(lbIndex);
  }
  function closeLightbox(){
    var lb = document.getElementById('galleryLightbox');
    if (!lb) return;
    lb.hidden = true;
    document.body.style.overflow = '';
  }
  function showLbPhoto(i){
    var p = lbPhotos[i]; if (!p) return;
    var img = document.getElementById('galleryLbImg');
    var cap = document.getElementById('galleryLbCaption');
    img.style.opacity = '0'; img.style.transform = 'scale(.95)';
    img.src = p.src; img.alt = p.caption || '';
    if (cap) cap.textContent = p.caption || '';
    img.onload = function(){
      img.style.transition = 'opacity .3s ease, transform .4s var(--ease)';
      img.style.opacity = '1'; img.style.transform = 'scale(1)';
    };
  }
  function lbNav(d){ lbIndex = (lbIndex + d + lbPhotos.length) % lbPhotos.length; showLbPhoto(lbIndex); }

  function wireLightbox(){
    var lb = document.getElementById('galleryLightbox');
    if (!lb || lb.dataset.wired) return;
    lb.dataset.wired = '1';
    document.getElementById('galleryLbClose').addEventListener('click', closeLightbox);
    document.getElementById('galleryLbPrev').addEventListener('click', function(){ lbNav(-1); });
    document.getElementById('galleryLbNext').addEventListener('click', function(){ lbNav(1); });
    lb.addEventListener('click', function(e){ if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', function(e){
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') lbNav(-1);
      else if (e.key === 'ArrowRight') lbNav(1);
    });
  }

  /* ═══════════════════════════════════════════════════════════
     RSVP — reveal, placeholder starfield, calendar links
  ═══════════════════════════════════════════════════════════ */
  var RSVP_DEMO = {
    title:'Aarav & Meera’s Wedding',
    start:'20261213T040000Z', end:'20261213T070000Z',
    location:'The Oberoi Udaivilas, Udaipur, Rajasthan, India',
    description:'Join us for the wedding of Aarav & Meera.'
  };

  function buildGCal(e){
    var p = new URLSearchParams({
      action:'TEMPLATE', text:e.title, dates:e.start+'/'+e.end,
      location:e.location, details:e.description
    });
    return 'https://calendar.google.com/calendar/render?' + p.toString();
  }
  function buildICS(e){
    var stamp = new Date().toISOString().replace(/[-:.]/g,'').slice(0,15) + 'Z';
    return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ShaadiPath//Wedding//EN','BEGIN:VEVENT',
      'DTSTART:'+e.start,'DTEND:'+e.end,'DTSTAMP:'+stamp,'SUMMARY:'+e.title,
      'LOCATION:'+e.location,'DESCRIPTION:'+e.description,'STATUS:CONFIRMED','END:VEVENT','END:VCALENDAR'
    ].join('\r\n');
  }
  function wireCalendar(){
    var C = window.__WEDDING_CONFIG__;
    if (C && C.calendarUrls) return;   // Phase 2 wires real couple URLs
    var g = document.getElementById('rsvpGcalBtn');
    var ic = document.getElementById('rsvpIcalBtn');
    if (g) g.href = buildGCal(RSVP_DEMO);
    if (ic){
      var blob = new Blob([buildICS(RSVP_DEMO)], { type:'text/calendar' });
      ic.href = URL.createObjectURL(blob);
    }
  }

  function initRSVP(){
    wireCalendar();
    var section = document.getElementById('rsvp');
    if (!section) return;
    if ('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting){ section.classList.add('rsvp-alive'); io.unobserve(section); }
        });
      }, { threshold:.12 });
      io.observe(section);
    } else { section.classList.add('rsvp-alive'); }

    var canvas = document.getElementById('rsvpFireworks');
    if (canvas && !rmq) initFireworks(canvas);
  }

  /* Celebratory fireworks — rockets ascend then burst into coloured sparks.
     Runs only while the RSVP section is on screen. */
  function initFireworks(canvas){
    var ctx = canvas.getContext('2d');
    var W, H, raf = 0, running = false, last = 0;
    var rockets = [], sparks = [];
    var COLORS = ['#d8a957','#f5d9a0','#c4748c','#fdf6e6','#8fb4e0','#c4985a'];
    function rand(a,b){ return a + Math.random()*(b-a); }
    function scale(){ return H/700; }   /* keep motion proportional on any height */

    function resize(){ W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }

    function launch(){
      var k = scale();
      /* Rise from the palace/horizon line (~60%) and burst in the upper sky,
         so the fireworks sit in the night sky of the background, not the
         foreground terrace. */
      rockets.push({
        x: rand(W*0.16, W*0.84), y: rand(H*0.56, H*0.64),
        vx: rand(-0.4,0.4)*k, vy: rand(-9,-7)*k,
        targetY: rand(H*0.08, H*0.40),
        color: COLORS[(Math.random()*COLORS.length)|0]
      });
    }
    function burst(x,y,color){
      var n = Math.round(rand(46,74)), k = scale();
      for (var i=0;i<n;i++){
        var a = (Math.PI*2*i/n) + rand(-0.08,0.08);
        var sp = rand(1.4,5.2)*k;
        sparks.push({ x:x, y:y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp,
          life:1, decay:rand(0.009,0.016), size:rand(1.2,2.6), color:color });
      }
    }
    function frame(t){
      if (!running) return;
      var k = scale();
      /* Fade the previous frame's sparks toward TRANSPARENT (not a dark tint):
         destination-out only lowers the alpha of what's already drawn, so the
         background image shows through cleanly — no visible canvas box. */
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.24)';
      ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation = 'lighter';

      if (t - last > rand(620,1150)){ launch(); last = t; }

      for (var i=rockets.length-1;i>=0;i--){
        var r = rockets[i];
        r.x += r.vx; r.y += r.vy; r.vy += 0.12*k;
        ctx.globalAlpha = 1;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.2, 0, 6.2832); ctx.fillStyle = r.color; ctx.fill();
        if (r.vy >= 0 || r.y <= r.targetY){ burst(r.x, r.y, r.color); rockets.splice(i,1); }
      }
      for (var j=sparks.length-1;j>=0;j--){
        var p = sparks[j];
        p.x += p.vx; p.y += p.vy; p.vy += 0.045*k; p.vx *= 0.985; p.vy *= 0.985;
        p.life -= p.decay;
        if (p.life <= 0){ sparks.splice(j,1); continue; }
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.2832); ctx.fillStyle = p.color; ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', resize, { passive:true });
    var vio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting){ if (!running){ running = true; last = 0; raf = requestAnimationFrame(frame); } }
        else { running = false; cancelAnimationFrame(raf); raf = 0; }
      });
    }, { threshold:.04 });
    vio.observe(canvas.closest('.rsvp-section'));
  }

  /* ═══════════════════════════════════════════════════════════
     MEET THE COUPLE — faded-ink → colour-alive reveal (per line)
     The text is always visible in a warm faded-ink tone; as each
     element scrolls into the reading zone it fills with full colour
     through a brief soft glow. Lines light up one by one (DOM-order
     stagger). Toggles so it re-plays when the section re-enters view
     (e.g. scrolling back up from below).
  ═══════════════════════════════════════════════════════════ */
  function initStoryAlive(){
    var sec = document.getElementById('couple');
    if (!sec) return;
    var reveals = [];

    var eyebrow = sec.querySelector('.couple-eyebrow');
    var title   = sec.querySelector('.couple-title');
    if (eyebrow){ eyebrow.classList.add('cpl-alive'); reveals.push(eyebrow); }
    if (title)  { title.classList.add('cpl-alive');   reveals.push(title); }

    /* Split the story paragraph into sentence lines — each its own alive unit */
    var body = document.getElementById('coupleStory');
    if (body){
      var text = (body.textContent || '').replace(/\s+/g, ' ').trim();
      if (text){
        var parts = text.match(/[^.!?]+[.!?]*/g) || [text];
        body.textContent = '';
        parts.forEach(function(s){
          s = s.trim(); if (!s) return;
          var span = document.createElement('span');
          span.className = 'couple-story-line cpl-alive';
          span.textContent = s;
          body.appendChild(span);
          reveals.push(span);
        });
      }
    }

    if (!reveals.length) return;
    reveals.forEach(function(el, i){ el.dataset.stagger = String(i * 180); });

    if (!('IntersectionObserver' in window)){
      reveals.forEach(function(el){ el.classList.add('is-in'); });
      return;
    }
    /* Per-element observer; toggles is-in so the reveal re-plays on re-entry */
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        var el = e.target;
        if (e.isIntersecting){
          var st = parseInt(el.dataset.stagger || '0', 10);
          el._aliveT = setTimeout(function(){ el.classList.add('is-in'); }, st);
        } else {
          clearTimeout(el._aliveT);
          el.classList.remove('is-in');
        }
      });
    }, { threshold:.5, rootMargin:'0px 0px -60px 0px' });
    reveals.forEach(function(el){ io.observe(el); });
  }

  /* ═══════════════════════════════════════════════════════════
     PHASE 2 — patch text DOM from __WEDDING_CONFIG__
  ═══════════════════════════════════════════════════════════ */
  function applyConfigPhase2(){
    var C = window.__WEDDING_CONFIG__;
    if (!C) return;
    var couple = C.couple || {}, invite = C.invite || {}, music = C.music || {};
    var story = C.story || {}, gallery = C.gallery || {}, rsvp = C.rsvp || {};

    var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function fmtLong(iso){
      if (!iso) return '';
      var p = iso.split('-');
      return parseInt(p[2],10)+' '+(MONTHS[parseInt(p[1],10)-1]||'')+' '+p[0];
    }
    /* Hero uses the short month form ("12 Dec 2026") */
    function fmtShort(iso){
      if (!iso) return '';
      var p = iso.split('-');
      return parseInt(p[2],10)+' '+(MONTHS_SHORT[parseInt(p[1],10)-1]||'')+' '+p[0];
    }
    function setText(id, txt){ var el = document.getElementById(id); if (el && txt) el.textContent = txt; }
    /* Dates render with an ordinal superscript (1st / 2nd / 3rd / 12th …) */
    function setDate(id, txt){ var el = document.getElementById(id); if (el && txt) el.innerHTML = ordinalDate(txt); }

    if (couple.bride && couple.groom) document.title = couple.bride+' & '+couple.groom+' · ShaadiPath';

    /* Hero + invite names */
    setText('heroBride', couple.bride);
    setText('heroGroom', couple.groom);
    if (couple.bride && couple.groom){
      var inv = document.getElementById('inviteNames');
      if (inv){
        /* The preview pipeline swaps couple names (bride/groom switch) and parent
           slots (parents-order switch) independently. Recover each person's TRUE
           name + own family so the inline card always pairs a name with its own
           parents and the right D/O (bride) / S/O (groom) prefix, in chosen order. */
        var nameGroomFirst = couple.nameOrder === 'groom_first';
        var parentsGroomFirst = invite.parentsOrder === 'groom_first';
        var trueBrideName = nameGroomFirst ? (couple._originalBride || couple.groom) : couple.bride;
        var trueGroomName = nameGroomFirst ? (couple._originalGroom || couple.bride) : couple.groom;
        var trueBrideParents = (parentsGroomFirst ? [invite.groomFather, invite.groomMother] : [invite.brideFather, invite.brideMother]).filter(Boolean).join(' & ');
        var trueGroomParents = (parentsGroomFirst ? [invite.brideFather, invite.brideMother] : [invite.groomFather, invite.groomMother]).filter(Boolean).join(' & ');
        function invPerson(name, parents, rel){
          var par = parents ? '<span class="invite-parent">('+rel+' '+parents+')</span>' : '';
          return '<span class="invite-person"><span class="invite-name">'+name+'</span>'+par+'</span>';
        }
        var brideBlock = invPerson(trueBrideName, trueBrideParents, 'D/O');
        var groomBlock = invPerson(trueGroomName, trueGroomParents, 'S/O');
        var amp = '<span class="invite-amp" aria-hidden="true">&amp;</span>';
        inv.innerHTML = nameGroomFirst ? (groomBlock + amp + brideBlock) : (brideBlock + amp + groomBlock);
      }
    }
    /* Dates / venues */
    if (couple.date){ setDate('heroDate', fmtShort(couple.date)); setDate('inviteDate', fmtLong(couple.date)); }
    setText('heroVenue', couple.venue);
    setText('inviteVenue', couple.venue);

    /* Footer names + date */
    setText('ftBride', couple.bride);
    setText('ftGroom', couple.groom);
    if (couple.date) setDate('ftDate', fmtLong(couple.date));

    /* Invite — blessing overline */
    if (invite.blessing){
      var ov = document.querySelector('.invite-overline');
      if (ov) ov.textContent = invite.blessing.split('\n')[0];
    }

    /* Invite — grandparents */
    var gp = document.getElementById('inviteGrandparents');
    if (gp && invite.showGrandparents){
      var b = [invite.brideGF, invite.brideGM].filter(Boolean).join(' & ');
      var g = [invite.groomGF, invite.groomGM].filter(Boolean).join(' & ');
      if (b || g){
        gp.innerHTML = (b ? '<p>'+b+'</p>' : '') + (g ? '<p>'+g+'</p>' : '');
        gp.hidden = false;
      }
    }

    /* Invite parents are now rendered inline under each name (see above). */

    /* ── Meet the Couple — hide if story disabled ── */
    if (story.show === false){
      var cplSec = document.getElementById('couple');
      if (cplSec) cplSec.style.display = 'none';
    }

    /* ── Story body / tags (respect storyMode) ── */
    var storyMode = story.storyMode || 'tags';
    var storyBody = document.getElementById('coupleStory');
    var tagsWrap = document.getElementById('coupleTags');
    if (storyMode === 'story'){
      if (storyBody && story.storyText) storyBody.textContent = story.storyText;
    } else if (story.tags && story.tags.length){
      if (storyBody) storyBody.textContent = '';
      if (tagsWrap){
        tagsWrap.setAttribute('aria-hidden','false');
        story.tags.forEach(function(tag){
          var chip = document.createElement('span');
          chip.className = 'couple-tag-chip'; chip.textContent = tag;
          tagsWrap.appendChild(chip);
        });
      }
    }
    /* Story hashtag */
    var htagEl = document.getElementById('coupleHashtag');
    if (htagEl){
      var htag = (story.customHashtag || couple.hashtag || '').trim();
      if (htag){
        if (htag.charAt(0) !== '#') htag = '#' + htag;
        htagEl.textContent = htag; htagEl.removeAttribute('hidden');
      }
    }

    /* ── Gallery — hide if disabled ── */
    if (!gallery.show || gallery.layout === 'skip'){
      var galSec = document.getElementById('gallery');
      if (galSec) galSec.style.display = 'none';
    }

    /* ── RSVP — headline / body / CTA ── */
    setText('rsvpHeadline', rsvp.heading);
    setText('rsvpBody', rsvp.subtext);
    var rsvpBtn = document.getElementById('rsvpBtn');
    var rsvpBtnText = document.getElementById('rsvpBtnText');
    var rsvpHelper = document.getElementById('rsvpHelper');
    if (rsvpBtn){
      if (rsvp.mode === 'form' && rsvp.form_url){
        rsvpBtn.href = rsvp.form_url; rsvpBtn.setAttribute('target','_blank');
        if (rsvpHelper) rsvpHelper.textContent = "You'll be redirected to our RSVP form.";
      } else {
        var ph = (couple.whatsapp || '').replace(/\D/g,'');
        if (ph){
          var full = ph.indexOf('91') === 0 ? ph : '91' + ph;
          var msg = encodeURIComponent('Hi ' + (couple.bride||'') + ' & ' + (couple.groom||'') + "! I'll be there to celebrate with you!");
          rsvpBtn.href = 'https://wa.me/' + full + '?text=' + msg;
        }
        if (rsvpHelper) rsvpHelper.textContent = "You'll be redirected to WhatsApp to confirm your attendance.";
      }
      var label = rsvp.mode === 'form' ? (rsvp.button_text || rsvp.btnText) : rsvp.btnText;
      if (rsvpBtnText && label) rsvpBtnText.textContent = label;
    }

    /* ── Calendar links from the pipeline ── */
    if (C.calendarUrls){
      var gcal = document.getElementById('rsvpGcalBtn');
      var ical = document.getElementById('rsvpIcalBtn');
      if (gcal) gcal.href = C.calendarUrls.google;
      if (ical){
        var dl = ((couple.bride||'bride')+'-'+(couple.groom||'groom')+'-wedding.ics').toLowerCase().replace(/\s+/g,'-');
        var d = (couple.date||'').replace(/-/g,'');
        if (d){
          var end = new Date(couple.date); end.setDate(end.getDate()+1);
          var de = end.toISOString().slice(0,10).replace(/-/g,'');
          var body = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ShaadiPath//Wedding//EN','BEGIN:VEVENT',
            'DTSTART;VALUE=DATE:'+d,'DTEND;VALUE=DATE:'+de,
            'SUMMARY:'+((couple.bride||'Bride')+' weds '+(couple.groom||'Groom')),
            'LOCATION:'+(couple.venue||''),'STATUS:CONFIRMED','END:VEVENT','END:VCALENDAR'].join('\r\n');
          ical.href = URL.createObjectURL(new Blob([body], { type:'text/calendar;charset=utf-8' }));
        } else { ical.href = C.calendarUrls.apple; }
        ical.setAttribute('download', dl);
      }
    }

    /* Music */
    var audio = document.getElementById('bgMusic');
    if (audio && music.enabled && music.src) audio.src = music.src;
  }

  /* ═══════════════════════════════════════════════════════════
     MUSIC (only surfaces when a track exists)
  ═══════════════════════════════════════════════════════════ */
  function startMusic(){
    var audio = document.getElementById('bgMusic');
    if (!audio || !audio.getAttribute('src')) return;
    try {
      audio.volume = 0;
      var pr = audio.play();
      var step = 0, target = 0.6;
      var t = setInterval(function(){
        step++; audio.volume = Math.min(target, (step/30)*target);
        if (audio.volume >= target) clearInterval(t);
      }, 100);
      if (pr && pr.catch) pr.catch(function(){});
    } catch(_){}
  }

  /* ═══════════════════════════════════════════════════════════
     FLOATING CONTROLS — music toggle + section navigation
  ═══════════════════════════════════════════════════════════ */
  function showControls(){
    var c = document.getElementById('fabCluster');
    if (c) c.classList.add('is-ready');
  }

  function initControls(){
    var cluster  = document.getElementById('fabCluster');
    var musicBtn = document.getElementById('musicToggle');
    var navBtn   = document.getElementById('navToggle');
    var navPanel = document.getElementById('navPanel');
    var audio    = document.getElementById('bgMusic');
    if (!cluster) return;

    /* ── Music mute / unmute ── */
    function syncMusic(){
      if (!musicBtn || !audio) return;
      var playing = !audio.paused;
      musicBtn.classList.toggle('is-muted', !playing);
      musicBtn.setAttribute('aria-pressed', String(playing));
      musicBtn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    }
    if (musicBtn && audio){
      musicBtn.addEventListener('click', function(){
        if (audio.paused){
          audio.muted = false;
          if (!audio.volume) audio.volume = 0.6;
          var pr = audio.play(); if (pr && pr.catch) pr.catch(function(){});
        } else {
          audio.pause();
        }
        syncMusic();
      });
      ['play','pause','ended'].forEach(function(ev){ audio.addEventListener(ev, syncMusic); });
      syncMusic();

      /* ── Pause when the guest leaves/backgrounds the page; resume on return.
         Browsers keep background <audio> playing after the tab is hidden, so
         guests hear music after "leaving". _awayPaused tracks only auto-pauses,
         so a manual pause is never overridden on return. ── */
      var _awayPaused = false;
      function _pauseForAway(){ if (audio && !audio.paused){ _awayPaused = true; audio.pause(); } }
      function _resumeOnReturn(){ if (audio && _awayPaused && audio.paused){ _awayPaused = false; var pr = audio.play(); if (pr && pr.catch) pr.catch(function(){}); } }
      document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') _pauseForAway(); else _resumeOnReturn(); });
      window.addEventListener('pagehide', _pauseForAway); // Safari/iOS often skip visibilitychange
      window.addEventListener('pageshow', _resumeOnReturn);
      window.addEventListener('blur', _pauseForAway);
      window.addEventListener('focus', _resumeOnReturn);
    }

    /* ── Section navigation ── */
    if (navBtn && navPanel){
      function closeNav(){
        cluster.classList.remove('nav-open');
        navBtn.setAttribute('aria-expanded', 'false');
        navPanel.setAttribute('aria-hidden', 'true');
      }
      navBtn.addEventListener('click', function(e){
        e.stopPropagation();
        var open = cluster.classList.toggle('nav-open');
        navBtn.setAttribute('aria-expanded', String(open));
        navPanel.setAttribute('aria-hidden', String(!open));
      });
      navPanel.querySelectorAll('.nav-link').forEach(function(a){
        a.addEventListener('click', closeNav);
      });
      document.addEventListener('click', function(e){
        if (cluster.classList.contains('nav-open') && !cluster.contains(e.target)) closeNav();
      });
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && cluster.classList.contains('nav-open')) closeNav();
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════
     HERO VIDEO — play whenever the hero section is in view,
     pause when it scrolls out (saves battery, always fresh on return)
  ═══════════════════════════════════════════════════════════ */
  function initHeroVideo(){
    var v   = document.getElementById('heroVideo');
    var sec = document.getElementById('hero');
    if (!v || !sec) return;
    function play(){ try { var p = v.play(); if (p && p.catch) p.catch(function(){}); } catch(_){} }
    if (!('IntersectionObserver' in window)){ play(); return; }
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) play();
        else { try { v.pause(); } catch(_){} }
      });
    }, { threshold:.15 });
    io.observe(sec);
  }

  /* ═══════════════════════════════════════════════════════════
     COUNTDOWN — live tick to the wedding date, digits in the plaques
  ═══════════════════════════════════════════════════════════ */
  function initCountdown(){
    var C = window.__WEDDING_CONFIG__ || {};
    var iso = (C.couple && C.couple.date) || '2026-12-12';
    /* Count to a late-morning muhurat on the wedding day */
    var target = new Date(iso + 'T11:00:00');
    if (isNaN(target.getTime())) target = new Date(iso);

    var els = {
      d: document.getElementById('cdDays'),
      h: document.getElementById('cdHours'),
      m: document.getElementById('cdMins'),
      s: document.getElementById('cdSecs')
    };
    if (!els.d) return;

    var prev = {};
    function pad(n){ n = n < 0 ? 0 : n | 0; return n < 10 ? '0' + n : '' + n; }
    function set(el, key, val){
      if (!el) return;
      var v = pad(val);
      if (el.textContent === v) return;
      el.textContent = v;
      if (prev[key] !== undefined && !rmq){    /* skip the very first paint */
        el.classList.remove('is-tick'); void el.offsetWidth; el.classList.add('is-tick');
      }
      prev[key] = v;
    }
    function tick(){
      var diff = Math.max(0, target.getTime() - Date.now());
      var s = Math.floor(diff / 1000);
      set(els.d, 'd', Math.floor(s / 86400));
      set(els.h, 'h', Math.floor((s % 86400) / 3600));
      set(els.m, 'm', Math.floor((s % 3600) / 60));
      set(els.s, 's', s % 60);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ─────────────────────────────────────  BOOT  ───────────────────────────────────── */
  function boot(){
    applyConfigPhase2();
    renderEvents();
    renderGallery();
    renderTTK();
    initRSVP();
    initStoryAlive();
    initControls();
    initHeroVideo();
    initCountdown();
    if (introDone){ initReveals(); showControls(); }   // reduced-motion path already revealed
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
