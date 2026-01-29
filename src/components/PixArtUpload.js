import { ApolloMutation, html, css } from '@apollo-elements/lit-apollo';
import { gql } from '@apollo/client/core';
import '../logic/ApolloSetup.js';


const UPLOAD_ASSET_MUTATION = gql`
  mutation ($creatorId: String!, $image: String!) {
    submitJob (creatorId: $creatorId, job: {
      type: IMAGE,
      image: {
        imageBase64: $image
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
  `;

  static get properties() {
    return {
      ...super.properties,
      loading: { type: Boolean },
      error: { type: Object },
      data: { type: Object },
    };
  }

  constructor() {
    super();
    this.mutation = UPLOAD_ASSET_MUTATION;
    this.loading = false;
    this.error = null;
    this.data = null;
  }

  firstUpdated() {
    const uploadWidget = this.renderRoot.querySelector('upload-widget');
    if (uploadWidget) {
      uploadWidget.addEventListener('file-selected', (e) => this.handleFileSelected(e));
    }
  }

  async handleFileSelected(e) {
    const file = e.detail?.upload;
    if (!file) return;
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

      const imageBase64 = await toBase64(file);
      const variables = {
        creatorId: 'demo-user', // fixed value
        image: imageBase64,
      };
      this.mutate({ variables });
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
          <p>Hyperparameters</p>
          <p>NOT IMPLEMENTED</p>
          ${this.loading ? html`<p>Uploading...</p>` : ''}
          ${this.error ? html`<p style="color:red;">Error: ${this.error.message}</p>` : ''}
          ${this.data ? html`<p>Upload successful!</p>` : ''}
        </div>
      </div>
    `;
  }
}
customElements.define('pixart-upload', PixArtUploadElement);