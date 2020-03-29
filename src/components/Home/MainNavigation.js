import React, { Component } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import TransitionLink from 'gatsby-plugin-transition-link'
import { theme } from '../Layout/Theme'
import { lightenDarkenColor, isTouchDevice } from '../../utility/functions'

/*==============================================================================
  # Styles
==============================================================================*/

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
  width: 100%;
  max-width: 0;
  z-index: 1;

  //Loop out delay for reveal animation
  ${[...Array(6)].map((item, i) => css`
    &:nth-of-type(${i+1}){
      transition: ${theme.easings.primary},
                  max-width ${theme.easings.reveal} ${i * parseInt(theme.easings.revealDelay)}ms;
    }
  `)}

  // Animate width on load
  &.reveal {
    //Used for reveal animation
    max-width: 100%;
  }


  a,
  &::before,
  &::after {
    display: block;
    position: absolute;
    left: 50%;
    content: "";
    top: 50%;
    width: 110%;
    max-width: 100%;
    height: 200%;
    max-height: 102%; //102% to prevent divide between items
    transition: ${theme.easings.primary};
    //Scale down the item if the item isn't active
    transform: translateX(-50%) translateY(-50%) scale(${({scale}) => scale});
  }

  &::before {
    //Change background color depending on active item
    background-color: ${({backgroundColor}) => backgroundColor};
    z-index: 1;
  }

  &::after {
    opacity: 0;
    background-image: url('${({backgroundImage}) => backgroundImage}');
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 2;
  }

  a {
    z-index: 4;
  }

  // Active(Hovered) element
  &.active {
    a,
    &::before,
    &::after {
      max-width: 110% !important;
      max-height: 200% !important;
      //Scale up the item if its active
      transform: translateX(-50%) translateY(-50%) scale(1, 1);
    }
  }
`

const TextContainer = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  color: ${theme.colors.white};
  z-index: 3;
  transform: translate(-50%, -50%);

  .item--topTitle,
  .item--title {
    white-space: nowrap;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  .item--topTitle {
    ${theme.fontSizes.description}
    font-weight: 400;
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class MainNavigation extends Component {

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false)
    window.addEventListener('keydown', this.handleKey, false)

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
          let left = '50%'

          //Transform
          let difference = i - activeIndex
          difference = difference < 0 ? -difference : difference
          let fromEnd = i < (items.length - (i+1)) ? i : (items.length - (i+1))
          let position = i < activeIndex ? -1 : 1

          let scale = notActive ? 1 - (difference/65) : 1
          scale = isActive ? 1.1 : scale
          let translateY = 0

          if ( notActive ) {
            translateY = fromEnd === 0 ? 0 : `${position * (30/difference)}%`
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
                transform: `translate3d(-50%, ${translateY}, 0)`
              }}
              scale={scale}
              backgroundColor={backgroundColor}
              backgroundImage={item.backgroundImage}
            >
              <TransitionLink
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
                exit={{
                  trigger: () => this.props.exit(),
                  length: 1.5
                }}
                entry={{
                  delay: 1
                }}
              />
              <TextContainer>
                {item.topTitle && <h4 className="item--topTitle">{item.topTitle}</h4>}
                {item.title && <h3 className="item--title">{item.title}</h3>}
              </TextContainer>
            </Item>
          )
        })}
      </Navigation>
    )
  }
}

export default MainNavigation