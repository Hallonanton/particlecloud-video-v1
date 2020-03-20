import React, { Component } from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
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
  padding: 15px;
`

const Description = styled('div')`
  margin-bottom: 30px;
  color: ${theme.colors.text};
  text-align: center;

  .title {
    width: 100%;
    text-transform: uppercase;
    ${theme.fontSizes.regular}
  }

  .subTitle {
    width: 100%;
    text-transform: lowercase;
    ${theme.fontSizes.description}
  }
`

const Navigation = styled('ul')`
  position: relative;
`

const Item = styled('li')`
  position: absolute;
  transform-origin: 50% 50%;
  transform-style: preserve-3d;
  transition: all 250ms ease;
  z-index: 1;

  a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: transparent;
    text-decoration: none;
    transition: all 250ms ease;
  }

  &.active {
    z-index: 2;

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
    window.addEventListener("wheel", this.handleScroll)
    window.addEventListener("keydown", this.handleKey)

    this.setState({
      items: this.props.items
    })
  }

  componentWillUnmount() {
    clearTimeout(this.resetIndexTimeout);
    clearTimeout(this.scrollTimeout);
    window.removeEventListener("wheel", this.handleScroll)
    window.removeEventListener("keydown", this.handleKey)
  }

  state = {
    prevScroll: null,
    activeIndex: null,
    items: null, 
    orientation: 'portrait',
    navWidth: 300,
    navHeight: 450
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
      }, 5000) )
    }, 50)
  }

  handleKey = e => {
    if( e.key === "ArrowUp" ) {
       this.indexStep( -1 );
       
    } else if ( e.key === "ArrowDown" ) {
       this.indexStep( 1 );

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

      //Get index of current hover
      let i = 0;
      while( (li = li.previousSibling) != null ) {
        i++;
      }

      this.setState({
        activeIndex: i
      })
    }
  }

  resetActiveIndex = () => {
    this.setState({
      activeIndex: null
    })
  }

  render () {

    const { items, activeIndex, navWidth, navHeight, orientation } = this.state

    console.log('----')

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
          width = isActive && isPortrait ? width+20 : width
          height = isActive && isPortrait ? height+40 : height

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
              translateX = '-10px'
              translateY = '-20px'

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


          console.log( 'difference', difference )
          console.log( 'fromEnd', fromEnd )
          console.log( 'position', position )


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
            >
              <Link
                to={item.to}
                onClick={e => this.setActiveIndex(e)}
                onMouseEnter={e => this.setActiveIndex(e)}
              >
                <h3>{item.title}</h3>
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
      to: "/nybergs-bil",
      color: "#9e7b56"
    },
    {
      title: "Svenska Hem",
      to: "/svenska-hem",
      color: "#e03131"
    },
    {
      title: "OAS",
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

    </HomeWrapper>
  )
}

export default SectionHome