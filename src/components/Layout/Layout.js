import React from 'react'
import SiteMetadata from './SiteMetadata'
import Theme from './Theme'
import Footer from '../Footer/Footer'

/*==============================================================================
  # Component
==============================================================================*/

const TemplateWrapper = ({children}) => (
  <Theme>
    <SiteMetadata />
    <main>
      {children}
    </main>
    <Footer />
  </Theme>
)


export default TemplateWrapper
