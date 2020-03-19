import React, { Component } from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import Container from '../../UI/Grid'
import VerticalNav from '../../Navigation/VerticalNav'
import HamburgerIcon from './HamburgerIcon'
import Logo from '../../UI/Logo'


/*==============================================================================
  # Style
==============================================================================*/

const MobileContent = styled('section')`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 100%;
	opacity: 1;
	transition: all 450ms ${({theme}) => theme.easings.secondary};
	z-index: 2;

	&::before {
		display: block;
		content: "";
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: ${({theme}) => theme.colors.bg};
		z-index: 2;
	}

	${({theme}) => theme.above.md} {
		opacity: 0;
	}
`

const Menu = styled('nav')`
	position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  max-height: 100vh;
  padding: 0 0 15px;
  background-color: ${({theme}) => theme.colors.bg};
  box-shadow: ${({theme}) => theme.styles.boxshadow};
  ${({theme}) => theme.fontSizes.regular}
  opacity: 0;
  visibility: hidden;
  overflow: auto;
  overscroll-behavior: contain;
  transition: all 450ms ${({theme}) => theme.easings.primary};
  transform: translateY(-20px);
  z-index: 1;

  &::before {
    content: '';
    display: block;
    position: sticky;
    top: 0;
    height: var(--header-height);
    background-color: inherit;
  }

  ${({ open, theme }) =>
    open && 
    css`
			visibility: visible;
			opacity: 1;
			transform: translateY(0);
    `
	}
`

const MainNavigation = styled(VerticalNav)`
	padding-top: 15px;
	border-top: 1px solid ${({theme}) => theme.colors.bgContrastLow};
`

const SecondaryNavigation = styled(VerticalNav)`
	padding-bottom: 15px;
`


/*==============================================================================
  # Component
==============================================================================*/

class MobileNav extends Component {

  render() {

  	const { open, mainLinks, secondaryLinks } = this.props

    return (
			<MobileContent>

				<Logo/>

				<HamburgerIcon 
					open={open}
					onToggleMenu={menuOpen => this.props.onToggleMenu(menuOpen)} 
				/>

				<Menu open={this.props.open}>
					<Container>

						<MainNavigation links={mainLinks} />
		          
		        <SecondaryNavigation links={secondaryLinks} />

		      </Container>
				</Menu>

			</MobileContent>
    )
  }
}

export default MobileNav