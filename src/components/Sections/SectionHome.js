import React, { Component } from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
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
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 450px;
`

const Item = styled('li')`
  position: relative;
  flex-grow: 1;
  min-height: 0px;
  transition: all 250ms ease;

  a {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
    color: transparent;
    z-index: 2;
  }

  &.active {
    min-height: 60px;

    a {
      color: ${theme.colors.white};
    }
  }
`


/*==============================================================================
  # Component
==============================================================================*/

function lightenDarkenColor(col,amt) {
    var usePound = false;
    if ( col[0] === "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}


class MainNavigation extends Component {

  state = {
    activeIndex: null
  }

  setActiveIndex = e => {
    if ( e ) {
      let li = e.target.parentNode

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

    const { items } = this.props
    const { activeIndex } = this.state

    return (
      <Navigation 
        onMouseLeave={() => this.resetActiveIndex()}
      >
        {items.map((item, i) => {

          const isActive = activeIndex === i
          const step = 20
          const defaultColor = lightenDarkenColor(theme.colors.black, (step * (items.length - i)))
          const baseColor = activeIndex ? items[activeIndex].color : undefined
          const activeColor = activeIndex && baseColor ? lightenDarkenColor(baseColor, (-step * (activeIndex - i))) : undefined

          const background = activeColor ? activeColor : defaultColor

          return (
            <Item 
              key={i}
              className={isActive ? 'active' : null}
              style={{
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
      color: "#2ecc71"
    },
    {
      title: "Kunskap",
      to: "/knowledge",
      color: "#3498db"
    },
    {
      title: "Erfarenhet",
      to: "/experience",
      color: "#9b59b6"
    },
    {
      title: "OAS",
      to: "/oas",
      color: "#34495e"
    },
    {
      title: "Svenska Hem",
      to: "/svenska-hem",
      color: "#e74c3c"
    },
    {
      title: "Nybergs Bil",
      to: "/nybergs-bil",
      color: "#e67e22"
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