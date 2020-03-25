import React, { Component } from 'react'
import { Link as GatsbyLink } from 'gatsby-plugin-transition-link'

class Link extends Component {

  render() {
    const {
      children,
      to,
      target,
      targetBlank,
      className,
      ...rest
    } = this.props

    const winDefined = typeof window !== 'undefined'
    let href = to

    const attrTarget = target || targetBlank ? { target: '_blank' } : {}
    const attrRel = target || targetBlank ? { rel: 'noopener noreferrer' } : {}

    if (winDefined && href && href.includes(window.location.origin)) {
      href = href.replace(new RegExp(window.location.origin, 'g'), '')
    }

    const internal = href && !href.includes('http')

    //Use GatsbyLink for internal links
    if (winDefined && internal) {
      return (
        <GatsbyLink to={href} className={className} {...rest}>
          {children}
        </GatsbyLink>
      )

      //Use regular a-tag for external links
    } else {
      return (
        <a href={href} className={className} {...attrTarget} {...attrRel}>
          {children}
        </a>
      )
    }
  }
}

export default Link
