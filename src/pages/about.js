import React from 'react'
//import { graphql } from 'gatsby'
import Layout from '../components/Layout/Layout'
import PageMetadata from '../components/Layout/PageMetadata'


const AboutPage = ({ data }) => {

  const title = "Anton Pedersen"
  const subTitle = "Webbutvecklare"

  const metaData = {
    title: title
  }

  return (
    <Layout>
      <PageMetadata {...metaData} />
      About
    </Layout>
  )
}

export default AboutPage

/*export const pageQuery = graphql`
  query HomeTemplate($id: String!) {
    markdownRemark(id: { eq: $id }) {
      ...PageSectionsFragment
    }
  }
`*/
