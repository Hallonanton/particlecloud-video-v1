import React, { Component } from 'react'
import styled from '@emotion/styled'
import { theme } from '../Layout/Theme'
import ThreeHome from './ThreeHome'


/*==============================================================================
  # Styles
==============================================================================*/

const AboutWrapper = styled('div')`
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: ${theme.colors.black};
  transition: all ${theme.easings.reveal};
`


/*==============================================================================
  # Component
==============================================================================*/

class SectionHome extends Component {

  render () {
    return (
      <AboutWrapper>
        <ThreeHome />
      </AboutWrapper>
    )
  }  
}

export default SectionHome