import React from 'react'
import styled from '@emotion/styled'
import ScrollbarWrapper from './ScrollbarWrapper';
import SiteMetadata from './SiteMetadata'
import Theme from './Theme'
import Footer from '../Footer/Footer'

/*==============================================================================
  # Styles
==============================================================================*/

const Main = styled('main')`
  
`


/*==============================================================================
  # Component
==============================================================================*/

const TemplateWrapper = ({children}) => (
  <Theme>
    <SiteMetadata />
    <ScrollbarWrapper>
      <Main>
        {children}
      </Main>
      <Footer />
    </ScrollbarWrapper>
  </Theme>
)


export default TemplateWrapper
