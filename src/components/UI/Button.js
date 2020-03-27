import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { darken } from 'polished'

/*==============================================================================
  # Styles
==============================================================================*/

const secondaryStyle = theme => css`
  color: ${theme.colors.bg};
  background-color: ${theme.colors.bgContrastHigh};

  &:hover {
  	background-color: ${darken(0.1, theme.colors.bgContrastHigh)};
  }
`;

const disabledStyle = () => css`
  opacity: 0.5;
  cursor: default;
`;

export const buttonStyle = ({ secondary, theme, disabled }) => css`
  display: inline-block;
  width: 100%;
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  color: ${theme.colors.bg};
  background-color: ${theme.colors.primary};
  text-transform: uppercase;
  outline: 0;
  cursor: pointer;
  transition: ${theme.easings.secondary};

  &:hover {
    text-decoration: none;
    background-color: ${darken(0.1, theme.colors.primary)};
  }

  ${secondary && secondaryStyle(theme)};
  ${disabled && disabledStyle(theme)};
`;

const Inner = styled('span')`
	position: relative;
	display: inline-block;
	transform: translateY(0px);
	transition: ${({theme}) => theme.easings.secondary};

	&::after {
		display: block;
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		width: 100%;
		max-width: 0%;
		height: 2px;
		opacity: 0;
		background-color: ${({theme}) => theme.colors.bg};
		transform:translate(-50%, 0px);
		transition: ${({theme}) => theme.easings.primary};
	}
`

const BaseButtonLink = styled(Link)`
  ${buttonStyle}

  &:hover {
    ${Inner} {
      transform: translateY(-2px);

      &::after {
        max-width: 100%;
        opacity: 1;
        transform:translate(-50%, 2px);
      }
    }
  }
`;

const Button = styled('button')`
  ${buttonStyle}

  &:hover {
	  ${Inner} {
	  	transform: translateY(-2px);

	  	&::after {
	  		max-width: 100%;
	  		opacity: 1;
	  		transform:translate(-50%, 2px);
	  	}
	  }
  }
`;


/*==============================================================================
  # Components
==============================================================================*/

export const ButtonLink = ({ children, ...props }) => (
  <BaseButtonLink {...props}>
    <Inner>{children}</Inner>
  </BaseButtonLink>
)

const ButtonWithLoading = ({ loading, loadingText, children, ...props }) =>
  loading ? (
    <Button {...props}>
      <Inner>{loadingText}</Inner>
    </Button>
  ) : (
    <Button {...props}>
    	<Inner>{children}</Inner>
    </Button>
  )

export default ButtonWithLoading;