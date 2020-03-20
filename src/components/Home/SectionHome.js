import React, { Component } from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import Footer from '../Footer/Footer'
import { theme } from '../Layout/Theme'
import { lightenDarkenColor } from '../../utility/functions'


/*==============================================================================
  # Styles
==============================================================================*/

const HomeWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding: 45px 15px;
`

const Description = styled('div')`
  margin-bottom: 45px;
  color: ${theme.colors.text};
  text-align: center;

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
  }

  .title,
  .subTitle {
    width: 100%;
    line-height: 1.3;
    letter-spacing: 1.5px;
  }
`

const Navigation = styled('ul')`
  position: relative;
`

const Item = styled('li')`
  position: absolute;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  transition: ${theme.easings.primary};
  z-index: 1;

  &::before {
    display: block;
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    transition: ${theme.easings.primary};
    opacity: 0;
    z-index: 1;
    transform-style : preserve-3d;
    background-image: url('${({backgroundImage}) => backgroundImage}');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;

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
    transition: ${theme.easings.primary};
    transform-style : preserve-3d;
    z-index: 2;
    outline: none;
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
    &::before {
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
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('wheel', this.handleScroll)
    window.addEventListener('keydown', this.handleKey)

    this.setState({
      items: this.props.items
    }, () => this.handleResize())
  }

  componentWillUnmount() {
    clearTimeout(this.resetIndexTimeout);
    clearTimeout(this.scrollTimeout);
    clearTimeout(this.awaitTabTimeout);
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('wheel', this.handleScroll)
    window.removeEventListener('keydown', this.handleKey)
  }

  state = {
    prevScroll: null,
    activeIndex: null,
    items: null, 
    orientation: 'portrait',
    navWidth: 300,
    navHeight: 450
  }

  handleResize = e => {
    const { orientation } = this.state

    //Mobile values
    let newOrientation = 'portrait'
    let navWidth = 300
    let navHeight = 450
    
    //Test desktop
    if (typeof window !== 'undefined') {
      if (window.matchMedia(theme.above.md.replace('@media ', '')).matches) {
        //Desktop values
        newOrientation = 'landscape'
        navWidth = 600
        navHeight = 300
      }
    }

    if ( newOrientation !== orientation ) {
      this.setState({
        orientation: newOrientation,
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
      let newActiveIndex = activeIndex === null ? 0 : activeIndex

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

  handleScroll = e => {
    const scrollDirection = e.deltaY
    this.indexStep( scrollDirection )
  }

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

  render () {

    const { items, activeIndex, navWidth, navHeight, orientation } = this.state

    return (
      <Navigation 
        onMouseLeave={() => this.resetActiveIndex()}
        style={{
          width: navWidth,
          height: navHeight
        }}
      >
        {items && items.map((item, i) => {

          const isActive = activeIndex === i
          const notActive = activeIndex !== null && !isActive
          const isPortrait = orientation === 'portrait'

          //Colors
          const step = 20
          const defaultColor = lightenDarkenColor(theme.colors.black, (step * (items.length - i)))
          const baseColor = activeIndex !== null ? items[activeIndex].color : undefined
          const activeColor = activeIndex !== null && baseColor ? lightenDarkenColor(baseColor, (step * (activeIndex - i))) : undefined
          const background = activeColor ? activeColor : defaultColor

          //Default sizes
          let width = isPortrait ? navWidth : (navWidth/items.length)
          let height = isPortrait ? (navHeight/items.length) : navHeight
          let top = isPortrait ? (i * height) : 0
          let left = isPortrait ? 0 : (i * width)

          //Sizes for portrait (mobile)
          width = isActive && isPortrait ? width+30 : width
          height = isActive && isPortrait ? height+60 : height

          //Sizes for landscape (desktop)
          height = isActive && !isPortrait ? height+50 : height
          width = isActive && !isPortrait ? height : width

          //Transform
          let difference = i - activeIndex
          difference = difference < 0 ? -difference : difference
          let fromEnd = i < (items.length - (i+1)) ? i : (items.length - (i+1))
          let position = i < activeIndex ? -1 : 1

          let scale = notActive ? 1 - (difference/75) : 1
          let translateX = 0
          let translateY = 0

          if ( isActive ) {
            if (isPortrait) {
              translateX = '-15px'
              translateY = '-30px'

            } else {
              translateX = '0px'
              translateY = '0px'

            }

          } else if ( notActive ) {
            if ( isPortrait ) {
              translateY = fromEnd === 0 ? 0 : `${position * (10/difference)}%`

            } else {
              translateX = fromEnd === 0 ? 0 : `${position * (10/difference)}%`

            }
          }

          return (
            <Item 
              key={i}
              className={isActive ? 'active' : null}
              style={{
                top: top,
                left: left,
                height: height,
                width: width,
                zIndex: 10 - difference,
                transform: `scaleX(${scale}) translate3d(${translateX}, ${translateY}, 0)`,
                background: background
              }}
              backgroundImage="https://placekitten.com/660/270"
              backgroundImageDesktop="https://placekitten.com/800/800"
            >
              <Link
                to={item.to}
                className="mainNavLink"
                onClick={e => this.setActiveIndex(e)}
                onMouseEnter={e => this.setActiveIndex(e)}
              >
                {item.topTitle && <h4 class="item--topTitle">{item.topTitle}</h4>}
                {item.title && <h3 class="item--title">{item.title}</h3>}
              </Link>
            </Item>
          )
        })}
      </Navigation>
    )
  }
}

const SectionHome = ({ title, subTitle }) => {

  const items = [
    {
      title: "Mer om",
      to: "/about",
      color: "#99e9f2"
    },
    {
      title: "Kunskap",
      to: "/knowledge",
      color: "#8ce99a"
    },
    {
      title: "Erfarenhet",
      to: "/experience",
      color: "#ffd43b"
    },
    {
      title: "Nybergs Bil",
      topTitle: "Case",
      to: "/nybergs-bil",
      color: "#9e7b56"
    },
    {
      title: "Svenska Hem",
      topTitle: "Case",
      to: "/svenska-hem",
      color: "#e03131"
    },
    {
      title: "OAS",
      topTitle: "Case",
      to: "/oas",
      color: "#5b2160"
    }
  ]

  return (
    <HomeWrapper>

      <Description>
        {title && <h1 className="title">{title}</h1>}
        {subTitle && <h2 className="subTitle">{subTitle}</h2>}
      </Description>

      <MainNavigation items={items} />

      <Footer />

    </HomeWrapper>
  )
}

export default SectionHome