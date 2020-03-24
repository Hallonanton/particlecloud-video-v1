import React, { Component } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { Link } from 'gatsby'
import Footer from '../Footer/Footer'
import { theme } from '../Layout/Theme'
import { lightenDarkenColor, isTouchDevice } from '../../utility/functions'


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
    transition: all 1000ms ${theme.easings.easeInOutSine};
  }

  &.reveal {
    .title,
    .subTitle {
      opacity: 1;
    }
  }
`

const Navigation = styled('ul')`
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 450px;
`

const Item = styled('li')`
  position: absolute;
  overflow: hidden;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  transition: ${theme.easings.primary};
  z-index: 1;

  ${[...Array(6)].map((item, i) => css`
    &:nth-child(${i+1})::before {
      transition: ${theme.easings.primary},
                  max-width ${theme.easings.reveal} ${i * parseInt(theme.easings.revealDelay)}ms;
    }
  `)}

  &::before,
  &::after {
    display: block;
    position: absolute;
    content: "";
    bottom: 0px;
    width: 100%;
    height: 100%;
  }

  &::before {
    left: 50%;
    max-width: 0%;
    background-color: ${({backgroundColor}) => backgroundColor};
    transform: translateX(-50%);
    z-index: 1;
  }

  &.reveal::before {
    max-width: 100%;
  }

  &::after {
    transition: ${theme.easings.primary};
    opacity: 0;
    transform-style : preserve-3d;
    background-image: url('${({backgroundImage}) => backgroundImage}');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 2;

    ${theme.above.md} {
      background-image: url('${({backgroundImageDesktop}) => backgroundImageDesktop}');
    }
  }

  a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    color: transparent;
    text-decoration: none;
    white-space: nowrap;
    transition: ${theme.easings.primary};
    transform-style : preserve-3d;
    z-index: 3;
    outline: none;
  }

  .text-container {
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
  }

  .item--topTitle,
  .item--title {
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  .item--topTitle {
    ${theme.fontSizes.description}
    font-weight: 400;
  }

  &.active {
    &::after {
      opacity: 0.3;
    }

    a {
      color: ${theme.colors.white};
    }
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class MainNavigation extends Component {

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false)
    window.addEventListener('keydown', this.handleKey, false)
    //window.addEventListener('wheel', this.handleScroll, false)
    //window.addEventListener('touchmove', this.handleMove, false);
    //window.addEventListener('touchend', this.handleMoveEnd, false);

    this.setState({
      items: this.props.items
    }, () => this.handleResize())
  }

  componentWillUnmount() {
    clearTimeout(this.resetIndexTimeout);
    clearTimeout(this.scrollTimeout);
    clearTimeout(this.awaitTabTimeout);
    window.removeEventListener('resize', this.handleResize, false)
    window.removeEventListener('keydown', this.handleKey, false)
    //window.removeEventListener('wheel', this.handleScroll, false)
    //window.removeEventListener('touchmove', this.handleMove, false)
    //window.removeEventListener('touchend', this.handleMoveEnd, false)
  }

  state = {
    prevTouch: null,
    activeIndex: null,
    items: null, 
    navWidth: 280,
    navHeight: 416
  }

  handleResize = e => {    
    if ( this.ref ) {
      let navWidth = this.ref.offsetWidth
      let navHeight = this.ref.offsetHeight

      this.setState({
        navWidth: navWidth,
        navHeight: navHeight
      })
    }
  }

  indexStep = direction => {
    clearTimeout(this.scrollTimeout);
    clearTimeout(this.resetIndexTimeout);

    this.scrollTimeout = setTimeout(() => {
      const { items, activeIndex } = this.state
      let newActiveIndex = activeIndex === null ? -1 : activeIndex

      if ( direction > 0 ) {
        newActiveIndex = newActiveIndex >= items.length-1 ? 0 : newActiveIndex + 1

      } else if ( direction < 0 ) {
        newActiveIndex = newActiveIndex <= 0 ? items.length-1 : newActiveIndex - 1

      }

      this.setState({
        activeIndex: newActiveIndex
      }, () => this.resetIndexTimeout = setTimeout(() => { 
        this.resetActiveIndex()
      }, 2500) )
    }, 50)
  }

  handleKey = e => {

    //Move index to prev on ArrowUp or ArrowLeft
    if( e.key === "ArrowUp" || e.key === "ArrowLeft" ) {
       this.indexStep( -1 );

    //Move index to next on ArrowUp or ArrowRight
    } else if ( e.key === "ArrowDown" || e.key === "ArrowRight" ) {
       this.indexStep( 1 );

    //Trigger "click" whne clicing enter on activeItem
    } else if ( e.key === "Enter" && typeof document !== "undefined" ) {

      const { activeIndex } = this.state

      if ( activeIndex !== null ) {      
        let mainNavLinks = document.querySelectorAll('.mainNavLink')
        mainNavLinks[activeIndex].dispatchEvent(new MouseEvent('click'))
      }

    //Move index to focused element on tab
    } else if ( e.key === "Tab" && typeof document !== "undefined" ) {

      this.awaitTabTimeout = setTimeout(() => {
        const tabTarget = document.activeElement
        let activeIndex = null

        if ( tabTarget.classList.contains('mainNavLink') ) {
          let li = tabTarget.closest('li')
          let index = this.helperIndex(li)
          activeIndex = index 
        }

        this.setState({
          activeIndex: activeIndex
        })
      }, 10)
    }
  }

  /*handleScroll = e => {
    const scrollDirection = e.deltaY
    this.indexStep( scrollDirection )
  }*/

  /*handleMove = e => {
    const { prevTouch } = this.state
    const { clientY } = e.touches[0]
    let scrollDirection = null

    if ( prevTouch ) {
      scrollDirection = clientY > prevTouch ? 1 : -1
    }

    this.setState({
      prevTouch: clientY
    }, () => {
      if ( scrollDirection ) {
        this.indexStep( scrollDirection )
      }
    })
  }

  handleMoveEnd = () => {
    this.setState({
      prevTouch: null
    })
  }*/

  setActiveIndex = e => {
    clearTimeout(this.scrollTimeout);
    clearTimeout(this.resetIndexTimeout);

    if ( e ) {
      let li = e.target.closest('li')
      let index = this.helperIndex(li)

      this.setState({
        activeIndex: index
      })
    }
  }

  resetActiveIndex = () => {
    this.setState({
      activeIndex: null
    })
  }

  helperIndex = node => {
    //Get index of current node
    let i = 0;
    while( (node = node.previousSibling) != null ) {
      i++;
    }
    return i
  }

  handleRef = ref => {
    if ( ref && !this.ref ) {
      this.ref = ref
      this.handleResize()
    }
  }

  render () {

    const { items, activeIndex, navWidth, navHeight } = this.state
    const { reveal } = this.props

    return (
      <Navigation 
        onMouseLeave={() => this.resetActiveIndex()}
        ref={ref => this.handleRef(ref)}
      >
        {items && items.map((item, i) => {

          const isActive = activeIndex === i
          const notActive = activeIndex !== null && !isActive

          //Classes
          let itemClasses = isActive ? 'active' : ''
          itemClasses += reveal ? ' reveal' : ''

          //Colors
          const step = 20
          const defaultColor = lightenDarkenColor(theme.colors.black, (step * (items.length - i)))
          const baseColor = activeIndex !== null ? items[activeIndex].color : undefined
          const activeColor = activeIndex !== null && baseColor ? lightenDarkenColor(baseColor, (step * (activeIndex - i))) : undefined
          const backgroundColor = activeColor ? activeColor : defaultColor

          //Default sizes
          let width = navWidth
          let height = (navHeight/items.length)
          let top = (i * height)
          let left = 0

          //Sizes for portrait (mobile)
          let portraitWidthActive = 1.08
          let portraitheightActive = 1.4
          width = isActive ? (width*portraitWidthActive) : width
          height = isActive ? (height*portraitheightActive) : height

          //Transform
          let difference = i - activeIndex
          difference = difference < 0 ? -difference : difference
          let fromEnd = i < (items.length - (i+1)) ? i : (items.length - (i+1))
          let position = i < activeIndex ? -1 : 1

          let scale = notActive ? 1 - (difference/75) : 1
          let translateX = 0
          let translateY = 0

          if ( isActive ) {

            translateX = `${(width - (width/portraitWidthActive))/-2}px`
            translateY = `${(height - (height/portraitheightActive))/-2}px`

          } else if ( notActive ) {

            translateY = fromEnd === 0 ? 0 : `${position * (10/difference)}%`

          }

          return (
            <Item 
              key={i}
              className={itemClasses}
              style={{
                top: top,
                left: left,
                height: height,
                width: width,
                zIndex: 10 - difference,
                transform: `scaleX(${scale}) translate3d(${translateX}, ${translateY}, 0)`
              }}
              backgroundColor={backgroundColor}
              backgroundImage={item.backgroundImage}
              backgroundImageDesktop={item.backgroundImageDesktop}
            >
              <Link
                to={item.to}
                className="mainNavLink"
                onClick={e => {
                  if ( isTouchDevice() && !isActive ) {
                    e.preventDefault();
                  }
                  this.setActiveIndex(e)
                }}
                onMouseEnter={e => {
                  if ( !isTouchDevice() ) {
                    this.setActiveIndex(e)
                  }
                }}
              >
                <div class="text-container">
                  {item.topTitle && <h4 className="item--topTitle">{item.topTitle}</h4>}
                  {item.title && <h3 className="item--title">{item.title}</h3>}
                </div>
              </Link>
            </Item>
          )
        })}
      </Navigation>
    )
  }
}

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

  render () {

    const { title, subTitle } = this.props
    const { descriptionReveal, mainReveal, footerReveal } = this.state

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
      <HomeWrapper>

        <Description className={descriptionReveal ? 'reveal' : ''}>
          {title && <h1 className="title">{title}</h1>}
          {subTitle && <h2 className="subTitle">{subTitle}</h2>}
        </Description>

        <MainNavigation
          items={items}
          reveal={mainReveal}
        />

        <Footer className={footerReveal ? 'reveal' : ''}/>

      </HomeWrapper>
    )
  }  
}

export default SectionHome