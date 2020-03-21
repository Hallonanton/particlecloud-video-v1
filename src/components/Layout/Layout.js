import React from 'react'
import styled from '@emotion/styled'
import SiteMetadata from './SiteMetadata'
import Theme from './Theme'


/*==============================================================================
  # Styles
==============================================================================*/

const Main = styled('main')`
	position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
`



/*==============================================================================
  # Component
==============================================================================*/

const TemplateWrapper = ({children}) => (
  <Theme>
    <SiteMetadata />
    <Main>
      {children}
    </Main>
  </Theme>
)


export default TemplateWrapper
