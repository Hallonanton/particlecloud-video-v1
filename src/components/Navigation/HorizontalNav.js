import React, { Component } from 'react'
import styled from '@emotion/styled'
import NavigationItem, { StyledLink, Icon, SubMenu } from './NavigationItem'

/*==============================================================================
  # Styles
==============================================================================*/

const NavigationList = styled('ul')`
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  flex-grow: 1;
  flex-basis: 0;
  align-items: center;
`

const StyledNavigationItem = styled(NavigationItem)`
  
  ${StyledLink} {
    padding-top: 8px;
    padding-bottom: 8px;

    &:hover,
    &[aria-current="page"] {
      &::after {
        border-color: ${({theme}) => theme.colors.primary};
      }
    }
  }

  ${Icon} {
    & + span {
      display: none;
    }
  }

  &:last-child {
    ${Icon} {
      margin-right: 0;
    }
  }

  &:hover {
    ${SubMenu} {
      visibility: visible;
      opacity: 1;
      transform: translateY( 0px ) translateX(-50%);
      transition: all 450ms ${({theme}) => theme.easings.primary};
    }

    ${StyledLink} {
      &::after {
        transform: translate(-75%, -25%) rotate(135deg);
      }
    }
  }

  ${SubMenu} {
    position: absolute;
    top: 100%;
    left: 50%;
    min-width: 200px;
    border-radius: 4px;
    background-color: ${({theme}) => theme.colors.bg};
    box-shadow: ${({theme}) => theme.styles.boxshadow};
    visibility: hidden;
    opacity: 0;
    transform: translateY( 10px ) translateX(-50%);
    transition: all 450ms ${({theme}) => theme.easings.primary} 100ms;

    li {
      margin-right: 0px;

      &:first-of-type {
        ${StyledLink} {
          padding-top: 10px;
        }
      }

      &:last-child {
        ${StyledLink} {
          padding-bottom: 10px;
        }
      }
    }

    ${StyledLink} {
      padding: 5px 20px 5px 15px;
      border-radius: 4px;

      &:hover {
        padding: 5px 15px 5px 20px;
        background-color: ${({theme}) => theme.colors.bgContrastLower};
      }
    }
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class HorizontalNav extends Component {

  render () {

    const { links, ...rest } = this.props

    return links && (links.length > 0) ? (
      <NavigationList {...rest}>
        {links.map((link, i) => (
          <StyledNavigationItem key={i} {...link} />
        ))}
      </NavigationList>
    ) : null
  }
}

export default HorizontalNav


