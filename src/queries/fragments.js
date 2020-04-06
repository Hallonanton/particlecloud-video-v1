import { graphql } from "gatsby"

export const SiteMetaQuery = graphql`
  fragment SiteMetaQuery on Query {
    site {
      siteMetadata {
        sitename
        title
        titleSuffix
        description
      }
    }
    favicon: allFile(filter: {
      name: {eq: "favicon"}
    }) {
      edges {
        node {
          icons: childImageSharp {
            standard: fixed(width: 16, height: 16) {
              ...GatsbyImageSharpFixed
            }
            standardLarge: fixed(width: 32, height: 32) {
              ...GatsbyImageSharpFixed
            }
            googleTV: fixed(width: 96, height: 96) {
              ...GatsbyImageSharpFixed
            }
            win8icon: fixed(width: 128, height: 128) {
              ...GatsbyImageSharpFixed
            }
            ie10metro: fixed(width: 192, height: 192) {
              ...GatsbyImageSharpFixed
            }
            androidHome: fixed(width: 196, height: 196) {
              ...GatsbyImageSharpFixed
            }
            loadingSplash: fixed(width: 512, height: 512) {
              ...GatsbyImageSharpFixed
            }
          }
          appleTouchIcons: childImageSharp {
            iPhoneRetina: fixed(width: 120, height: 120) {
              ...GatsbyImageSharpFixed
            }
            iPad: fixed(width: 152, height: 152) {
              ...GatsbyImageSharpFixed
            }
            iPadRetina: fixed(width: 167, height: 167) {
              ...GatsbyImageSharpFixed
            }
            iPhonePlus: fixed(width: 180, height: 180) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
    ogImage: allFile(filter: {
      name: {eq: "default-og-image"}
    }) {
      edges {
        node {
          childImageSharp {
            fixed(width: 1200, height: 630) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
  }
`