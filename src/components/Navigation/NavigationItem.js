import React, { Component, Fragment } from 'react'
import AnimateHeight from 'react-animate-height'
import styled from '@emotion/styled'
import Link from '../Link'

/*==============================================================================
  # Styles
==============================================================================*/

const Item = styled('li')`
  position: relative;
  margin-right: 10px;

  &:last-child {
    margin-right: 0px;
  }
`

export const Icon = styled('span')`
  margin-right: 8px;

  svg,
  img {
    display: block;
    width: 1.8rem;
    height: 1.8rem;
    object-fit: contain;
    transition: all 450ms ${({theme}) => theme.easings.primary};

    path,
    circle,
    rect {
      fill: ${({theme}) => theme.colors.text} !important;
      stroke: ${({theme}) => theme.colors.text} !important;
      transition: all 450ms ${({theme}) => theme.easings.primary};
    }
  }
`

export const StyledLink = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px;
  color: ${({theme}) => theme.colors.text};
  text-decoration: none;
  ${({theme}) => theme.fontSizes.regular}
  transition: all 450ms ${({theme}) => theme.easings.primary};

  &:hover,
  &[aria-current="page"] {
    color: ${({theme}) => theme.colors.primary};
  }

  &[aria-current="page"] {
    cursor: default;
  }

  &:hover {
    color: ${({theme}) => theme.colors.primary};

    ${Icon} {
      svg {
        path,
        circle,
        rect {
          fill: ${({theme}) => theme.colors.primary} !important;
          stroke: ${({theme}) => theme.colors.primary} !important;
        }
      }
    }
  }

  &::after {
    position: absolute;
    top: 45%;
    right: 0;
    width: 8px;
    height: 8px;
    border-radius: 1px;
    border-top: 2px solid ${({theme}) => theme.colors.text};
    border-right: 2px solid ${({theme}) => theme.colors.text};
    transform: translate(-75%, -25%) rotate(45deg);
    transition: all 450ms ${({theme}) => theme.easings.primary};
  }

  &.has-submenu {
    padding-right: 18px;

    &::after {
      display: block;
      content: "";
    }
  }

  &.open {
    &::after {
      transform: translate(-75%, -25%) rotate(135deg);
    }
  }
`

export const SubMenu = styled('ul')`
  ${StyledLink} {
    ${({theme}) => theme.fontSizes.description}
  }
`


/*==============================================================================
  # Component
==============================================================================*/

const AnimateWrapper = ({animate, isOpen, children}) => {
  return animate ? (
    <AnimateHeight
      duration={450}
      height={isOpen ? 'auto' : 0} 
    >
      {children}
    </AnimateHeight>
  ) : (
    <Fragment>
      {children}
    </Fragment>
  )
}

class NavigationItem extends Component {

  componentDidMount() {
    const { submenu } = this.props
    this.setState({
      hasSubmenu: submenu && (submenu.length > 0)
    })
  }

  state = {
    isOpen: false,
    hasSubmenu: false
  }

  handleClick = (e) => {
    const { hasSubmenu } = this.state

    if ( hasSubmenu && typeof window !== 'undefined' && window.matchMedia('(max-width: 991.99px)') ) {
      e.preventDefault()
    }

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {

    const { className, to, title, icon, target, submenu, animateHeight, ...rest } = this.props
    const hasSubmenu = submenu && (submenu.length > 0)
    const { isOpen } = this.state

    let linkClasses = ""
    linkClasses += hasSubmenu ? " has-submenu" : ""
    linkClasses += icon ? " has-icon" : ""
    linkClasses += isOpen ? " open" : ""

    return (
      <Item className={className}>
        <StyledLink 
          to={to} 
          target={target} {...rest}
          className={linkClasses}
          onClick={(e) => this.handleClick(e)}
        >
          {icon ? (
            <Icon>{icon}</Icon>
          ) : null}
          <span>{title}</span>
        </StyledLink>

        {hasSubmenu ? (
          <AnimateWrapper animate={animateHeight} isOpen={isOpen}>
            <SubMenu className={isOpen ? 'open' : null}>
              {submenu.map((link, i) => (
                <NavigationItem key={i} {...link} />
              ))}
            </SubMenu>
          </AnimateWrapper>
        ) : null}
      </Item>
    )
  }
}

export default NavigationItem