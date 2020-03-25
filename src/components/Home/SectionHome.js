import React, { Component } from 'react'
import styled from '@emotion/styled'
import Footer from '../Footer/Footer'
import MainNavigation from './MainNavigation'
import { theme } from '../Layout/Theme'


/*==============================================================================
  # Styles
==============================================================================*/

const HomeWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: 100vh;
  padding: 15px 20px 5px;

  ${theme.above.md} {
    padding: 45px 20px;
  }
`

const Description = styled('div')`
  margin-bottom: 35px;
  color: ${theme.colors.text};
  text-align: center;

  ${theme.above.sm} {
    margin-bottom: 45px;
  }

  ${theme.above.md} {
    margin-top: 40px;
  }

  .title {
    text-transform: uppercase;
    ${theme.fontSizes.regular}
  }

  .subTitle {
    text-transform: lowercase;
    ${theme.fontSizes.description}
    font-weight: 400;
    transition-delay: ${theme.easings.revealDelay} !important;
  }

  .title,
  .subTitle {
    width: 100%;
    line-height: 1.3;
    letter-spacing: 1.5px;
    opacity: 0;
    transform: translate3d( 0, 5px, 0);
    -webkit-font-smoothing: antialiased;
    backface-visibility: hidden;
    transition: all 1000ms ${theme.easings.easeOutSine};
  }

  &.reveal {
    .title,
    .subTitle {
      opacity: 1;
      transform: translate3d( 0, 0, 0);
    }
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class SectionHome extends Component {

  componentDidMount() {

    const mainRevealDelay = 1000
    const titleRevealDelay = 1500
    const socialRevealDelay = 500

    //Trigger main reveal
    this.revealTimeOut = setTimeout(() => {
      this.setState({
        mainReveal: true
      }, () => {

        //Trigger secondary reveal
        this.revealTimeOut = setTimeout(() => {
          this.setState({
            descriptionReveal: true
          }, () => {

            //Trigger secondary reveal
            this.revealTimeOut = setTimeout(() => {
              this.setState({
                footerReveal: true
              })
            }, socialRevealDelay)
          })
        }, titleRevealDelay)
      })
    }, mainRevealDelay)
  }

  componentWillUnmount() {
    clearTimeout(this.revealTimeOut)
  }

  state = {
    descriptionReveal: false,
    mainReveal: false,
    footerReveal: false
  }

  exit = () => {
    this.setState({
      descriptionReveal: false,
      mainReveal: false,
      footerReveal: false
    })
  }

  render () {

    const { title, subTitle } = this.props
    const { descriptionReveal, mainReveal, footerReveal, curtainReveal } = this.state

    const items = [
      {
        title: "Mer om",
        to: "/about",
        color: "#99e9f2",
        backgroundImage: "https://placekitten.com/660/270",
        backgroundImageDesktop: "https://placekitten.com/800/800",
      },
      {
        title: "Kunskap",
        to: "/knowledge",
        color: "#8ce99a",
        backgroundImage: "https://placekitten.com/660/270",
        backgroundImageDesktop: "https://placekitten.com/800/800",
      },
      {
        title: "Erfarenhet",
        to: "/experience",
        color: "#ffd43b",
        backgroundImage: "https://placekitten.com/660/270",
        backgroundImageDesktop: "https://placekitten.com/800/800",
      },
      {
        title: "Nybergs Bil",
        topTitle: "Case",
        to: "/nybergs-bil",
        color: "#9e7b56",
        backgroundImage: "https://placekitten.com/660/270",
        backgroundImageDesktop: "https://placekitten.com/800/800",
      },
      {
        title: "Svenska Hem",
        topTitle: "Case",
        to: "/svenska-hem",
        color: "#e03131",
        backgroundImage: "https://placekitten.com/660/270",
        backgroundImageDesktop: "https://placekitten.com/800/800",
      },
      {
        title: "OAS",
        topTitle: "Case",
        to: "/oas",
        color: "#5b2160",
        backgroundImage: "https://placekitten.com/660/270",
        backgroundImageDesktop: "https://placekitten.com/800/800",
      }
    ]

    return (
      <HomeWrapper className={curtainReveal ? 'curtainReveal' : ''}>

        <Description className={descriptionReveal ? 'reveal' : ''}>
          {title && <h1 className="title">{title}</h1>}
          {subTitle && <h2 className="subTitle">{subTitle}</h2>}
        </Description>

        <MainNavigation
          items={items}
          reveal={mainReveal}
          exit={() => this.exit()}
        />

        <Footer className={footerReveal ? 'reveal' : ''}/>

      </HomeWrapper>
    )
  }  
}

export default SectionHome