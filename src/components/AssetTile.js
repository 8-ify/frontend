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
  `;
  
  static properties = {
    imageUrl: { type: String }
  };

  constructor() {
    super();
    this.imageUrl = '';
  }

  render() {
    return html`
      <div class="masonry-item" style="height: 320px;">
        <img src="${this.imageUrl}" alt="Asset Image" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
      </div>
    `;
  }
}

customElements.define('asset-tile', AssetTileElement);