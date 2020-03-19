import React, { Component } from 'react'
import { StaticQuery, graphql } from 'gatsby'
import styled from '@emotion/styled'
import { Mega, SmallHeading } from '../UI/Headings'
import ArticleCard, { ArticleCardContainer } from '../UI/ArticleCard'


/*==============================================================================
  # Styles
==============================================================================*/

const Wrapper = styled('div')`
  width: 100%;
  padding: 50px 0px;
  text-align: center;
`

const StyledArticleCardContainer = styled(ArticleCardContainer)`
  ${({theme}) => theme.above.lg} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`


const NoResult = styled(SmallHeading)`
  margin-top: 45px;
`

/*==============================================================================
  # Component
==============================================================================*/

class SectionArticles extends Component {

  render () {
    return (
      <StaticQuery
        query={graphql`
          query SectionArticlesQuery {
            ...AllArticles
          }
        `}
        render={data => {
          
          let { category, isH1, title } = this.props
          let posts = data.allMarkdownRemark.edges
          let postsIndex = 0

          posts = posts.filter((post) => {
                  
            let show = true

            //Filter
            if ( category && !post.node.frontmatter.categories.includes(category) ) { 
              show = false
            }

            //Counter
            if ( show && postsIndex < 3 ) {
              postsIndex++
            }

            return show
             
          })

          return (
            <Wrapper>
              <Mega size={isH1 ? "h1" : "h2"}>{title}</Mega>

              {posts && posts.length > 0 ? (

                <StyledArticleCardContainer>
                {posts.map((post, i) => (
                  <ArticleCard key={i} post={post} />
                ))}
                </StyledArticleCardContainer>

              ) : (
                <NoResult>Inga artiklar hittades</NoResult>
              )}

            </Wrapper>
          )
        }}
      />
    )
  }
}

export default SectionArticles


