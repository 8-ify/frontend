import { LitElement, html, css } from 'lit';

class UploadWidgetElement extends LitElement {

  static styles = css`
    .img-center {
      display: block;
      margin-left: auto;
      margin-right: auto;
      max-height: 250px;
    }
    .text-center {
      text-align: center;
      margin-top: 1rem;
      font-size: 1.2rem;
    }
    .drop-zone {
      display: flex;
      flex-direction: column;
      justify-content: center;
      border: 4px solid var(--secondary-create);
      border-radius: 30px;
      height: 100%;
      padding: 1rem;
      color: var(--primary-create);
      font-size: 1.5rem;
      transition: background 0.2s;
      background: var(--background-color);
    }
    .drop-zone.dragover {
      background: #222;
    }
    .drop-zone.drop-allowed {
      cursor: pointer;
    }
  `;
  
  constructor() {
    super();
    this.dragActive = false;
    this.imageUrl = '';
    this.error = '';
  }

  static properties = {
    dragActive: { type: Boolean },
    imageUrl: { type: String },
    error: { type: String },
  };

  _onDragOver(e) {
    e.preventDefault();
    this.dragActive = true;
  }

  _onDragLeave(e) {
    e.preventDefault();
    this.dragActive = false;
  }

  _onDrop(e) {
    e.preventDefault();
    this.dragActive = false;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      this._handleFiles(files);
    }
  }

  _onFileChange(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      this._handleFiles(files);
    }
  }

  _handleFiles(files) {
    this.error = '';
    const file = files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.error = 'Please upload a valid image file.';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imageUrl = e.target.result;
      this.dispatchEvent(new CustomEvent('file-selected', {
        detail: { upload: file, type: 'pixart' },
        bubbles: true,
        composed: true
      }));
    };
    reader.readAsDataURL(file);
  }

  render() {
    if (this.imageUrl) {
      return html`
        <div class="drop-zone">
          <img src="${this.imageUrl}" alt="Uploaded Image" class="img-center" />
        </div>
      `;
    }
    return html`
      <div
        class="drop-zone drop-allowed ${this.dragActive ? 'dragover' : ''}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
        @click=${() => this.shadowRoot.getElementById('fileInput').click()}
      >
        <img src="/images/upload.png" alt="Pixel Art Upload" class="img-center" />
        <p class="text-center">${this.dragActive ? 'Drop file to upload' : 'upload ur art'}</p>
        <input
          id="fileInput"
          type="file"
          style="display: none;"
          @change=${this._onFileChange}
        />
        ${this.error ? html`<p class="text-center" style="color:red;">${this.error}</p>` : ''}
      </div>
    `;
  }
}

customElements.define('upload-widget', UploadWidgetElement);