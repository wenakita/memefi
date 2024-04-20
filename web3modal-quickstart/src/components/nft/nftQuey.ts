import { gql } from "@apollo/client";
const nftQueries = {
  getCollection: gql`
    query PreviewTokens {
      tokens(
        networks: [{ network: ETHEREUM, chain: MAINNET }]
        pagination: { limit: 1 }
        sort: { sortKey: MINTED, sortDirection: ASC }
        where: {
          collectionAddresses: ["0x7f35af9b5310483c8ad789277c6e86dc3d329d4f"]
        }
      ) {
        nodes {
          token {
            collectionAddress
            tokenId
            name
            tokenUrl
            metadata
          }
        }
      }
    }
  `,
};

export default nftQueries;

//0x7f35af9b5310483c8ad789277c6e86dc3d329d4f
