import React from 'react'
import PropTypes from 'prop-types'
import { ArticlePostTemplate } from '../../templates/SingleArticle'

const ArticlePostPreview = ({ entry, widgetFor }) => (
  <ArticlePostTemplate
    content={widgetFor('body')}
    description={entry.getIn(['data', 'description'])}
    tags={entry.getIn(['data', 'tags'])}
    title={entry.getIn(['data', 'title'])}
  />
)

ArticlePostPreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default ArticlePostPreview
