import React, { Component } from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'

/*==============================================================================
  # Styles
==============================================================================*/

const keyframeTop = keyframes`
  0% {
    right: auto;
    left: 0px;
    max-width: 100%;
  }
  100% {
    right: auto;
    left: 0px;
    max-width: 0%;
  }
`

const keyframeMid = keyframes`
  0% {
    transform: rotate(0deg) translateZ(0) scale(1, 1);
  }
  100% {
    transform: rotate(-45deg) translateZ(0) scale(1, 1);
  }
`

const keyframeMidAfter = keyframes`
  0% {
    transform: rotate(0deg) translateZ(0) scale(1, 1);
  }
  100% {
    transform: rotate(-90deg) translateZ(0) scale(1, 1);
  }
`

const keyframeBot = keyframes`
  0% {
    right: 0px;
    left: auto;
    max-width: 100%;
  }
  100% {
    right: 0px;
    left: auto;
    max-width: 0%;
  }
`

const Hamburger = styled('span')`
  --transition-time: 300ms;
  --transition-easing: ${({theme}) => theme.easings.easeInOutBack};

  position: relative;
  display: block;
  width: 35px;
  height: 30px;
  cursor: pointer;
  user-select: none;
  z-index: 3;

  .menu-row {
    position: absolute;
    top: calc(50% - 2px);
    left: 0;
    display: block;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background-color: ${({theme}) => theme.colors.text};
    transition: all var(--transition-time) var(--transition-easing);

    &.top {
      right: 0px;
      left: auto;
      max-width: 100%;
      transform: translateY(-11px) translateZ(0) scale(1, 1);
    }

    &.mid {
      transition: all var(--transition-time) var(--transition-easing);
      transform: rotate(-180deg) translateZ(0) scale(1, 1);
      
      &::after {
        display: block;
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        border-radius: 2px;
        background-color: inherit;
        transform: rotate(0deg) translateZ(0) scale(1, 1);
        transition: all var(--transition-time) ease;
      }
    }

    &.bot {
      right: auto;
      left: 0px;
      max-width: 100%;
      transform: translateY(11px) translateZ(0) scale(1, 1);
    }
  }

  ${({ open }) =>
    open && 
    css`
      .menu-row {
        transition: all 0ms linear;
        
        &.top {
          max-width: 0%;
          animation: ${keyframeTop} var(--transition-time) var(--transition-easing);
        }

        &.mid {
          transform: rotate(-45deg) translateZ(0) scale(1, 1);
          animation: ${keyframeMid} var(--transition-time) var(--transition-easing);
          
          &::after {
            transform: rotate(-90deg) translateZ(0) scale(1, 1);
            transition: all 0ms linear;
            animation: ${keyframeMidAfter} var(--transition-time) var(--transition-easing);
          }
        }

        &.bot {
          max-width: 0%;
          animation: ${keyframeBot} var(--transition-time) var(--transition-easing);
        }
      }
    `
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class HamburgerIcon extends Component {

  toggleMenu = () => {
    const open = !this.props.open

    if (this.props.onToggleMenu) {
      this.props.onToggleMenu(open)
    }
  }

  render() {
    return (
      <Hamburger 
        open={this.props.open} 
        onClick={() => this.toggleMenu()}
      >
        <span className="menu-row top"></span>
        <span className="menu-row mid"></span>
        <span className="menu-row bot"></span>
      </Hamburger>
    )
  }
}

export default HamburgerIcon