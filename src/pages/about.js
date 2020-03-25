import React from 'react'
//import { graphql } from 'gatsby'
import Layout from '../components/Layout/Layout'
import SectionAbout from '../components/About/SectionAbout'
import PageMetadata from '../components/Layout/PageMetadata'


const AboutPage = ({ data, transitionStatus, entry, exit }) => {

  const title = "Anton Pedersen"

  const metaData = {
    title: title
  }

  return (
    <Layout>
      <PageMetadata {...metaData} />
      <SectionAbout 
        transitionLink={{
          transitionStatus: transitionStatus,
          entry: entry,
          exit: exit
        }}
      />
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
