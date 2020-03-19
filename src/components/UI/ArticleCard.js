import React, { Component } from 'react'
import styled from '@emotion/styled'
import Img from "gatsby-image"
import Link from '../Link'
import { SubHeading } from './Headings'

/*==============================================================================
  # Styles
==============================================================================*/

export const ArticleCardContainer = styled('ul')`
  display: grid;
  grid-template-columns: repeat( auto-fill, minmax(300px, 1fr) );
  margin: 30px -15px -15px;
`

const Card = styled('li')`
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;

  & > * {
    margin: 0 auto;
  }
`

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  max-width: 330px;
  height: 100%;
  border-radius: 20px;
  color: ${({theme}) => theme.colors.text};
  text-decoration: none;
  overflow: hidden;
  transition: all 250ms ${({theme}) => theme.easings.secondary};

  ${({theme}) => theme.below.sm} {
    box-shadow: ${({theme}) => theme.styles.boxshadow};
  }

  &:hover {
    box-shadow: ${({theme}) => theme.styles.boxshadow};
  }
`

const Content = styled('div')`
  padding: 15px 20px 30px;
`

const Text = styled('p')`
  margin-top: 10px;
  transition: all 250ms ${({theme}) => theme.easings.secondary};
  ${({theme}) => theme.fontSizes.description}
`


/*==============================================================================
  # Component
==============================================================================*/


class ArticleCard extends Component {

  render () {

    const post = this.props.post.node
    let link = post.fields.slug
    let { excerpt, frontmatter } = post
    let { title, description, featuredimage } = frontmatter
    let text = description || excerpt

    return (
      <Card>
        <StyledLink to={link}>
          <Img 
            fixed={featuredimage.childImageSharp.fixed}
            alt={title}
            style={{
              position: 'relative',
              width: '100%',
              height: 'auto',
              paddingBottom: '100%'
            }}
            imgStyle={{
              position: 'absolute',
              width: '100%'
            }}
          />
          <Content>
            <SubHeading>{title}</SubHeading>
            <Text>{text}</Text>
          </Content>
        </StyledLink>
      </Card>
    )
  }
}

export default ArticleCard