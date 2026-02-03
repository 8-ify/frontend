import { ApolloMutation, html, css } from '@apollo-elements/lit-apollo';
import { gql } from '@apollo/client/core';
import '../logic/ApolloSetupOrchestrator.js';


const UPLOAD_ASSET_MUTATION = gql`
  mutation ($creatorId: String!, $image: String!, $pixelSize: Int!, $paletteSize: Int!) {
    submitJob (creatorId: $creatorId, job: {
      type: IMAGE,
      image: {
        imageBase64: $image
        pixelSize: $pixelSize
        paletteSize: $paletteSize
      }
    })
  }
`;

class PixArtUploadElement extends ApolloMutation {
    static styles = css`
    .horiz-flex {
      display: flex;
      gap: 2rem;
      justify-content: left;
      margin: 2rem;
      height: calc(100vh - 16rem);
    }

    .horiz-item-w-35 {
      border: 4px solid var(--secondary-create);
      border-radius: 30px;
      width: 35%;
      height: 100%;
      padding: 1rem;
      color: var(--primary-create);
      font-size: 1.5rem;
    }

    .horiz-item-w-60 {
      width: 60%;
    }

    .param-slider {
      width: 90%;
      margin: 1rem 0;
    }

    .upload-btn {
      margin-top: 1.5rem;
      padding: 0.7rem 2rem;
      font-size: 1.2rem;
      background: var(--secondary-create);
      color: #fff;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .upload-btn:disabled {
      background: #ccc;
      color: #888;
      cursor: not-allowed;
    }
    `;

  static get properties() {
    return {
      ...super.properties,
      loading: { type: Boolean },
      error: { type: Object },
      data: { type: Object },
      pixelSize: { type: Number },
      paletteSize: { type: Number },
      selectedFile: { type: Object },
    };
  }

  constructor() {
    super();
    this.mutation = UPLOAD_ASSET_MUTATION;
    this.loading = false;
    this.error = null;
    this.data = null;
    this.pixelSize = 8;
    this.paletteSize = 16;
    this.selectedFile = null;
  }

  firstUpdated() {
    const uploadWidget = this.renderRoot.querySelector('upload-widget');
    if (uploadWidget) {
      uploadWidget.addEventListener('file-selected', (e) => this.handleFileSelected(e));
    }
  }

  handleFileSelected(e) {
    const file = e.detail?.upload;
    if (!file) return;
    this.selectedFile = file;
    this.data = null;
    this.error = null;
  }

  async handleUpload() {
    if (!this.selectedFile) return;
    this.loading = true;
    this.error = null;
    try {
      // Convert file to base64 string
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          // Remove the data URL prefix to get only the base64 string
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = error => reject(error);
      });
      const imageBase64 = await toBase64(this.selectedFile);
      const variables = {
        creatorId: 'demo-user', // fixed value
        image: imageBase64,
        pixelSize: this.pixelSize,
        paletteSize: this.paletteSize,
      };
      // The mutation expects pixelSize and paletteSize inside job.image
      this.mutate({ variables });
      this.data = { success: true };
    } catch (err) {
      this.error = err;
    } finally {
      this.loading = false;
    }
  }

  render() {
    return html`
      <div class="horiz-flex">
        <upload-widget class="horiz-item-w-60"></upload-widget>
        <div class="horiz-item-w-35">
          <p><b>Hyperparameters</b></p>
          <label for="pixelSize">Pixel Size: ${this.pixelSize}</label>
          <input
            class="param-slider"
            id="pixelSize"
            type="range"
            min="2"
            max="32"
            step="1"
            .value="${this.pixelSize}"
            @input="${e => { this.pixelSize = Number(e.target.value); }}"
          />
          <label for="paletteSize">Palette Size: ${this.paletteSize}</label>
          <input
            class="param-slider"
            id="paletteSize"
            type="range"
            min="2"
            max="64"
            step="1"
            .value="${this.paletteSize}"
            @input="${e => { this.paletteSize = Number(e.target.value); }}"
          />
          <button
            class="upload-btn"
            ?disabled="${!this.selectedFile || this.loading}"
            @click="${() => this.handleUpload()}"
          >
            ${this.loading ? 'Uploading...' : 'Upload'}
          </button>
          ${this.error ? html`<p style="color:red;">Error: ${this.error.message}</p>` : ''}
          ${this.data ? html`<p>Upload successful!</p>` : ''}
        </div>
      </div>
    `;
  }
}
customElements.define('pixart-upload', PixArtUploadElement);