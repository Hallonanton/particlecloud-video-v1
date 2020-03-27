import React, { Component } from 'react'
import styled from '@emotion/styled'
import { theme } from '../Layout/Theme'


/*==============================================================================
  # Styles
==============================================================================*/

const AboutWrapper = styled('div')`
  display: flex;
  justify-cotent: center;
  align-items: center;
  color: ${theme.colors.white};
  background: ${theme.colors.black};
  height: 100%;
  width: 100%;
  max-width: 0%;
  margin-left: 50%;
  transition: all ${theme.easings.reveal};

  &.reveal {
    max-width: 100%;
    margin-left: 0%;
  }
`


/*==============================================================================
  # Component
==============================================================================*/

class SectionAbout extends Component {

  componentDidMount() {
    const delay = this.props.transitionLink.entry.delay

    if ( delay ) {
      this.revealTimeout = setTimeout(() => {
        this.toggleReveal()
      }, delay*1000 )
    } else {
      this.toggleReveal()
    }
  }

  componentWillUnmount() {
    clearTimeout( this.revealTimeout )
  }

  state = {
    reveal: false
  }

  toggleReveal = () => {
    this.setState({
      reveal: true
    })
  }

  render () {

    const { reveal } = this.state

    return (
      <AboutWrapper className={reveal ? 'reveal' : ''}>
        About
      </AboutWrapper>
    )
  }  
}

export default SectionAbout