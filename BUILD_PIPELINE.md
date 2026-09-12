# Bhakti Amrit Sanatan — Production Build Pipeline

This document describes the authoritative architecture and single deterministic build sequence for Bhakti Amrit Sanatan ([https://www.bhaktiamritsanatan.com/](https://www.bhaktiamritsanatan.com/)).

---

## 1. Authoritative Source Data

- **`authoritative_content_manifest.json`**:
  The single machine-readable source of truth for all **281 legitimate Sanatan Dharma articles**.
  Fields:
  - `id`: Unique identifier
  - `slug`: Canonical URL slug (preserved exactly)
  - `filename`: Local HTML filename
  - `canonical_path`: Path derived by canonical helper (e.g. `/{slug}`)
  - `canonical_url`: Full canonical URL (e.g. `https://www.bhaktiamritsanatan.com/{slug}`)
  - `title`: Clean, meaningful editorial title (free of clickbait suffixes)
  - `category`: Primary taxonomy (`Puja Vidhi`, `Bhagavad Gita`, `Mantras`, `Vrat & Festivals`, `Dev Katha`)
  - `categoryHi`: Devanagari category name
  - `featured_image`: Dedicated local high-resolution image asset (never the site logo)
  - `description`: Custom meta description
  - `publishedAt`: Publication timestamp
  - `status`: `publish`

- **`articles-data.js`**:
  Client-side dataset exposing both `window.SANATAN_ARTICLES` and `window.ARTICLES_DATA` with dual-key aliases (`title`/`t`, `category`/`c`, `slug`/`s`, `date`/`d`, `image`/`m`, `url`/`u`).

---

## 2. Deterministic Build Sequence

To regenerate, audit, or deploy the website, run the following commands in order:

```bash
# Step 1: Re-synchronize authoritative manifest & data bindings
python scripts/generate_authoritative_manifest.py
python scripts/fix_articles_data_binding.py

# Step 2: Build /articles master library page
python scripts/build_articles_page.py

# Step 3: Authoritative Article Rebuild (100% Idempotent)
python scripts/rebuild_authoritative_articles.py

# Step 4: Authoritative Sitemap Reconciliation (296 Canonical URLs)
python scripts/reconcile_sitemap.py

# Step 5: Run Production Quality Gates
python scripts/run_quality_gates.py
```

### Idempotence Guarantee
Running `python scripts/rebuild_authoritative_articles.py` multiple times consecutively produces `0` byte diffs. Content is bound between explicit `<!-- ARTICLE CONTENT START -->` and `<!-- ARTICLE CONTENT END -->` markers, preventing recursive wrapper nesting.

---

## 3. Visual & Structural Standards

1. **Centered Reading Column**:
   - `.article-container`: `width: min(100% - 32px, 760px); margin-inline: auto; padding: 32px 0 60px;`
   - Maximum prose width on desktop is 760px.
   - Text is never flush against the left viewport edge.

2. **Accessible Contrast & Typography**:
   - Body prose: `#F4EEF7` / `#f1f5f9` on `#0d001f` dark background (exceeds WCAG AA ratio).
   - Headings: Warm gold `#f59e0b` and saffron `#fcd34d`.
   - Links: `#fbbf24` with underline and hover `#fef08a`.
   - Dark-text protection: `.article-prose [style*="color"] { color: inherit !important; }` prevents any legacy inline style from turning text dark.

3. **Featured Hero Images**:
   - Every article displays its dedicated featured image centered at the top of the reading column.
   - The site logo is NEVER used as an article hero.
   - If an asset fails to load, `onerror` gracefully falls back to the category-appropriate sacred high-res artwork.

4. **Zero Shop & Retired Commerce**:
   - The website has zero active shop links, buttons, or banners.
   - Retired endpoints (`/shop`, `/shop.html`, `/shop/*`) return HTTP 410 Gone via `middleware.js`.

5. **Zero WordPress / PHP / Hostinger Dependency**:
   - 100% static HTML/CSS/JS deployed on Vercel with edge middleware security.
