/**
 * Generateur HTML pour l'export PDF des portfolios
 * Convertit les donnees du portfolio (blocs) en HTML complet pour Puppeteer
 */
class PortfolioTemplate {

  /**
   * Generer le HTML complet du portfolio
   */
  generateHTML(portfolio) {
    const blocks = portfolio.blocks || [];
    const primaryColor = portfolio.primary_color || '#3b82f6';
    const template = portfolio.template || 'moderne';
    const styles = this.getTemplateStyles(template, primaryColor);

    const blocksHTML = blocks.map(block => this.renderBlock(block, styles, primaryColor)).join('\n');

    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: ${styles.bodyBg};
      color: ${styles.textColor};
      line-height: 1.6;
    }
    .header {
      background: ${styles.headerBg};
      padding: 48px 40px;
      text-align: center;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      color: ${styles.titleColor};
      margin-bottom: 8px;
    }
    .header p {
      font-size: 16px;
      color: ${styles.subtitleColor};
    }
    .content {
      max-width: 700px;
      margin: 0 auto;
      padding: 32px 40px;
    }
    .block { margin-bottom: 28px; }
    .card {
      background: ${styles.cardBg};
      border-radius: 10px;
      padding: 24px;
      ${styles.cardShadow}
    }
    .block-title {
      font-size: 20px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 12px;
    }
    .block-text {
      font-size: 14px;
      color: ${styles.textColor};
      white-space: pre-wrap;
      line-height: 1.7;
    }
    .hero {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      padding: 40px;
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
    }
    .hero-content { position: relative; z-index: 1; }
    .hero h2 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
    .hero p { font-size: 16px; opacity: 0.9; }
    .hero-btn {
      display: inline-block;
      margin-top: 16px;
      padding: 10px 24px;
      background: white;
      color: #111;
      border-radius: 8px;
      font-weight: 500;
      text-decoration: none;
      font-size: 14px;
    }
    .image-block img {
      width: 100%;
      border-radius: 8px;
      display: block;
    }
    .image-caption {
      font-size: 12px;
      color: ${styles.captionColor};
      margin-top: 8px;
      text-align: center;
    }
    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .gallery-grid img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 6px;
    }
    .project-card {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .project-card img {
      width: 140px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .project-card h3 {
      font-size: 16px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 6px;
    }
    .project-card p { font-size: 13px; color: ${styles.textColor}; }
    .project-card a {
      font-size: 13px;
      color: ${primaryColor};
      text-decoration: none;
      margin-top: 8px;
      display: inline-block;
    }
    .contact-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .contact-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      color: ${styles.textColor};
      background: ${styles.contactBg};
      text-decoration: none;
    }
    .separator-line { border-top: 1px solid ${styles.separatorColor}; margin: 20px 0; }
    .separator-dots { text-align: center; color: ${styles.captionColor}; font-size: 18px; letter-spacing: 8px; margin: 20px 0; }
    .separator-space { height: 32px; }
    .video-placeholder {
      background: ${styles.cardBg};
      border: 2px dashed ${styles.separatorColor};
      border-radius: 10px;
      padding: 32px;
      text-align: center;
      color: ${styles.captionColor};
      font-size: 14px;
    }
    .footer {
      text-align: center;
      padding: 24px 40px;
      font-size: 12px;
      color: ${styles.captionColor};
      border-top: 1px solid ${styles.separatorColor};
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <h1>${this.escapeHTML(portfolio.title)}</h1>
    ${portfolio.description ? `<p>${this.escapeHTML(portfolio.description)}</p>` : ''}
  </div>

  <!-- Contenu -->
  <div class="content">
    ${blocksHTML}
  </div>

  <!-- Footer -->
  <div class="footer">
    Portfolio genere depuis Mew-mew-Ai
  </div>

</body>
</html>`;
  }

  /**
   * Rendre un bloc en HTML
   */
  renderBlock(block, styles, primaryColor) {
    const content = block.content || {};

    switch (block.type) {
      case 'hero':
        return this.renderHero(content, primaryColor);
      case 'text':
        return this.renderText(content, primaryColor);
      case 'image':
        return this.renderImage(content);
      case 'video':
        return this.renderVideo(content);
      case 'gallery':
        return this.renderGallery(content);
      case 'project':
        return this.renderProject(content, primaryColor);
      case 'contact':
        return this.renderContact(content);
      case 'separator':
        return this.renderSeparator(content);
      default:
        return '';
    }
  }

  renderHero(content, primaryColor) {
    const bgStyle = content.backgroundImage
      ? `background-image: url(${content.backgroundImage}); background-size: cover; background-position: center;`
      : `background: ${primaryColor};`;
    const overlay = content.overlay && content.backgroundImage
      ? '<div class="hero-overlay"></div>'
      : '';
    const button = content.buttonText
      ? `<a class="hero-btn" href="${this.escapeHTML(content.buttonLink || '#')}">${this.escapeHTML(content.buttonText)}</a>`
      : '';

    return `<div class="block">
      <div class="hero" style="${bgStyle}">
        ${overlay}
        <div class="hero-content">
          <h2>${this.escapeHTML(content.title || '')}</h2>
          ${content.subtitle ? `<p>${this.escapeHTML(content.subtitle)}</p>` : ''}
          ${button}
        </div>
      </div>
    </div>`;
  }

  renderText(content, primaryColor) {
    const titleSize = content.style === 'heading' ? '24px' : '20px';
    const title = content.title
      ? `<div class="block-title" style="font-size: ${titleSize}; color: ${primaryColor};">${this.escapeHTML(content.title)}</div>`
      : '';

    return `<div class="block">
      <div class="card">
        ${title}
        ${content.text ? `<div class="block-text">${this.escapeHTML(content.text)}</div>` : ''}
      </div>
    </div>`;
  }

  renderImage(content) {
    if (!content.url) return '';
    return `<div class="block">
      <div class="card image-block" style="padding: 0; overflow: hidden;">
        <img src="${content.url}" alt="${this.escapeHTML(content.caption || '')}" />
        ${content.caption ? `<div class="image-caption" style="padding: 12px;">${this.escapeHTML(content.caption)}</div>` : ''}
      </div>
    </div>`;
  }

  renderVideo(content) {
    const caption = content.caption ? this.escapeHTML(content.caption) : 'Video';
    return `<div class="block">
      <div class="video-placeholder">
        <div style="font-size: 32px; margin-bottom: 8px;">🎬</div>
        <div>${caption}</div>
        ${content.url ? `<div style="margin-top: 8px; font-size: 12px; word-break: break-all;">${this.escapeHTML(content.url)}</div>` : ''}
      </div>
    </div>`;
  }

  renderGallery(content) {
    const images = Array.isArray(content.images) ? content.images : [];
    if (images.length === 0) return '';

    const imagesHTML = images.map(img => {
      const url = typeof img === 'string' ? img : img.url;
      return `<img src="${url}" alt="" />`;
    }).join('\n');

    return `<div class="block">
      <div class="card">
        <div class="gallery-grid">
          ${imagesHTML}
        </div>
      </div>
    </div>`;
  }

  renderProject(content, primaryColor) {
    const image = content.image
      ? `<img src="${content.image}" alt="${this.escapeHTML(content.title || '')}" />`
      : '';
    const link = content.link
      ? `<a href="${this.escapeHTML(content.link)}">Voir le projet →</a>`
      : '';

    return `<div class="block">
      <div class="card">
        <div class="project-card">
          ${image}
          <div>
            <h3>${this.escapeHTML(content.title || 'Projet')}</h3>
            ${content.description ? `<p>${this.escapeHTML(content.description)}</p>` : ''}
            ${link}
          </div>
        </div>
      </div>
    </div>`;
  }

  renderContact(content) {
    const links = [];
    if (content.email) links.push(`<span class="contact-link">✉️ ${this.escapeHTML(content.email)}</span>`);
    if (content.phone) links.push(`<span class="contact-link">📞 ${this.escapeHTML(content.phone)}</span>`);
    if (content.linkedin) links.push(`<a class="contact-link" href="${this.escapeHTML(content.linkedin)}">💼 LinkedIn</a>`);
    if (content.github) links.push(`<a class="contact-link" href="${this.escapeHTML(content.github)}">🐙 GitHub</a>`);
    if (links.length === 0) return '';

    return `<div class="block">
      <div class="card">
        <div class="contact-links">
          ${links.join('\n')}
        </div>
      </div>
    </div>`;
  }

  renderSeparator(content) {
    switch (content.style) {
      case 'space':
        return '<div class="separator-space"></div>';
      case 'dots':
        return '<div class="separator-dots">...</div>';
      default:
        return '<div class="separator-line"></div>';
    }
  }

  /**
   * Styles selon le template
   */
  getTemplateStyles(template, primaryColor) {
    switch (template) {
      case 'minimal':
        return {
          bodyBg: '#ffffff',
          headerBg: '#ffffff',
          titleColor: '#111827',
          subtitleColor: '#6b7280',
          cardBg: '#ffffff',
          cardShadow: '',
          textColor: '#374151',
          captionColor: '#9ca3af',
          contactBg: '#f3f4f6',
          separatorColor: '#e5e7eb'
        };
      case 'sombre':
        return {
          bodyBg: '#111827',
          headerBg: '#1f2937',
          titleColor: '#ffffff',
          subtitleColor: '#9ca3af',
          cardBg: '#1f2937',
          cardShadow: '',
          textColor: '#e5e7eb',
          captionColor: '#6b7280',
          contactBg: '#374151',
          separatorColor: '#374151'
        };
      default: // moderne
        return {
          bodyBg: '#f9fafb',
          headerBg: `linear-gradient(135deg, ${primaryColor}, ${this.darkenColor(primaryColor, 30)})`,
          titleColor: '#ffffff',
          subtitleColor: 'rgba(255,255,255,0.85)',
          cardBg: '#ffffff',
          cardShadow: 'box-shadow: 0 1px 3px rgba(0,0,0,0.1);',
          textColor: '#374151',
          captionColor: '#9ca3af',
          contactBg: '#f3f4f6',
          separatorColor: '#e5e7eb'
        };
    }
  }

  /**
   * Assombrir une couleur hex
   */
  darkenColor(hex, amount) {
    hex = hex.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Echapper le HTML pour eviter les injections
   */
  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

module.exports = new PortfolioTemplate();
