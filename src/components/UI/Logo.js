import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'gatsby'
import PlaceholderLogo from "../../img/logo.svg"

/*==============================================================================
  # Styles
==============================================================================*/

const StyledLink = styled(Link)`
	position: relative;
	display: block;
	width: 130px;
	flex-shrink: 0;
	text-decoration: none;
	user-select: none;
	z-index: 3;

	svg, img {
		display: block;
	}
`


/*==============================================================================
  # Component
==============================================================================*/

const Logo = () => (
	<StyledLink to="/">
      <PlaceholderLogo />
    </StyledLink>	
)

export default Logo