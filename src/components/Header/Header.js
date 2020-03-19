import React, { Component, Fragment } from 'react'
import styled from '@emotion/styled'
import { Media } from 'react-breakpoints'
import { StaticQuery, graphql } from 'gatsby'
import Container from '../UI/Grid'
import MobileNav from './Mobile/MobileNav'
import DesktopNav from './Desktop/DesktopNav'

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

const Header = styled('header')`
  --header-height: 50px;

  ${({theme}) => theme.above.md} {
    --header-height: 70px;
  }

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--header-height);
  background-color: ${({theme}) => theme.colors.bg};
  transition: transform 450ms ${({theme}) => theme.easings.easeInOutBack};
  z-index: 99;

  &.scrolled {
    transform: translateY( calc(-1 * var(--header-height)) );
  }

  &.scrolled-back {
    //Style for when header should be visible but not at the top of the page
  }

  &::before {
    display: block;
    content: "";
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({theme}) => theme.colors.bg};
  }
`

const Placeholder = styled('div')`
  flex-shrink: 0;
  width: 100%;
  height: 50px;

  ${({theme}) => theme.above.md} {
    height: 70px;
  }
`

const StyledContainer = styled(Container)`
  height: var(--header-height);
`


/*==============================================================================
  # Component
==============================================================================*/

class Navbar extends Component {

  componentDidMount() {
    if ( this.state.hideOnScroll ) {
      window.addEventListener('scrollbar', this.handleScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scrollbar', this.handleScroll)
  }

  state = {
    mobileMenuOpen: false,
    hideOnScroll: true,
    hideOffset: 100, //px
    scrollY: 0,
    prevY: 0,
    scrollState: 'not-scrolled',
  }

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

  handleScroll = e => {  
    const newPos = document.scrollbar.top || 0
    const oldPos = this.state.scrollY

    let scrollState =
      newPos < this.state.hideOffset
        ? 'not-scrolled'
        : oldPos > newPos
        ? 'scrolled-back'
        : 'scrolled'

    this.setState({
      scrollY: newPos,
      prevY: oldPos,
      scrollState: scrollState,
    })
  }

  handleToggleMobileMenu = menuOpen => {
    this.setState({
      mobileMenuOpen: menuOpen
    })
  }

  render() {

    const {
      mobileMenuOpen
    } = this.state


    return (
      <StaticQuery 
        query={graphql`
          query HeaderQuery {
            ...Header
          }
        `}
        render={data => {

          let mainmenu = null
          let socialmedia = null
          let socialmediaLinks = []

          data.allDataJson.edges.forEach(item => {
            mainmenu = item.node.mainmenu ? item.node.mainmenu : mainmenu
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
            <Fragment>
              <Header className={this.state.scrollState}>
                <StyledContainer>

                  <Media>
                    {({ breakpoints, currentBreakpoint }) => 
                      breakpoints[currentBreakpoint] < breakpoints.md ? (
                        
                        <MobileNav 
                          mainLinks={mainmenu}
                          secondaryLinks={socialmediaLinks}
                          open={mobileMenuOpen}
                          onToggleMenu={menuOpen =>
                            this.handleToggleMobileMenu(menuOpen)
                          }
                        />

                      ) : (

                        <DesktopNav 
                          mainLinks={mainmenu}
                          secondaryLinks={socialmediaLinks}
                        />

                      )
                    }
                  </Media>

                </StyledContainer>
              </Header>

              <Placeholder />
            </Fragment>
          )
        }}
      />
    )
  }
}

export default Navbar