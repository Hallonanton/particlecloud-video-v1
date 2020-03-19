import React, { Component } from 'react'
import styled from '@emotion/styled'
import NavigationItem, { StyledLink, SubMenu } from './NavigationItem'

/*==============================================================================
  # Styles
==============================================================================*/

const NavigationList = styled('ul')`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex-grow: 1;
  flex-basis: 0;
  align-items: center;
`

const StyledNavigationItem = styled(NavigationItem)`
  width: 100%;
  margin-right: 0px;

  ${StyledLink} {
    padding: 8px 21px 8px 16px;
    border-bottom: 1px solid ${({theme}) => theme.colors.bgContrastLower};

    &:hover {
      background-color: ${({theme}) => theme.colors.bgContrastLower};
      padding: 8px 16px 8px 21px;
    }
  }

  ${SubMenu} {
    li {
      margin-right: 0px;
    }

    ${StyledLink} {
      padding-left: 32px;

      &::before {
        dislay: block;
        content: "";
        position: absolute;
        top: 50%;
        left: 16px;
        width: 6px;
        height: 4px;
        border-left: 1px solid ${({theme}) => theme.colors.bgContrastLow};
        border-bottom: 1px solid ${({theme}) => theme.colors.bgContrastLow};
        transform: translateY(-50%);
      }

      &:hover {
        padding-left: 37px;
      }
    }
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class VerticalNav extends Component {

  render () {

    const { links, ...rest } = this.props

    return links && (links.length > 0) ? (
      <NavigationList {...rest}>
        {links.map((link, i) => (
          <StyledNavigationItem key={i} {...link} animateHeight={true} />
        ))}
      </NavigationList>
    ) : null
  }
}

export default VerticalNav


