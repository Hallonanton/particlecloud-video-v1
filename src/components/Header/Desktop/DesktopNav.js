import React, { Component } from 'react'
import styled from '@emotion/styled'
import HorizontalNav from '../../Navigation/HorizontalNav'
import Logo from '../../UI/Logo'


/*==============================================================================
  # Style
==============================================================================*/

const DesktopContent = styled('div')`
  height: var(--header-height);
  opacity: 1;
  transition: all 450ms ${({theme}) => theme.easings.secondary};

  ${({theme}) => theme.below.md} {
    opacity: 0;
  }
`

const NavFlex = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
`

const LogoWrapper = styled('div')`
  display: flex;
  flex-basis: 0;
  flex-grow: 1;
`

const MainNavigation = styled(HorizontalNav)`
  justify-content: center;
`

const SecondaryNavigation = styled(HorizontalNav)`
  justify-content: flex-end;
`


/*==============================================================================
  # Component
==============================================================================*/

class DesktopNav extends Component {

  render() {

    const { mainLinks, secondaryLinks } = this.props

    return (
		  <DesktopContent role="navigation">
        <NavFlex>

          <LogoWrapper>
            <Logo/>
          </LogoWrapper>
      
          <MainNavigation links={mainLinks} />
          
          <SecondaryNavigation links={secondaryLinks} />

        </NavFlex>
		  </DesktopContent>
    )
  }
}

export default DesktopNav