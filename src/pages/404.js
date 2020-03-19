import React from 'react'
import styled from '@emotion/styled'
import Layout from '../components/Layout/Layout'
import PageMetadata from '../components/Layout/PageMetadata'
import Container from '../components/UI/Grid'
import { Mega } from '../components/UI/Headings'
import Text from '../components/UI/Text'
import Button from '../components/UI/Button'

/*==============================================================================
  # Styles
==============================================================================*/

const StyledContainer = styled(Container)`
	padding-top: 50px;
	padding-bottom: 50px;
	align-items: center;
`

const Content = styled('div')`
	width: 100%;
	max-width: 540px;
`


const Heading = styled(Mega)`
	margin-bottom: 30px;
`

const StyledButton = styled(Button)`
	max-width: 220px;
	margin-top: 30px;
`

/*==============================================================================
  # Components
==============================================================================*/

const NotFoundPage = () => (
  <Layout>
  	<PageMetadata metaTitle="Något gick fel..." />
    <StyledContainer>
    	<Content>
	    	<Heading>Något gick fel...</Heading>
	    	<Text 
	    		small
	    		content="Den sidan du söker verkar inte finnas. Detta kan bland annat bero på en felaktig länk eller att sidan har tagits bort." 
	    	/>
	    	<StyledButton to="/">Till startsidan</StyledButton>
    	</Content>
    </StyledContainer>
  </Layout>
)

export default NotFoundPage
