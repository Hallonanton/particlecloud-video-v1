import React from 'react'
import styled from '@emotion/styled'
import Link from '../Link'
import { theme } from '../Layout/Theme'

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

const NavigationItem = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 5px;
  color: ${theme.colors.text};
  text-decoration: none;
  ${theme.fontSizes.regular}
  transition: ${theme.easings.secondary};

  &:hover {
    color: ${theme.colors.textHover};
  }
`

const Icon = styled('span')`
  svg,
  img {
    display: block;
    width: 1.8rem;
    height: 1.8rem;
    object-fit: contain;

    path,
    circle,
    rect {
      fill: currentColor !important;
      stroke: currentColor !important;
    }
  }
`


/*==============================================================================
  # Component
==============================================================================*/

const IconNav = ({ links, ...rest }) => {
  return links && (links.length > 0) ? (
    <NavigationList {...rest}>
      {links.map((link, i) => (
        <NavigationItem 
          key={i}
          to={link.to}
          target={link.target}
          title={link.title}
        >
          <Icon>{link.icon}</Icon>
        </NavigationItem>
      ))}
    </NavigationList>
  ) : null
}

export default IconNav

