import { ApolloQuery, html, css } from '@apollo-elements/lit-apollo';
import { gql } from '@apollo/client/core';
import '../logic/ApolloSetupDatabase.js';


const ASSET_QUERY = gql`
  query {
    listAssets {
      items {
        id
        creatorId
        mimetype
        avgRating
        createdAt
        fileId
        originalFileId
      }
      totalCount
    }
  }
`;

class AssetGridElement extends ApolloQuery {
  static styles = css`
    .content-masonry {
        column-count: 4;
        column-gap: 1rem;
        margin: 2rem;
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
    this.query = ASSET_QUERY;
    this.loading = false;
    this.error = null;
    this.data = null;
  }

  render() {
    return html`
    <div class="content-masonry">
        <!-- Mock to replace content -->
        <asset-tile></asset-tile>
        <asset-tile></asset-tile>
        <asset-tile></asset-tile>
        <asset-tile></asset-tile>
        <asset-tile></asset-tile>
        <asset-tile></asset-tile>
    </div>
    `;
  }
}
customElements.define('asset-grid', AssetGridElement);