import React from 'react'
//import { graphql } from 'gatsby'
import Layout from '../components/Layout/Layout'
import SectionHome from '../components/Home/SectionHome'
import PageMetadata from '../components/Layout/PageMetadata'


const HomePage = ({ data }) => {

  const title = "Anton Pedersen"
  const subTitle = "Webbutvecklare"

  const metaData = {
    title: title
  }

  return (
    <Layout>
      <PageMetadata {...metaData} />
      <SectionHome 
        title={title}
        subTitle={subTitle}
      />
    </Layout>
  )
}

export default HomePage

/*export const pageQuery = graphql`
  query HomeTemplate($id: String!) {
    markdownRemark(id: { eq: $id }) {
      ...PageSectionsFragment
    }
  }
`*/
