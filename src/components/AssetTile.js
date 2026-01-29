import { LitElement, html, css } from 'lit';

class AssetTileElement extends LitElement {

  static styles = css`
    .masonry-item {
        background-color: var(--secondary-explore);
        margin-bottom: 1rem;
        padding: 1rem;
        break-inside: avoid;
        color: white;
        font-size: 1.5rem;
        text-align: center;
    }
    .asset-meta {
        font-size: 0.9rem;
        color: #ccc;
        margin-top: 0.5rem;
        word-break: break-all;
    }
    img {
        margin-bottom: 0.5rem;
    }
  `;

  static properties = {
    imageUrl: { type: String },
    assetId: { type: String },
    creatorId: { type: String },
    mimetype: { type: String },
    avgRating: { type: Number },
    createdAt: { type: String }
  };

  constructor() {
    super();
    this.imageUrl = '';
    this.assetId = '';
    this.creatorId = '';
    this.mimetype = '';
    this.avgRating = 0;
    this.createdAt = '';
  }

  render() {
    return html`
      <div class="masonry-item">
        <img src="${this.imageUrl}" alt="Asset Image" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
        <div class="asset-meta">
          <div><b>Creator:</b> ${this.creatorId}</div>
          <div><b>Rating:</b> ${this.avgRating}</div>
          <div><b>Created:</b> ${new Date(this.createdAt).toLocaleDateString()}</div>
        </div>
      </div>
    `;
  }
}

customElements.define('asset-tile', AssetTileElement);