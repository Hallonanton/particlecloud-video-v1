import React, { Component, Fragment } from 'react'
import SectionArticles from './SectionArticles'
import SectionImage from './SectionImage'
import SectionImageText from './SectionImageText'
import SectionText from './SectionText'
import SectionTextCards from './SectionTextCards'


/*==============================================================================
  # Component
==============================================================================*/

class Provider extends Component {

  state = {
    templates: {
      SectionArticles,
      SectionImage,
      SectionImageText,
      SectionText,
      SectionTextCards
    }
  }

  getTemplate = (name) => {
    return this.state.templates[name]
  }

  render () {

    const { sections } = this.props
    let usedH1 = false

    return (
      <Fragment>
        {sections && sections.length > 0 ? sections.map((section, i) => {

          const Section = this.getTemplate(section.sectionKey)
          let { title } = section;
          let isH1 = !!title && !usedH1 ? true : false;
          usedH1 = !!title ? true : usedH1

          return (
            <Section key={i} index={i} isH1={isH1} {...section} />
          )
        }) : null}
      </Fragment>
    )
  }
}

export default Provider
