import React, { Component } from 'react'
import styled from '@emotion/styled'
import Img from "gatsby-image"
import { Mega } from '../UI/Headings'
import Text from '../UI/Text'

/*==============================================================================
  # Styles
==============================================================================*/

const Wrapper = styled('div')`
  width: 100%;
  padding: 50px 0px;
  text-align: center;
`

const Row = styled('div')`
  display: flex;
  align-items: center;
  margin-left: -15px;
  margin-right: -15px;

  ${({theme}) => theme.below.md} {
    flex-direction: column;
  }
`

const Col = styled('div')`
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  text-align: center;

  &:first-of-type {
    margin-bottom: 30px;
  }

  ${({theme}) => theme.above.md} {
    width: 50%;
    margin-bottom: 0px;
    order: ${({order}) => order};
  }
`

const StyledText = styled(Text)`
  margin: 30px auto 0px;
`


/*==============================================================================
  # Component
==============================================================================*/

class SectionImageText extends Component {

  render () {

    let { isH1, title, text, alignment, imageHalf } = this.props

    return (
      <Wrapper>
          
          <Row>
            <Col order={alignment === 'left' ? 1 : 2}>
              <Img 
                fluid={imageHalf.childImageSharp.fluid}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '550px',
                }}
              />
            </Col>
            <Col order={alignment === 'right' ? 1 : 2}>
              <Mega size={isH1 ? "h1" : "h2"}>{title}</Mega>
              <StyledText content={text} small />
            </Col>
          </Row> 


      </Wrapper>
    )
  }
}

export default SectionImageText


