import React, { Component } from 'react'
import styled from '@emotion/styled'

/*==============================================================================
  # Styles
==============================================================================*/

const SearchForm = styled('form')`
  width: 100%;
  margin-top: 30px;
`

const SearchInput= styled('input')`
  position: relative;
  width: 100%;
  border: 0px;
  border-bottom: 2px solid ${({theme}) => theme.colors.bg};
  color: ${({theme}) => theme.colors.text};
  ${({theme}) => theme.fontSizes.heading}
  transition: all 250ms ${({theme}) => theme.easings.primary};
  outline: 0;
  box-shadow: none;

  &::placeholder {
    color: ${({theme}) => theme.colors.bgContrast};
    transition: all 250ms ${({theme}) => theme.easings.primary};
  }

  &:focus,
  &.has-input {
    border-bottom: 2px solid ${({theme}) => theme.colors.text};

    &::placeholder {
      color: ${({theme}) => theme.colors.text};
    }
  }

  ${({theme}) => theme.above.md} {
    max-width: 66%;
  }
`


/*==============================================================================
  # Component 
==============================================================================*/

class Searchbar extends Component {

  state = {
    search: null
  }

  handleSearch = (e) => {

    this.setState({
      search: e.target.value
    })

    if ( this.props.onSearch ) {
      this.props.onSearch(e.target.value)
    }
  }

  render () {

    return (
      <SearchForm onSubmit={(e) => { 
        e.preventDefault()
        if ( typeof document !== 'undefined' ) {
          document.activeElement.blur()
        }
      }}>
        <SearchInput 
          type="text" 
          placeholder="Sök..."
          className={this.state.search ? 'has-input' : null}
          onChange={e => this.handleSearch(e)}
        />
        <input 
          type="submit" 
          value="Submit"
          tabIndex="-1"
          style={{
            visibility: 'hidden',
            position: 'absolute',
            left: -9999,
            width: 1,
            height: 1
          }} 
        />
      </SearchForm>
    )
  }
}

export default Searchbar