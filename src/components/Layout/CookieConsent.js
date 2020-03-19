import React, { Component } from 'react'
import styled from '@emotion/styled'
import { StaticQuery, graphql } from 'gatsby'
import Button from '../UI/Button'
import { setCookie, getCookie, slugify } from '../../utility/functions'
import { Link } from 'gatsby'

/*==============================================================================
  # Styles
==============================================================================*/

const Wrapper = styled('div')`
  
  --margin: 5px;

  ${({theme}) => theme.above.sm } {
    --margin: 15px;
  }

  ${({theme}) => theme.above.md } {
    --margin: 20px;
  }

  position: fixed;
  bottom: var(--margin);
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  max-width: calc( 100% - var(--margin) * 2 );
  padding: 30px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.bg};
  text-align: center;
  opacity: 1;
  box-shadow: ${({theme}) => theme.styles.boxshadow};
  transform: translate( -50%, 0 ) scale(1);
  transition: all 450ms ${({theme}) => theme.easings.primary};
  z-index: 100;

  &.animate-out {
    opacity: 0;
    transform: translate( -50%, calc( 100% + var(--margin) ) ) scale(0.5);
  }

  ${({theme}) => theme.above.sm} {
    flex-direction: row;
    text-align: left;
  }
`

const Text = styled('p')`
  ${({theme}) => theme.above.sm} {
    padding-right: 30px;
  }

  a {
    color: ${({theme}) => theme.colors.primary};
  }
`

const StyledButton = styled(Button)`
  max-width: 200px;
  text-align: center;
  
  ${({theme}) => theme.below.sm} {
    margin-top: 15px;
  }
`



/*==============================================================================
  # Component
==============================================================================*/


class CookieConsent extends Component {

  componentDidMount() {

    const cookieConsent = getCookie('cookieConsent')

    if ( !cookieConsent ) {     
      this.setState({
        display: true
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  state = {
    animateOut: false,
    display: false
  }

  onAllow = (e) => {
    e.preventDefault()

    console.log('ButtonWithLoading')

    this.hide()
  }

  hide = () => {
    this.setState({
      animateOut: true,
    }, () => {

      setCookie('cookieConsent', 'allowed', 999);

      let that = this
      this.timer = setTimeout(() => {
        that.setState({
          display: false
        })
      }, 450)
    })
  }

  render () {

    const { animateOut, display } = this.state

    return !display ? null : (
      <StaticQuery 
        query={graphql`
          query CookieConsentQuery {
            ...CookieConsent
          }
        `}
        render={data => {

          const integritypageLink = data.allDataJson.edges[0].node.integritypage

          return (
            <Wrapper className={animateOut ? 'animate-out' : ''}>
              <Text>Vi använder cookies för att ge dig bästa möjliga webbplatsupplevelse. Genom att använda webbplatsnamn godkänner du vår <Link to={`/${slugify(integritypageLink)}`}>integritetspolicy.</Link></Text>
              <StyledButton
                onClick={e => this.onAllow(e)}
              >
                Jag förstår
              </StyledButton>
            </Wrapper>
          )
        }}
      />
    )
  }
}

export default CookieConsent