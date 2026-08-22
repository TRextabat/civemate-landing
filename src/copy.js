// All user-facing copy, keyed by locale. The page is prerendered once per
// locale at build time (scripts/prerender.mjs), so this never ships as runtime
// translation machinery — each language is a separate static HTML file.
//
// Turkish is the launch market (Istanbul first), so tr is written as native
// marketing copy rather than a literal translation of en.

export const LOCALES = ['en', 'tr']

// Metadata only — never rendered into the interface. Consumed by
// scripts/head.mjs for the JSON-LD `keywords`/`about` fields and the (legacy,
// largely ignored) keywords meta tag.
//
// Caveat worth remembering: Google has ignored <meta name="keywords"> since
// 2009, and no search engine ranks a page for a term that appears only in
// metadata. These help an engine that already has the page classify it
// correctly — they do not make the page rank for terms it never mentions.
export const keywords = {
  en: [
    'cultural activities', 'events near me', 'what to do tonight',
    'concert', 'live music', 'gig', 'theatre', 'play', 'performance',
    'cinema', 'film screening', 'exhibition', 'gallery opening',
    'poetry reading', 'book reading', 'workshop', 'art class',
    'dance', 'stand-up comedy', 'open mic', 'jam session', 'rehearsal',
    'street performance', 'busking', 'festival',
    'Istanbul events', 'Kadıköy', 'Moda', 'things to do in Istanbul',
    'free events Istanbul', 'meet people at events', 'go to a concert with someone',
    'find a bassist', 'find a photographer', 'find collaborators', 'open roles',
  ],
  tr: [
    'kültürel etkinlikler', 'yakınımdaki etkinlikler', 'bu akşam ne yapsam',
    'konser', 'canlı müzik', 'tiyatro', 'oyun', 'performans',
    'sinema', 'film gösterimi', 'sergi', 'galeri açılışı',
    'şiir okuma', 'kitap okuma', 'atölye', 'sanat kursu',
    'dans', 'stand-up', 'açık mikrofon', 'jam', 'prova',
    'sokak performansı', 'sokak müzisyeni', 'festival',
    'İstanbul etkinlik', 'Kadıköy', 'Moda', 'İstanbul’da ne yapılır',
    'ücretsiz etkinlik İstanbul', 'etkinlikte insanlarla tanışmak',
    'birlikte konsere gidecek arkadaş', 'basçı arıyorum', 'fotoğrafçı arıyorum',
    'grup arkadaşı arıyorum', 'açık roller',
  ],
}

export const meta = {
  en: {
    lang: 'en',
    path: '/',
    title: "CiveMate — Your city's cultural life on a live map",
    description:
      "CiveMate puts a city's cultural life on a live map. Find concerts, readings, workshops and street performances near you, open a role for the collaborator you're missing, or go with a +1. Starting in Istanbul, open to every city.",
    ogLocale: 'en_US',
    ogTitle: "CiveMate — Your city's cultural life on a live map",
    ogDescription:
      'Put a set, rehearsal, workshop or performance on the live map. Find collaborators and an audience. No stage required.',
    ogImageAlt: 'CiveMate — a risograph city map with cultural activity pins.',
  },
  tr: {
    lang: 'tr',
    path: '/tr',
    title: 'CiveMate — Şehrinin kültür hayatı canlı haritada',
    description:
      "CiveMate şehrinin kültür hayatını canlı haritaya taşır. Yakınındaki konserleri, okumaları, atölyeleri ve sokak performanslarını keşfet, eksik kaldığın rol için çağrı aç ya da +1'inle git. İstanbul'da başlıyor, her şehre açık.",
    ogLocale: 'tr_TR',
    ogTitle: 'CiveMate — Şehrinin kültür hayatı canlı haritada',
    ogDescription:
      'Setini, provanı, atölyeni ya da performansını canlı haritaya ekle. Birlikte üretecek insanları ve seyircini bul. Sahne gerekmez.',
    ogImageAlt: 'CiveMate — rizograf şehir haritası ve kültür etkinliği iğneleri.',
  },
}

