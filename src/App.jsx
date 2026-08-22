import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowRight,
  Check,
  MapPin,
  Menu,
  Music2,
  Paintbrush,
  Plus,
  Theater,
  Users,
  X,
} from 'lucide-react'
import { copy } from './copy'

// Presentation stays here; the words live in copy.js. Index-matched to
// copy[lang].activities / copy[lang].features.cards.
const activityStyle = [
  { icon: Music2, className: 'pin-music', image: '/images/rooftop-music.webp', coordinates: [29.0267, 40.9818] },
  { icon: Theater, className: 'pin-theatre', image: '/images/theatre-reading.webp', coordinates: [29.0358, 40.9952] },
  { icon: Paintbrush, className: 'pin-art', image: '/images/sketch-circle.webp', coordinates: [29.0229, 40.9874] },
  { icon: Users, className: 'pin-role', image: '/images/bassist-wanted.webp', coordinates: [29.0296, 40.9915] },
  { icon: Music2, className: 'pin-live', image: '/images/street-performer.webp', coordinates: [29.0231, 40.9798] },
]

const featureStyle = [
  { icon: MapPin, className: 'feature-cobalt' },
  { icon: Users, className: 'feature-red' },
  { icon: Plus, className: 'feature-yellow' },
]

function Logo({ t }) {
  return (
    <a className="logo" href="#top" aria-label={t.logoAria}>
      <svg className="logo-mark" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M6 8 54 6 58 54 10 58Z" className="logo-paper" />
        <path d="M44 20C36 14 24 16 20 28S24 48 36 46C42 45 46 41 48 36" className="logo-cut" />
        <path d="m54 6-4 10 8-2Z" className="logo-fold" />
        <rect x="12" y="12" width="6" height="2" className="logo-staple" />
      </svg>
      <span className="wordmark">CIVE<i>M</i>ATE</span>
    </a>
  )
}

function CulturalMap({ t, activities, activePin, onSelect }) {
  const selected = activities.find((activity) => activity.id === activePin)
  const markerPositions = [
    { left: '48%', top: '39%' },
    { left: '61%', top: '24%' },
    { left: '72%', top: '60%' },
    { left: '54%', top: '66%' },
    { left: '35%', top: '77%' },
  ]

  return (
    <div className="real-map-shell map-enter" aria-label={t.map.aria}>
      <div className="map-live-header">
        <span><i /> {t.map.live}</span>
        <strong>{t.map.nearby(activities.length)}</strong>
      </div>
      <img className="static-map" src="/images/kadikoy-real-art-map.webp" alt={t.map.imageAlt} />
      <div className="map-ink" aria-hidden="true" />
      {activities.map((activity, index) => (
        <button
          key={activity.id}
          type="button"
          className={`activity-marker static-marker ${activity.className} ${activePin === activity.id ? 'marker-active' : ''}`}
          style={markerPositions[index]}
          onClick={() => onSelect(activity.id)}
          aria-label={t.map.show(activity.title)}
        >
          <span className="marker-photo"><img src={activity.image} alt="" /></span>
          <span className="marker-dot" />
        </button>
      ))}
      <article className="map-activity-card">
        <img src={selected.image} alt="" />
        <div className="map-card-copy">
          <span>{selected.type}</span>
          <strong>{selected.title}</strong>
          <small>{selected.meta} · {selected.people}</small>
          <button type="button">{t.map.view} <ArrowRight size={15} /></button>
        </div>
      </article>
      <div className="map-photo-stack" aria-label={t.map.more}>
        {activities.filter((activity) => activity.id !== activePin).slice(0, 2).map((activity) => (
          <button key={activity.id} type="button" onClick={() => onSelect(activity.id)} aria-label={t.map.show(activity.title)}>
            <img src={activity.image} alt="" />
          </button>
        ))}
        <span>+{activities.length - 3}</span>
      </div>
      <div className="map-stamp">{t.map.stamp[0]}<br />{t.map.stamp[1]}<br />{t.map.stamp[2]}</div>
      <a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">{t.map.attribution}</a>
    </div>
  )
}

