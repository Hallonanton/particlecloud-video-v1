import React, { Component } from 'react'
import styled from '@emotion/styled'
import { StaticQuery, graphql } from 'gatsby'
import HorizontalNav from '../Navigation/HorizontalNav'

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
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 30px 15px;
  text-align: center;

  .footer-icons {
    justify-content: center;
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
            <FooterWrapper>
              <HorizontalNav className="footer-icons" links={socialmediaLinks} />
            </FooterWrapper>
          )
        }}
      />
    )
  }
}

export default Footer
