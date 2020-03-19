import React, { Component, Fragment } from 'react'
import _ from 'lodash'
import { graphql, Link } from 'gatsby'
import Img from "gatsby-image"
import styled from '@emotion/styled'
import Layout from '../components/Layout/Layout'
import PageMetadata from '../components/Layout/PageMetadata'
import Container from '../components/UI/Grid'
import { Mega, Heading } from '../components/UI/Headings'
import Divider from '../components/UI/Divider'
import Text from '../components/UI/Text'
import ArticleCard, { ArticleCardContainer } from '../components/UI/ArticleCard'


/*==============================================================================
  # Styles
==============================================================================*/

const StyledContainer = styled(Container)`
  margin-top: 15px;
  align-items: center;
`

const CategoryList = styled('div')`
  margin-bottom: 5px;

  a {
    ${({theme}) => theme.styles.linkEase}
  }
`

const Date = styled('span')`
  margin-top: 5px;
  color: ${({theme}) => theme.colors.bgContrast};
  ${({theme}) => theme.fontSizes.description}
`

const StyledText = styled(Text)`
  margin: 40px 0px;
`


/*==============================================================================
  # Components
==============================================================================*/

export class ArticlePostTemplate extends Component {

  render() {

    const { categories, title, date, description, featuredimage, html } = this.props

    return (
      <StyledContainer>
        
        <CategoryList>
          {categories.map((category, i) => (
            <Fragment>
              {i ? (', ') : null}
              <Link key={i} to={`/artiklar/${_.kebabCase(category)}/`}>{category}</Link>
            </Fragment>
          ))}
        </CategoryList>

        <Mega>{title}</Mega>

        <Date>{date}</Date>

        <StyledText small content={description} />

        <Img 
          fluid={featuredimage.childImageSharp.fluid}
          alt={title}
          style={{
            position: 'relative',
            width: '100%',
            height: '550px',
          }}
        />

        <StyledText replace={false} content={html} />

      </StyledContainer>
    )
  }
}

const SingleArticle = ({ data }) => {

  const { html, frontmatter } = data.markdownRemark
  const posts = data.allMarkdownRemark.edges
  let metaData = frontmatter.meta

  if ( !metaData || (metaData && !metaData.metaTitle) ) {
    if ( !metaData ) {
      metaData = {}
    }
    if ( !metaData.metaTitle ) {
      metaData.metaTitle = frontmatter.title
    }
    if ( !metaData.metaDescription ) {
      metaData.metaDescription = frontmatter.description
    }
  }

  return (
    <Layout>
      <PageMetadata {...metaData} />

      <ArticlePostTemplate html={html} {...frontmatter} />

      <StyledContainer>

        <Divider mt={'25px'} mb={'60px'} />

        {posts && posts.length > 0 ? (
          <Fragment>

            <Heading>Liknande artiklar</Heading>

            <ArticleCardContainer>
              {posts.map((post, i) => (
                <ArticleCard key={i} post={post} />
              ))}
            </ArticleCardContainer>

          </Fragment>
        ) : null}

      </StyledContainer>
    </Layout>
  )
}

export default SingleArticle

export const articleQuery = graphql`
  query ArticlePostTemplate($id: String!, $category: [String]) {
    markdownRemark(id: { eq: $id }) {
      ...ArticlePageFragment
    }
    allMarkdownRemark(
      limit: 3
      filter: { 
        id: { ne: $id }
        frontmatter: { 
          templateKey: { eq: "SingleArticle" }
          categories: { in: $category }
        } 
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
