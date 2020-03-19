import React from 'react';
import styled from '@emotion/styled'
import { css } from '@emotion/core'

const StyledText = styled('div')`
  max-width: 540px;
  color: ${({ theme }) => theme.colors.text};
  ${({ theme }) => theme.fontSizes.regular}

  ${({ theme }) => theme.above.sm} {
    max-width: 840px;

    ${({ small }) =>
      small &&
      css`
        max-width: 540px;
      `};
  }

  ${({ full }) =>
    full &&
    css`
      max-width: none;
    `};
  
  ul,
  ol {
    padding-left: 3px;
    list-style-position: inside;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  ul ul,
  ol ul {
    list-style-type: circle;
    list-style-position: inside;
    margin-left: 15px;
  }

  ol ol,
  ul ol {
    list-style-type: lower-latin;
    list-style-position: inside;
    margin-left: 15px;
  }

  p,
  ul,
  ol {
    margin-bottom: 10px;
  }

  hr {
    border-top: 1px solid ${({ theme }) => theme.colors.bgContrastLow};
  }

  strong {
    font-weight: 700;
  }

  blockquote {
    display: block;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    text-align: center;
    text-transform: uppercase;
    ${({ theme }) => theme.fontSizes.heading}

    p:last-of-type {
      margin-bottom: 0px;
    }

    &::before,
    &::after {
      display: block;
      width: 100%;
      content: '“';
      max-width: 700px;
      margin: 10px auto 0px;
      text-align: center;
      text-transform: uppercase;
      ${({ theme }) => theme.fontSizes.heading}
    }
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;

    &.phone,
    &.mail {
      color: ${({ theme }) => theme.colors.text};
      text-decoration: none;
    }
  }

  img {
    display: inline-block;
    max-width: 100%;
  }
`;

const Text = ({ className, content, small, full, replace = true }) => {
  let text = content ? content : '';

  if ( replace ) {
    //Test text for email adresses to wrap with a link
    const mail_regex = /[a-zA-ZÅÄÖåäö–0-9-_.]{2,}[@][a-zA-ZÅÄÖåäö–0-9-_.]{2,}[.][a-zA-ZÅÄÖåäö–0-9-_.]{2,8}/gi;

    text = text.replace(mail_regex, function(match) {
      return `<a class="mail" href="mailto:${match}">${match}</a>`;
    });

    //Test contact_details for phone numbers to wrap with a link
    const phone_regex = /[+0-9]{2,5}[-– ]{1,3}[0-9]{2,}[ ][0-9]{2,}[ ][0-9]{2,}[ ][0-9]{2,}|[+0-9]{2,5}[-– ]{1,3}[0-9]{2,}[ ][0-9]{2,}[ ][0-9]{2,}|[+0-9]{2,5}[-– ]{1,3}[0-9]{2,}[ ][0-9]{2,}|[+0-9]{2,5}[-– ]{1,3}[0-9]{5,}|[+0-9]{5,}/gi;

    text = text.replace(phone_regex, function(match) {
      return `<a class="phone" href="tel:${match}">${match}</a>`;
    });
  }

  return (
    <StyledText
      className={className}
      small={small}
      full={full}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
};

export default Text;
