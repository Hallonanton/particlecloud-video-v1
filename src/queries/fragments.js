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

export const Header = graphql`
  fragment Header on Query {
    allDataJson {
      edges {
        node {
          mainmenu {
            title
            to
            submenu {
              title
              to
            }
          }
          socialmedia {
            Facebook
            Instagram
            Twitter
            LinkedIn
            Youtube
            Codepen
            Github
          }
        }
      }
    }
  }
`

export const Footer = graphql`
  fragment Footer on Query {
    allDataJson(filter: {
      footermenu: {
        elemMatch: {
          links: {
            elemMatch: {
              title: {ne: null}
            }
          }
        }
      }
    }) {
      edges {
        node {
          footermenu {
            title
            links {
              type
              title
              to
            }
          }
          bottommenu {
            title
            to
          }
        }
      }
    }
  }
`

export const CookieConsent = graphql`
  fragment CookieConsent on Query {
    allDataJson(
      filter: {
        integritypage: {ne: null}
      }
    ) {
      edges {
        node {
          integritypage
        }
      }
    }
  }
`

export const PageSectionsFragment = graphql`
  fragment PageSectionsFragment on MarkdownRemark {
    frontmatter {
      title
      sections {
        sectionKey
        title
        textBody
        alignment
        link {
          title
          to
        }
        text
        category
        cards {
          text
          title
          link {
            title
            to
          }
        }
        imageHalf {
          childImageSharp {      
            fluid(maxWidth: 600, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        imageFull {
          childImageSharp {      
            fluid(maxWidth: 1200, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      ...Meta
    }
  }
`

export const AllArticles = graphql`
  fragment AllArticles on Query {
    allMarkdownRemark(
      filter: { 
        frontmatter: { 
          templateKey: { eq: "SingleArticle" } 
        }
      }
      sort: {
        fields: [frontmatter___date, frontmatter___title]
        order: [DESC, ASC]
      } 
    ) {
      edges {
        node {
          ...ArticleCardFragment
        }
      }
    }
  }
`

export const ArticleCardFragment = graphql`
  fragment ArticleCardFragment on MarkdownRemark {
    id
    excerpt(pruneLength: 150)
    rawMarkdownBody
    fields {
      slug
    }
    frontmatter {
      title
      categories
      date(formatString: "YYYY-MM-DD")
      description
      featuredimage {
        childImageSharp {
          fixed(width: 300, height: 300) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  }
`

export const ArticlePageFragment = graphql`
  fragment ArticlePageFragment on MarkdownRemark {
    id
    html
    frontmatter {
      title
      categories
      date(formatString: "YYYY-MM-DD")
      description
      featuredimage {
        childImageSharp {      
          fluid(maxWidth: 1200, quality: 100) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      ...Meta
    }
  }
`

export const MetaFragment = graphql`
  fragment Meta on Frontmatter {
    meta {
      metaDescription
      metaTitle
    }
  }
`