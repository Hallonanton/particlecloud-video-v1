import React from 'react'
import { Helmet } from 'react-helmet'
import { useSiteMetadata } from './SiteMetadata'

/*==============================================================================
  # Component
==============================================================================*/

const PageMetadata = ({ metaTitle, metaDescription, metaImageSrc }) => {

  const { sitename, titleSuffix } = useSiteMetadata().site.siteMetadata
  let finalTitle = metaTitle ? `${metaTitle} ${titleSuffix} ${sitename}` : null

  return (
    <Helmet>
      {finalTitle && (
        <title>{finalTitle}</title>
      )}
      {metaDescription && (
        <meta name="description" content={metaDescription} />
      )}
      {metaTitle && (
        <meta property="og:title" content={metaTitle} />
      )}
      {metaImageSrc && (
        <meta property="og:image" content={metaImageSrc} />
      )}
    </Helmet>
  )
}

export default PageMetadata
