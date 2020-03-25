import React, { Component } from 'react'
import styled from '@emotion/styled'
import { StaticQuery, graphql } from 'gatsby'
import IconNav from '../UI/IconNav'
import { theme } from '../Layout/Theme'

import Facebook from '../../img/social/facebook.svg'
import Twitter from '../../img/social/twitter.svg'
import Instagram from '../../img/social/instagram.svg'
import LinkedIn from '../../img/social/linkedin.svg'
import Youtube from '../../img/social/youtube.svg'
import Codepen from '../../img/social/codepen.svg'
import Github from '../../img/social/github.svg'


/*==============================================================================
  # Styles
==============================================================================*/

const FooterWrapper = styled('footer')`
  margin-top: 25px;
  text-align: center;

  ${theme.above.sm} {
    margin-top: 35px;
  }

  ${theme.above.md} {
    margin-top: 90px;
  }

  .footer-icons {
    justify-content: center;

    li {
      opacity: 0;
      transform: translateY(15px);
      transition: all ${theme.easings.reveal};

      &:nth-of-type(2) {
        transition-delay: ${theme.easings.revealDelay};
      }

      &:nth-of-type(3) {
        transition-delay: calc( 2 * ${theme.easings.revealDelay});
      }
    }
  }

  &.reveal {
    li {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class Footer extends Component {

  getIcon = (name) => {
    const icons = {
      Facebook,
      Instagram,
      LinkedIn,
      Twitter,
      Youtube,
      Codepen,
      Github
    }
    return icons[name]
  }

  render() {

    return (
      <StaticQuery 
        query={graphql`
          query FooterQuery {
            ...Footer
          }
        `}
        render={data => {

          let socialmedia = null
          let socialmediaLinks = []

          data.allDataJson.edges.forEach(item => {
            socialmedia = item.node.socialmedia ? item.node.socialmedia : socialmedia
          })

          if ( socialmedia ) {
            for (let key in socialmedia) {
              if ( socialmedia.hasOwnProperty(key) && socialmedia[key]) {

                const title = key
                const Icon = this.getIcon(title)

                socialmediaLinks.push({
                  title: title,
                  to: socialmedia[key],
                  icon: <Icon />,
                  target: true
                })

              }
            }
          }

          return (
            <FooterWrapper {...this.props}>
              <IconNav className="footer-icons" links={socialmediaLinks} />
            </FooterWrapper>
          )
        }}
      />
    )
  }
}

export default Footer
