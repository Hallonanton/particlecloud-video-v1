import React from 'react'
import styled from '@emotion/styled'
import SiteMetadata from './SiteMetadata'
import Theme from './Theme'


/*==============================================================================
  # Styles
==============================================================================*/

const Main = styled('main')`
  width: 100vw;
  height: 100vh;
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
