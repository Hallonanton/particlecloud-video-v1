const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

/*==============================================================================
  # Create pages
==============================================================================*/

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              templateKey
              categories
            }
          }
        }
      }
      allDataJson(
        filter: {
          homepage: {ne: null}
        }
      ) {
        edges {
          node {
            homepage
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    /*
     * Variables
     */

    const { allDataJson, allMarkdownRemark } = result.data
    const posts = allMarkdownRemark.edges
    let homepage = _.get(allDataJson, 'edges[0].node.homepage')
    let allCategories = []

    /*
     * Create pages for Sidor, Artiklar
     */

    posts.forEach(edge => {

      const { id } = edge.node
      let { slug } = edge.node.fields
      let categories = _.get(edge, 'node.frontmatter.categories')

      // Save categories for later use
      if ( categories ) {
        allCategories = allCategories.concat(categories)
      }

      // Exclude settings pages from page creation
      if ( !slug.includes('settings') ) {    

        let { templateKey } = edge.node.frontmatter

        // If template is page, remove "sidor" directory from path
        if ( templateKey === 'SinglePage' ) {

          slug = slug.replace("/sidor", "")

          //Set homepage
          if ( homepage && slug === `/${_.kebabCase(homepage)}/` ) {
            slug = "/"
          }
        }

        createPage({
          path: slug,
          categories: categories,
          component: path.resolve(`src/templates/${String(templateKey)}.js`),
          // Additional data can be passed via context to be used in graphql queries
          context: {
            id,
          },
        })

      }
    })


    /*
     * Create category pages
     */

     if ( allCategories.length > 0 ) {

      // Eliminate duplicate categories
      allCategories = _.uniq(allCategories)

      // Make category pages
      allCategories.forEach(category => {
        const categoryPath = `/artiklar/${_.kebabCase(category)}/`

        createPage({
          path: categoryPath,
          component: path.resolve(`src/templates/ArchiveArticle.js`),
          // Additional data can be passed via context to be used in graphql queries
          context: {
            category,
          },
        })
      })
     }
  })
}

/*==============================================================================
  # Customize GraphQL schema
==============================================================================*/

//https://www.gatsbyjs.org/docs/schema-customization/

//This link might be useful for flexible content: https://medium.com/@Zepro/contentful-reference-fields-with-gatsby-js-graphql-9f14ed90bdf9

//For now I haven't figured out how to implement this on fields with more complex types like images with File etc
//https://github.com/gatsbyjs/gatsby/issues/3344

//This will allow different fields to be left empty without causing a GraphQL error
//The result will be that missing fields default to null instead on beaing declared as undefined
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type DataJson implements Node {
      socialmedia: DataJsonSocialmedia
    }
    type DataJsonSocialmedia {
      Facebook: String
      Instagram: String
      LinkedIn: String
      Twitter: String
      Youtube: String
      Github: String
      Codepen: String
    }
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter {
      meta: Meta
    }
    type Meta {
      metaDescription: String
      metaTitle: String
    }
  `
  createTypes(typeDefs)
}

/*==============================================================================
  # Create image nodes
==============================================================================*/

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === 'MarkdownRemark') {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: 'slug',
      node,
      value,
    })
  }
}


/*==============================================================================
  # Fix react warning
==============================================================================*/

exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig()
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom'
    }
  }
}