function App({ lang = 'en' }) {
  const t = copy[lang] ?? copy.en
  const activities = t.activities.map((activity, i) => ({ ...activityStyle[i], ...activity, id: i + 1 }))
  const features = t.features.cards.map((card, i) => ({ ...featureStyle[i], ...card }))

  const [activePin, setActivePin] = useState(5)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', city: '', role: t.waitlist.roles[0] })
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const scrollToWaitlist = () => {
    setMenuOpen(false)
    document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setError('')
  }

  const submitWaitlist = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      setError(t.waitlist.error)
      return
    }

    setStatus('loading')
    const endpoint = import.meta.env.VITE_WAITLIST_ENDPOINT || 'https://formsubmit.co/ajax/civemateapp@gmail.com'
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...form,
          source: `civemate-landing-${lang}`,
          _subject: `New CiveMate demo request — ${form.role}${form.city ? ` · ${form.city}` : ''}`,
          _template: 'table',
        }),
      })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('idle')
      setError(t.waitlist.networkError)
    }
  }

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <header className="site-header" id="top">
        <Logo t={t} />
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label={t.nav.aria}>
          <a href="#how" onClick={() => setMenuOpen(false)}>{t.nav.how}</a>
          <a href="#creators" onClick={() => setMenuOpen(false)}>{t.nav.creators}</a>
          <a href="#inside" onClick={() => setMenuOpen(false)}>{t.nav.inside}</a>
          <button className="nav-cta" onClick={scrollToWaitlist}>{t.nav.cta} <ArrowRight size={17} /></button>
          {/* Real anchors, not a JS locale swap: crawlers need a followable
              link between the two documents, and users need a visible way to
              reach a language hreflang alone never shows them. */}
          <div className="lang-switch" aria-label={t.nav.langAria}>
            <a href="/" hrefLang="en" aria-current={lang === 'en' ? 'true' : undefined} className={lang === 'en' ? 'lang-on' : ''}>EN</a>
            <a href="/tr" hrefLang="tr" aria-current={lang === 'tr' ? 'true' : undefined} className={lang === 'tr' ? 'lang-on' : ''}>TR</a>
          </div>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-label={t.nav.toggle}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy hero-enter">
            <div className="edition">{t.hero.edition}</div>
            <h1 id="hero-title">{t.hero.line1}<br />{t.hero.line2}<span>{t.hero.highlight}</span><br />{t.hero.line3}</h1>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={scrollToWaitlist}>{t.hero.primary} <ArrowRight size={20} /></button>
              <a className="text-link" href="#inside">{t.hero.secondary} <ArrowDown size={18} /></a>
            </div>
            <p className="microcopy">{t.hero.microcopy}</p>
          </div>

          <div className="map-stage">
            <CulturalMap t={t} activities={activities} activePin={activePin} onSelect={setActivePin} />
            <div className="map-shadow" aria-hidden="true" />
            <div className="map-depth-label" aria-hidden="true">{t.map.depth}</div>
          </div>
        </section>

        <div className="ticker" aria-label={t.ticker.aria}>
          <div>
            {t.ticker.items.map((item) => (
              <span key={item}>{item}<b>✳</b></span>
            ))}
            {t.ticker.items.slice(0, 2).map((item) => (
              <span key={`dup-${item}`} aria-hidden="true">{item}<b aria-hidden="true">✳</b></span>
            ))}
          </div>
        </div>

        <section className="problem" id="how" data-reveal>
          <div className="section-label">{t.problem.label}</div>
          <div className="problem-copy">
            <h2>{t.problem.h2a}<br /><em>{t.problem.h2b}</em></h2>
            <p>{t.problem.body}</p>
          </div>
          <aside className="pull-quote">
            <span>“</span>
            <p>{t.problem.quote}</p>
          </aside>
        </section>

        <section className="features" id="inside" aria-labelledby="features-title" data-reveal>
          <div className="section-heading">
            <div className="section-label">{t.features.label}</div>
            <h2 id="features-title">{t.features.h2a}<br />{t.features.h2b}</h2>
          </div>
          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article className={`feature-card ${feature.className}`} key={feature.title}>
                  <div className="feature-icon"><Icon size={30} strokeWidth={2.3} /></div>
                  <span>{feature.eyebrow}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="street-artists" id="creators" aria-labelledby="street-title" data-reveal>
          <div className="street-photo">
            <img src="/images/street-performer.webp" alt={t.street.imageAlt} />
            <span>{t.street.badge}</span>
          </div>
          <div className="street-copy">
            <div className="section-label">{t.street.label}</div>
            <h2 id="street-title">{t.street.h2a}<br />{t.street.h2b}<em>{t.street.h2c}</em></h2>
            <p>{t.street.body}</p>
            <div className="creator-flow" aria-label={t.street.flowAria}>
              {t.street.flow.map((step, i) => (
                <span key={step}><b>0{i + 1}</b> {step}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="journey" aria-labelledby="journey-title" data-reveal>
          <div className="journey-copy">
            <div className="section-label">{t.journey.label}</div>
            <h2 id="journey-title">{t.journey.h2a}<br />{t.journey.h2b}</h2>
            <p>{t.journey.body}</p>
          </div>
          <ol className="journey-steps">
            {t.journey.steps.map((step, i) => (
              <li key={step.title}><b>{i + 1}</b><span><strong>{step.title}</strong>{step.body}</span></li>
            ))}
          </ol>
        </section>

        <section className="afterlife" aria-labelledby="afterlife-title" data-reveal>
          <div className="afterlife-heading">
            <div className="section-label">{t.afterlife.label}</div>
            <h2 id="afterlife-title">{t.afterlife.h2a}<br /><span>{t.afterlife.h2b}</span></h2>
            <p>{t.afterlife.body}</p>
          </div>
          <div className="afterlife-rows">
            {t.afterlife.rows.map((row, i) => (
              <article key={row.title}><b>0{i + 1}</b><h3>{row.title}</h3><p>{row.body}</p></article>
            ))}
          </div>
          <aside className="institution-note">
            <span>{t.afterlife.institutionLabel}</span>
            <p>{t.afterlife.institutionBody}</p>
          </aside>
        </section>

        {/* Native <details>: open/close with zero JS, so the answers are in the
            HTML a crawler reads whether or not it renders scripts. */}
        <section className="faq" id="faq" aria-labelledby="faq-title" data-reveal>
          <div className="faq-heading">
            <div className="section-label">{t.faq.label}</div>
            <h2 id="faq-title">{t.faq.h2a}<br /><em>{t.faq.h2b}</em></h2>
          </div>
          <div className="faq-list">
            {t.faq.items.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary><span>{item.q}</span><i aria-hidden="true" /></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="waitlist" id="waitlist" aria-labelledby="waitlist-title" data-reveal>
          <div className="waitlist-copy">
            <div className="section-label light">{t.waitlist.label}</div>
            <h2 id="waitlist-title">{t.waitlist.h2a}<br /><span>{t.waitlist.h2b}</span><br />{t.waitlist.h2c}</h2>
            <p>{t.waitlist.body}</p>
            <div className="promise"><Check size={18} /> {t.waitlist.promise}</div>
          </div>

          <div className="form-poster">
            {status === 'success' ? (
              <div className="success-state" role="status">
                <div className="success-mark"><Check size={38} /></div>
                <span>{t.waitlist.successBadge}</span>
                <h3>{t.waitlist.successTitle(form.name.split(' ')[0])}</h3>
                <p>{t.waitlist.successBodyPre}<strong>{form.email}</strong>{t.waitlist.successBodyPost}</p>
              </div>
            ) : (
              <form onSubmit={submitWaitlist} noValidate>
                <div className="form-number">{t.waitlist.formNumber}</div>
                <label>
                  {t.waitlist.nameLabel}
                  <input name="name" value={form.name} onChange={updateField} autoComplete="name" placeholder={t.waitlist.namePlaceholder} />
                </label>
                <label>
                  {t.waitlist.emailLabel}
                  <input name="email" value={form.email} onChange={updateField} autoComplete="email" inputMode="email" placeholder={t.waitlist.emailPlaceholder} />
                </label>
                <label>
                  {t.waitlist.cityLabel}
                  <input name="city" value={form.city} onChange={updateField} autoComplete="address-level2" placeholder={t.waitlist.cityPlaceholder} />
                </label>
                <label>
                  {t.waitlist.roleLabel}
                  <select name="role" value={form.role} onChange={updateField}>
                    {t.waitlist.roles.map((role) => <option key={role}>{role}</option>)}
                  </select>
                </label>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="button form-button" disabled={status === 'loading'}>
                  {status === 'loading' ? t.waitlist.submitting : <>{t.waitlist.submit} <ArrowRight size={20} /></>}
                </button>
                <p className="form-note">{t.waitlist.note}</p>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer>
        <Logo t={t} />
        <p>{t.footer.tagline}</p>
        <div><a href="mailto:civemateapp@gmail.com">civemateapp@gmail.com</a><span>{t.footer.rights}</span></div>
      </footer>
    </>
  )
}

export default App
