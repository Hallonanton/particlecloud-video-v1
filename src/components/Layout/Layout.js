import React from 'react'
import styled from '@emotion/styled'
import ScrollbarWrapper from './ScrollbarWrapper';
import SiteMetadata from './SiteMetadata'
import Theme from './Theme'
import Footer from '../Footer/Footer'
import Header from '../Header/Header'
//import CookieConsent from './CookieConsent'


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
      <Header />
      <Main>
        {children}
      </Main>
      <Footer />
      {/*<CookieConsent />*/}
    </ScrollbarWrapper>
  </Theme>
)


export default TemplateWrapper
