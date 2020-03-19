import React, { Component } from 'react'
import styled from '@emotion/styled'
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

const StyledText = styled(Text)`
  margin: 30px auto 0px;
`


/*==============================================================================
  # Component
==============================================================================*/

class SectionText extends Component {

  render () {

    let { isH1, title, textBody } = this.props

    return (
      <Wrapper>
        <Mega size={isH1 ? "h1" : "h2"}>{title}</Mega>
        <StyledText content={textBody} small />
      </Wrapper>
    )
  }
}

export default SectionText