export const copy = {
  en: {
    logoAria: 'CiveMate home',
    nav: {
      aria: 'Main navigation',
      toggle: 'Toggle navigation',
      how: 'How it works',
      creators: 'For creators',
      inside: 'Inside the app',
      cta: 'Join the demo waitlist',
      langAria: 'Language',
    },
    map: {
      aria: 'Illustrated map of cultural activities in Istanbul',
      imageAlt: 'Real street, coastline, park and building map of Kadıköy, Istanbul',
      live: 'LIVE / İSTANBUL',
      nearby: (n) => `${n} ACTIVITIES NEARBY`,
      show: (t) => `Show ${t}`,
      view: 'View activity',
      more: 'More nearby activities',
      stamp: ['NO', 'STAGE', 'REQUIRED'],
      attribution: 'Preview · sample activities · Real Istanbul map · © OpenStreetMap contributors',
      depth: 'CULTURE / IN REAL SPACE',
    },
    activities: [
      { title: 'Rooftop acoustic night', meta: 'Moda · Tonight, 20:30', type: 'Music · +1 open', people: '18 going' },
      { title: 'One-act play reading', meta: 'Yeldeğirmeni · Fri, 19:00', type: 'Theatre · +1 open', people: '8 going' },
      { title: 'Street sketch circle', meta: 'Caferağa · Sat, 14:00', type: 'Visual art', people: '12 going' },
      { title: 'Bassist wanted', meta: 'Osmanağa · This week', type: 'Open collaborator role', people: '1 role open' },
      { title: 'Seaside set — live now', meta: 'Moda Sahili · Happening now', type: 'Street performance · Audience welcome', people: 'Come listen' },
    ],
    hero: {
      edition: 'ISTANBUL · FIRST EDITION · 2026',
      line1: 'YOUR CITY',
      line2: 'HAS A ',
      highlight: 'CULTURAL',
      line3: 'PULSE.',
      lede: 'CiveMate turns cultural ideas into real-world activity. Put a set, rehearsal, workshop, or performance on the live map; find collaborators and an audience; then keep the memory, credit, and community that follow.',
      primary: 'Get an early demo',
      secondary: 'See what the app does',
      microcopy: 'Starting in Istanbul, open to every city · For creators, culture lovers, and curious neighbors',
    },
    ticker: {
      aria: 'CiveMate capabilities',
      items: ['HAPPENING NOW', 'OPEN CREATIVE ROLES', '+1 BUDDY MODE', 'MEMORY PAGES', 'CULTURAL COMMUNITIES'],
    },
    problem: {
      label: 'WHY CIVEMATE',
      h2a: 'CULTURAL LIFE IS EVERYWHERE.',
      h2b: 'AND INVISIBLE.',
      body: 'Jam sessions hide in group chats. Readings vanish from stories. A rehearsal needs one more person. A theatre seat stays empty because someone doesn’t want to go alone.',
      quote: 'How was I supposed to know about that?',
    },
    features: {
      label: 'INSIDE THE APP',
      h2a: 'FROM “WHAT’S ON?”',
      h2b: 'TO “I’M IN.”',
      cards: [
        { eyebrow: 'DISCOVER', title: 'See the city come alive.', body: 'Open one map for planned shows, spontaneous sessions, workshops, readings, and everything in between.' },
        { eyebrow: 'COLLABORATE', title: 'Find the missing person.', body: 'Create an activity, open a named role, and meet the bassist, photographer, dancer, or maker who completes it.' },
        { eyebrow: '+1 BUDDY MODE', title: 'Go together, not alone.', body: 'Filter for +1-open activities, connect with someone already going, and let the event break the ice.' },
      ],
    },
    street: {
      label: 'FOR STREET ARTISTS',
      h2a: 'THE STREET',
      h2b: 'IS A ',
      h2c: 'STAGE.',
      body: 'Playing by the water tonight? Mark the set “happening now,” appear on the live map, welcome nearby listeners, or open a role for another musician or photographer.',
      imageAlt: 'Street musician playing an acoustic set beside the Istanbul waterfront',
      badge: 'LIVE · MODA SAHİLİ',
      flowAria: 'Street artist journey',
      flow: ['Go live', 'Gather a crowd', 'Find your people', 'Keep the credit'],
    },
    journey: {
      label: 'ONE ACTIVITY · MANY PATHS',
      h2a: 'MAKE A NIGHT',
      h2b: 'HAPPEN.',
      body: 'Every journey meets at an activity: someone starts it, someone fills the missing role, someone comes with a new friend, and everyone leaves with a shared memory.',
      steps: [
        { title: 'CREATE', body: 'Put an idea on the map and open the roles you need.' },
        { title: 'CONNECT', body: 'Approve collaborators and welcome visitors or buddies.' },
        { title: 'SHOW UP', body: 'Meet in the real world. Make, watch, listen, join.' },
        { title: 'REMEMBER', body: 'Keep photos, conversation, and activity credits together.' },
      ],
    },
    afterlife: {
      label: 'AFTER THE ACTIVITY',
      h2a: 'THE NIGHT ENDS.',
      h2b: 'THE CONNECTION DOESN’T.',
      body: 'CiveMate keeps the value of showing up alive—so one activity can become a body of work, a circle of people, and the beginning of the next idea.',
      rows: [
        { title: 'Shared memory', body: 'Photos, video, comments, ratings, and everyone’s contribution live on one activity page.' },
        { title: 'Portfolio credit', body: 'Creators turn real participation into a curated record of what they made and who they made it with.' },
        { title: 'Stay connected', body: 'Follow people, share posts and stories, continue in DMs or group chat, and send the next invitation.' },
        { title: 'Build community', body: 'Interest, neighborhood, and creator communities make it easier for the next activity to begin.' },
      ],
      institutionLabel: 'VENUES + INSTITUTIONS',
      institutionBody: 'Theatres, galleries, and cultural centres join the same map with verified profiles, team tools, and attendance insight.',
    },
    waitlist: {
      label: 'DEMO WAITLIST · OPEN TO EVERY CITY',
      h2a: 'HELP US',
      h2b: 'PUT THE FIRST',
      h2c: 'PINS ON THE MAP.',
      body: 'Join the early demo list. We’ll invite a small group of creators and culture explorers to see CiveMate, try the core flows, and help shape the first neighborhood launch.',
      promise: 'Demo invitations only. No endless newsletter.',
      formNumber: 'NO. 001 / EARLY ACCESS',
      nameLabel: 'Your name',
      namePlaceholder: 'How should we call you?',
      emailLabel: 'Email address',
      emailPlaceholder: 'you@example.com',
      cityLabel: 'Your city',
      cityPlaceholder: 'Anywhere in the world',
      roleLabel: 'I’m joining as',
      roles: ['Culture explorer', 'Artist or creator', 'Collective or community', 'Venue or institution'],
      submit: 'Join the demo waitlist',
      submitting: 'Adding your pin…',
      note: 'By joining, you agree to receive emails about the CiveMate demo. Unsubscribe anytime.',
      error: 'Add your name and a valid email so we know where to send the demo invite.',
      networkError: 'The list could not be reached. Please try again in a moment.',
      successBadge: 'YOU’RE ON THE MAP',
      successTitle: (n) => `Thanks, ${n}.`,
      successBodyPre: 'We’ll use ',
      successBodyPost: ' for your CiveMate demo invitation.',
    },
    // Questions are phrased the way people actually search, not the way a
    // brand would introduce itself — this is the only section on the page that
    // targets intent ("what's on tonight") rather than the brand name. Also
    // the visible counterpart the FAQPage structured data is required to match.
    faq: {
      label: 'QUESTIONS',
      h2a: 'WHAT PEOPLE',
      h2b: 'ASK US.',
      items: [
        {
          q: 'What is CiveMate?',
          a: "CiveMate is a cultural activities platform that puts your city's cultural life on one live map. You will be able to see concerts, theatre, readings, workshops and street performances happening near you, create your own activity, and find the collaborators or company you need to make it happen. CiveMate is not public yet — the map on this page shows sample activities, and we are inviting a small early group to try the real thing first.",
        },
        {
          q: "How do I find out what's happening in Istanbul tonight?",
          a: 'Open the map and you see what is on near you right now — planned shows for tonight and this week, plus spontaneous sessions marked “happening now” while they are still going. No scrolling through group chats or event pages that were last updated in March.',
        },
        {
          q: 'Where can I find concerts, theatre and workshops in Istanbul?',
          a: 'All of them sit on the same map — live music, one-act play readings, poetry and book readings, sketch circles, art workshops, exhibitions and street performances. CiveMate starts in Istanbul, on both sides of the city, and the map is not limited to one neighbourhood.',
        },
        {
          q: "I'm not in Istanbul. Can I still use CiveMate?",
          a: 'Yes — join the early list from anywhere. CiveMate is not built for one city; it is built for whichever city you are standing in. Istanbul is simply where the first pins go, because that is where we can be on the ground. Tell us your city when you sign up and it helps decide where the map opens next.',
        },
        {
          q: 'Does it cost anything to join an activity?',
          a: 'No. Activities on CiveMate are always free to join, and CiveMate does not sell tickets.',
        },
        {
          q: "I don't want to go to an event alone. What can I do?",
          a: 'Use +1 buddy mode. Filter for activities where someone is open to bringing a companion, connect with a person who is already going, and let the event itself break the ice. An empty seat next to you stops being a reason to stay home.',
        },
        {
          q: 'How do I find a bassist, photographer or collaborator in Istanbul?',
          a: 'Create an activity and open a named role — a bassist, a photographer, a dancer, a maker. People nearby can apply to fill it, you approve who joins, and everyone’s contribution is credited on the activity page afterwards.',
        },
        {
          q: "I'm a street musician. How do I get an audience?",
          a: 'Mark your set “happening now” and you appear on the live map while you are playing, so people nearby can find you. You can also open a role if you want another musician or a photographer to join you.',
        },
        {
          q: 'Can venues, theatres and cultural institutions use CiveMate?',
          a: 'Yes. Theatres, galleries and cultural centres join the same map with verified profiles, team tools and attendance insight, so their programme sits alongside everything else happening in the neighbourhood.',
        },
      ],
    },
    footer: {
      tagline: 'Sahne gerekmez. No stage required.',
      rights: '© 2026 CiveMate',
    },
  },

  tr: {
    logoAria: 'CiveMate ana sayfa',
    nav: {
      aria: 'Ana gezinme',
      toggle: 'Menüyü aç/kapat',
      how: 'Nasıl çalışır',
      creators: 'Üretenler için',
      inside: 'Uygulamada ne var',
      cta: 'Demo listesine katıl',
      langAria: 'Dil',
    },
    map: {
      aria: 'İstanbul’daki kültür etkinliklerinin çizimli haritası',
      imageAlt: 'İstanbul, Kadıköy’ün sokak, sahil, park ve bina haritası',
      live: 'CANLI / İSTANBUL',
      nearby: (n) => `YAKINDA ${n} ETKİNLİK`,
      show: (t) => `${t} etkinliğini göster`,
      view: 'Etkinliğe git',
      more: 'Yakındaki diğer etkinlikler',
      stamp: ['SAHNE', 'GEREK', 'MEZ'],
      attribution: 'Önizleme · örnek etkinlikler · Gerçek İstanbul haritası · © OpenStreetMap katkıda bulunanlar',
      depth: 'KÜLTÜR / GERÇEK MEKÂNDA',
    },
    activities: [
      { title: 'Çatıda akustik gece', meta: 'Moda · Bu akşam 20.30', type: 'Müzik · +1 açık', people: '18 kişi gidiyor' },
      { title: 'Tek perdelik oyun okuması', meta: 'Yeldeğirmeni · Cuma 19.00', type: 'Tiyatro · +1 açık', people: '8 kişi gidiyor' },
      { title: 'Sokakta çizim halkası', meta: 'Caferağa · Cmt 14.00', type: 'Görsel sanat', people: '12 kişi gidiyor' },
      { title: 'Basçı aranıyor', meta: 'Osmanağa · Bu hafta', type: 'Açık üretici rolü', people: '1 rol açık' },
      { title: 'Sahilde set — şimdi canlı', meta: 'Moda Sahili · Şu anda oluyor', type: 'Sokak performansı · Dinleyici bekleniyor', people: 'Gel, dinle' },
    ],
    hero: {
      edition: 'İSTANBUL · İLK BASKI · 2026',
      line1: 'ŞEHRİNİN',
      line2: '',
      highlight: 'KÜLTÜR',
      line3: 'NABZI ATIYOR.',
      lede: 'CiveMate kültürel fikirleri gerçek buluşmalara dönüştürür. Setini, provanı, atölyeni ya da performansını canlı haritaya ekle; birlikte üretecek insanları ve seyircini bul; geriye kalan anıyı, emeği ve topluluğu sakla.',
      primary: 'Erken demo al',
      secondary: 'Uygulama ne yapıyor',
      microcopy: 'İstanbul’da başlıyor, her şehre açık · Üretenler, kültür sevenler ve meraklı komşular için',
    },
    ticker: {
      aria: 'CiveMate özellikleri',
      items: ['ŞİMDİ OLUYOR', 'AÇIK ÜRETİCİ ROLLERİ', '+1 MODU', 'ANI SAYFALARI', 'KÜLTÜR TOPLULUKLARI'],
    },
    problem: {
      label: 'NEDEN CIVEMATE',
      h2a: 'KÜLTÜR HER YERDE.',
      h2b: 'VE GÖRÜNMEZ.',
      body: 'Jam’ler grup sohbetlerinde kalıyor. Okumalar hikâyelerden siliniyor. Bir provaya tek kişi eksik. Biri yalnız gitmek istemediği için tiyatro koltuğu boş kalıyor.',
      quote: 'Bunu nereden bilecektim?',
    },
    features: {
      label: 'UYGULAMANIN İÇİ',
      h2a: '“NE VAR NE YOK?”TAN',
      h2b: '“BEN VARIM”A.',
      cards: [
        { eyebrow: 'KEŞFET', title: 'Şehir canlanırken gör.', body: 'Planlanmış konserler, anlık sessionlar, atölyeler, okumalar ve arasındaki her şey için tek bir harita aç.' },
        { eyebrow: 'BİRLİKTE ÜRET', title: 'Eksik kişiyi bul.', body: 'Bir etkinlik oluştur, adı konmuş bir rol aç ve onu tamamlayacak basçıyla, fotoğrafçıyla, dansçıyla ya da üreticiyle tanış.' },
        { eyebrow: '+1 MODU', title: 'Yalnız değil, birlikte git.', body: '+1’e açık etkinlikleri filtrele, zaten gidecek biriyle tanış ve buzları etkinlik kırsın.' },
      ],
    },
    street: {
      label: 'SOKAK SANATÇILARI İÇİN',
      h2a: 'SOKAK',
      h2b: 'BİR ',
      h2c: 'SAHNEDİR.',
      body: 'Bu akşam sahilde mi çalıyorsun? Setini “şimdi oluyor” diye işaretle, canlı haritada görün, yakındaki dinleyicileri çağır ya da başka bir müzisyen veya fotoğrafçı için rol aç.',
      imageAlt: 'İstanbul sahilinde akustik set çalan sokak müzisyeni',
      badge: 'CANLI · MODA SAHİLİ',
      flowAria: 'Sokak sanatçısı yolculuğu',
      flow: ['Yayına geç', 'Kalabalığını topla', 'İnsanını bul', 'Emeğin sende kalsın'],
    },
    journey: {
      label: 'TEK ETKİNLİK · ÇOK YOL',
      h2a: 'BİR GECEYİ',
      h2b: 'SEN BAŞLAT.',
      body: 'Her yol bir etkinlikte buluşur: biri başlatır, biri eksik rolü doldurur, biri yeni bir arkadaşıyla gelir ve herkes ortak bir anıyla ayrılır.',
      steps: [
        { title: 'OLUŞTUR', body: 'Bir fikri haritaya koy ve ihtiyacın olan rolleri aç.' },
        { title: 'BAĞLAN', body: 'Birlikte üretecekleri onayla, gelenleri ve +1’leri karşıla.' },
        { title: 'GEL', body: 'Gerçek dünyada buluş. Üret, izle, dinle, katıl.' },
        { title: 'HATIRLA', body: 'Fotoğrafları, sohbeti ve etkinlik emeğini bir arada tut.' },
      ],
    },
    afterlife: {
      label: 'ETKİNLİKTEN SONRA',
      h2a: 'GECE BİTER.',
      h2b: 'BAĞ BİTMEZ.',
      body: 'CiveMate orada olmanın değerini yaşatır—böylece tek bir etkinlik bir işler bütününe, bir insan çevresine ve bir sonraki fikrin başlangıcına dönüşebilir.',
      rows: [
        { title: 'Ortak anı', body: 'Fotoğraflar, videolar, yorumlar, puanlar ve herkesin katkısı tek bir etkinlik sayfasında yaşar.' },
        { title: 'Portfolyoya emek', body: 'Üretenler gerçek katılımı, ne yaptıklarının ve kiminle yaptıklarının derli toplu bir kaydına dönüştürür.' },
        { title: 'Bağlantıda kal', body: 'İnsanları takip et, gönderi ve hikâye paylaş, DM ya da grup sohbetinde devam et ve bir sonraki daveti gönder.' },
        { title: 'Topluluk kur', body: 'İlgi, mahalle ve üretici toplulukları bir sonraki etkinliğin başlamasını kolaylaştırır.' },
      ],
      institutionLabel: 'MEKÂNLAR + KURUMLAR',
      institutionBody: 'Tiyatrolar, galeriler ve kültür merkezleri aynı haritaya doğrulanmış profiller, ekip araçları ve katılım verisiyle katılır.',
    },
    waitlist: {
      label: 'DEMO LİSTESİ · HER ŞEHRE AÇIK',
      h2a: 'HARİTAYA İLK',
      h2b: 'İĞNELERİ',
      h2c: 'BİRLİKTE KOYALIM.',
      body: 'Erken demo listesine katıl. Küçük bir üretici ve kültür meraklısı grubunu CiveMate’i görmeye, temel akışları denemeye ve ilk mahalle lansmanını şekillendirmeye davet edeceğiz.',
      promise: 'Sadece demo davetleri. Bitmeyen bülten yok.',
      formNumber: 'NO. 001 / ERKEN ERİŞİM',
      nameLabel: 'Adın',
      namePlaceholder: 'Sana nasıl seslenelim?',
      emailLabel: 'E-posta adresin',
      emailPlaceholder: 'sen@ornek.com',
      cityLabel: 'Şehrin',
      cityPlaceholder: 'Dünyanın neresinde olursan',
      roleLabel: 'Şu şekilde katılıyorum',
      roles: ['Kültür meraklısı', 'Sanatçı ya da üretici', 'Kolektif ya da topluluk', 'Mekân ya da kurum'],
      submit: 'Demo listesine katıl',
      submitting: 'İğnen ekleniyor…',
      note: 'Katılarak CiveMate demosu hakkında e-posta almayı kabul edersin. İstediğin zaman çıkabilirsin.',
      error: 'Demo davetini nereye göndereceğimizi bilmemiz için adını ve geçerli bir e-posta yaz.',
      networkError: 'Listeye ulaşılamadı. Lütfen birazdan tekrar dene.',
      successBadge: 'HARİTADASIN',
      successTitle: (n) => `Teşekkürler ${n}.`,
      successBodyPre: 'CiveMate demo davetin için ',
      successBodyPost: ' adresini kullanacağız.',
    },
    faq: {
      label: 'SORULAR',
      h2a: 'BİZE EN ÇOK',
      h2b: 'SORULANLAR.',
      items: [
        {
          q: 'CiveMate nedir?',
          a: 'CiveMate, şehrinin kültür hayatını tek bir canlı haritada toplayan bir kültürel etkinlik platformudur. Yakınında olan konserleri, tiyatroları, okumaları, atölyeleri ve sokak performanslarını görebilecek, kendi etkinliğini oluşturabilecek ve onu gerçekleştirmek için ihtiyacın olan insanları bulabileceksin. CiveMate henüz halka açık değil — bu sayfadaki harita örnek etkinlikler gösteriyor ve gerçeğini önce küçük bir erken gruba açıyoruz.',
        },
        {
          q: "İstanbul'da bu akşam ne olduğunu nasıl öğrenirim?",
          a: 'Haritayı aç, yakınında şu anda ne olduğunu gör: bu akşama ve bu haftaya planlanmış etkinliklerin yanı sıra, tam o sırada devam eden ve “şimdi oluyor” diye işaretlenmiş anlık buluşmalar. Grup sohbetlerini taramana ya da en son martta güncellenmiş etkinlik sayfalarına bakmana gerek yok.',
        },
        {
          q: "İstanbul'da konser, tiyatro ve atölyeleri nerede bulurum?",
          a: 'Hepsi aynı haritada: canlı müzik, tek perdelik oyun okumaları, şiir ve kitap okumaları, çizim halkaları, sanat atölyeleri, sergiler ve sokak performansları. CiveMate İstanbul’da başlıyor, şehrin iki yakasında da, ve harita tek bir mahalleyle sınırlı değil.',
        },
        {
          q: 'İstanbul’da değilim. CiveMate’i yine de kullanabilir miyim?',
          a: 'Evet — erken listeye dünyanın her yerinden katılabilirsin. CiveMate tek bir şehir için değil, hangi şehirde duruyorsan onun için tasarlandı. İstanbul ilk iğnelerin konduğu yer, çünkü sahada olabildiğimiz yer orası. Kaydolurken şehrini yaz; haritanın sırada hangi şehirde açılacağını bu belirliyor.',
        },
        {
          q: 'Etkinliğe katılmak ücretli mi?',
          a: 'Hayır. CiveMate’teki etkinliklere katılmak her zaman ücretsizdir ve CiveMate bilet satmaz.',
        },
        {
          q: 'Etkinliğe yalnız gitmek istemiyorum, ne yapabilirim?',
          a: '+1 modunu kullan. Birinin yanında biri getirmeye açık olduğu etkinlikleri filtrele, zaten gidecek biriyle tanış ve buzları etkinliğin kendisi kırsın. Yanındaki boş koltuk evde kalma sebebi olmaktan çıkar.',
        },
        {
          q: "İstanbul'da basçı, fotoğrafçı ya da birlikte üretecek birini nasıl bulurum?",
          a: 'Bir etkinlik oluştur ve adı konmuş bir rol aç — basçı, fotoğrafçı, dansçı, üretici. Yakındaki insanlar bu role başvurur, kimin katılacağını sen onaylarsın ve herkesin katkısı sonrasında etkinlik sayfasında emek olarak görünür.',
        },
        {
          q: 'Sokak müzisyeniyim. Nasıl seyirci bulurum?',
          a: 'Setini “şimdi oluyor” diye işaretle; çaldığın sürece canlı haritada görünürsün, böylece yakındaki insanlar seni bulabilir. Yanına başka bir müzisyen ya da fotoğrafçı katılsın istiyorsan rol de açabilirsin.',
        },
        {
          q: "Mekânlar, tiyatrolar ve kültür kurumları CiveMate'i kullanabilir mi?",
          a: 'Evet. Tiyatrolar, galeriler ve kültür merkezleri aynı haritaya doğrulanmış profiller, ekip araçları ve katılım verisiyle katılır; böylece programları mahallede olan biten her şeyin yanında yer alır.',
        },
      ],
    },
    footer: {
      tagline: 'Sahne gerekmez.',
      rights: '© 2026 CiveMate',
    },
  },
}
