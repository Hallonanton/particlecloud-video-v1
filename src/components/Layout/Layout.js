import React from 'react'
import SiteMetadata from './SiteMetadata'
import Theme from './Theme'

/*==============================================================================
  # Component
==============================================================================*/

const TemplateWrapper = ({children}) => (
  <Theme>
    <SiteMetadata />
    <main>
      {children}
    </main>
  </Theme>
)


export default TemplateWrapper
