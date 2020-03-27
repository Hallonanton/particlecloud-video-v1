const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')


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
