import React from 'react'
import { Helmet } from 'react-helmet'
import { graphql, useStaticQuery } from 'gatsby'
import { useTheme } from 'emotion-theming'

/*==============================================================================
  # Component
==============================================================================*/

export const useSiteMetadata = () => {
  const result = useStaticQuery(
    graphql`
      query MetadataQuery {
        ...SiteMetaQuery
      }
    `
  )
  return result
}

const SiteMetadata = () => {

  const theme = useTheme()
  const { site, favicon, ogImage } = useSiteMetadata()
  const { sitename, title, titleSuffix, description } = site.siteMetadata
  const favicons = favicon.edges[0] ? favicon.edges[0].node : null
  const finalTitle = `${title} ${titleSuffix} ${sitename}`

  return (
    <Helmet>
      <html lang="sv" />
      <title>{finalTitle}</title>
      <meta name="description" content={description} />

      {/* Add an image named favicon.png inside src/components/img to update favicon */}
      {/* favicon.png needs to be 512x512, resizing is done automatically */}
      {favicons && Object.values(favicons.icons).map((icon, i) => (
        <link key={i} rel="icon" href={icon.src} type="image/png" sizes={`${icon.width}x${icon.height}`} />
      ))}
      {favicons && Object.values(favicons.appleTouchIcons).map((icon, i) => (
        <link key={i} rel="apple-touch-icon" href={icon.src} type="image/png" sizes={`${icon.width}x${icon.height}`} />
      ))}

      <meta name="theme-color" content={theme.colors.bg} />
      <meta property="og:site_name" content={sitename} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="sv_SE" />

      {/* Add an image named default-og-image inside src/components/img to update og-image */}
      {/* default-og-image is automatically resized to the recommended size of 1200x630 */}
      {ogImage && ogImage.edges[0] && (
        <meta property="og:image" content={ogImage.edges[0].node.childImageSharp.fixed.src} />
      )}

    </Helmet>
  )
}

export default SiteMetadata
