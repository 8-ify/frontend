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

  constructor() {
    super();
    this.query = ASSET_QUERY;
  }

  render() {
    const items = this.data?.listAssets?.items || [];
    return html`
      <div class="content-masonry">
        ${items.map(asset => html`
          <asset-tile
            .imageUrl=${`https://api.8ify.capsiatech.eu/download/${asset.id}`}
            .assetId=${asset.id}
            .creatorId=${asset.creatorId}
            .mimetype=${asset.mimetype}
            .avgRating=${asset.avgRating}
            .createdAt=${asset.createdAt}
          ></asset-tile>
        `)}
      </div>
    `;
  }
}
customElements.define('asset-grid', AssetGridElement);