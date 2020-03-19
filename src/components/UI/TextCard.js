import React, { Component } from 'react'
import styled from '@emotion/styled'
import { ButtonLink } from './Button'
import { Heading } from './Headings'

/*==============================================================================
  # Styles
==============================================================================*/

export const TextCardContainer = styled('ul')`
  display: grid;
  grid-template-columns: 1fr;
  margin: 30px -15px -15px;

  ${({theme}) => theme.above.sm} {
    grid-template-columns: 1fr 1fr;
  }

  ${({theme}) => theme.above.md} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const Card = styled('li')`
  width: 100%;
  padding: 15px;
  margin-bottom: 15px;
  text-align: center;

  & > * {
    margin-left: auto;
    margin-right: auto;
  }
`

const Text = styled('p')`
  margin-top: 15px;
  transition: all 250ms ${({theme}) => theme.easings.secondary};
  ${({theme}) => theme.fontSizes.description}
`

const StyledLink = styled(ButtonLink)`
  display: inline-block;
  width: auto;
  min-width: 200px;
  margin-top: 30px;
  text-align: center;
  text-decoration: none;
`



/*==============================================================================
  # Component
==============================================================================*/


class TextCard extends Component {

  render () {

    let { title, text, link } = this.props

    return (
      <Card>
        <Heading>{title}</Heading>
        <Text>{text}</Text>
        {link ? (<StyledLink to={link.to}>{link.title}</StyledLink>) : null}
      </Card>
    )
  }
}

export default TextCard