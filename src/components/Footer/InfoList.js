import React, { Component } from 'react'
import styled from '@emotion/styled'
import Link from '../Link'
import Text from '../UI/Text'
import { Heading } from '../UI/Headings'


/*==============================================================================
  # Styles
==============================================================================*/

const ListWrapper = styled('nav')`
  width: 100%;
  padding: 0px 15px;
  margin-top: 40px;
  text-align: center;

  ${({theme}) => theme.above.xs}  {
    width: auto;
  }

  ${({theme}) => theme.above.md} {
    padding: 0px;
    margin-top: 0px;
    margin-left: 60px;
    text-align: left;

    &:first-of-type {
      margin-left: 0px;
    }
  }
`

const List = styled('ul')`
  margin-top: 12px;
` 

const ListItem = styled('li')`
  margin-bottom: 3px;

  a,
  a.mail,
  a.phone {
    ${({theme}) => theme.styles.linkEase}
  }
` 


/*==============================================================================
  # Component
==============================================================================*/

const Item = ({title, to, target, ...rest}) => {

  if ( to ) {
    return (

      <ListItem {...rest}>
        <Link to={to} target={target}>{title}</Link>
      </ListItem>

    )
  } else {
    return (

      <ListItem {...rest}>
        <Text full={true} content={title}/>
      </ListItem>

    )
  }
}

class InfoList extends Component {

  render() {

    let { title, items } = this.props

    return (
      <ListWrapper>
        
        {title ? (<Heading>{title}</Heading>) : null}

        <List>
          {items && (items.length > 0) ? items.map((item, i) => (
            <Item key={i} {...item} />
          )) : null}
        </List>

      </ListWrapper>
    )
  }
}

export default InfoList
