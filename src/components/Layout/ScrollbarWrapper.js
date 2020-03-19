import React, { Component, Fragment } from 'react'
import styled from '@emotion/styled'
import { Scrollbars } from 'react-custom-scrollbars';
import { isPc } from 'react-custom-scrollbars';


/*==============================================================================
  # Styles
==============================================================================*/

const Thumb = styled('div')`
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.bgContrast};
`

const Track = styled('div')`
  z-index: 100;
`

const TrackVertical = styled(Track)`
  top: 2px;
  right: 2px;
  bottom: 2px;
`

const TrackHorizontal = styled(Track)`
  right: 2px;
  left: 2px;
  bottom: 2px;
`


/*==============================================================================
  # Component
==============================================================================*/

class ScrollbarWrapper extends Component {
  
  componentDidMount() {
    document.scrollbar = new CustomEvent('scrollbar', { 
      detail:   "Triggers when react-component scrollbar scrolls",
      bubbles:  true
    })
    window.addEventListener('scroll', this.handleRegularScroll)
  }

  componentWillUnmount() {
  	window.removeEventListener('scroll', this.handleRegularScroll)
  }	

  handleRegularScroll = ( event ) => {
    if ( typeof document !== 'undefined' && document.scrollbar ) {
      document.scrollbar.top = window.scrollY
      document.scrollbar.left = window.scrollX
      document.dispatchEvent( document.scrollbar )
    }
  }

  handleCustomScroll = ( values ) => {
    if ( typeof document !== 'undefined' && document.scrollbar ) {
      document.scrollbar.top = values.scrollTop
      document.scrollbar.left = values.scrollLeft
      document.dispatchEvent( document.scrollbar )
    }
  }

  render () {
    
    return isPc ? (
      <Scrollbars
        style={{ width: '100vw', height: '100vh' }}
        onScrollFrame={this.handleCustomScroll}
        renderTrackVertical={({...props }) => <TrackVertical {...props} />}
        renderTrackHorizontal={({...props }) => <TrackHorizontal {...props} />}
        renderThumbVertical={({...props }) => <Thumb {...props} />}
        renderThumbHorizontal={({...props }) => <Thumb {...props} />}
        autoHide={false}
        autoHideTimeout={1500}
        autoHideDuration={300}
      >
        {this.props.children}
      </Scrollbars>
    ) : (
    	<Fragment>
    		{this.props.children}
    	</Fragment>
    )
  }
} 


export default ScrollbarWrapper