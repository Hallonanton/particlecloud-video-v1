import React from 'react'

export const Mega = ({size = 'h1', children, className, ...rest}) => {
	const Tag = size
	let classNames = ['mega-size', className].join(' ');
	return <Tag className={classNames}>{children}</Tag>
}

export const Hero = ({size = 'h1', children, className, ...rest}) => {
	const Tag = size
	let classNames = ['hero-size', className].join(' ');
	return <Tag className={classNames}>{children}</Tag>
}

export const Heading = ({size = 'h2', children, className, ...rest}) => {
	const Tag = size
	let classNames = ['heading-size', className].join(' ');
	return <Tag className={classNames}>{children}</Tag>
}

export const SubHeading = ({size = 'h3', children, className, ...rest}) => {
	const Tag = size
	let classNames = ['sub-heading-size', className].join(' ');
	return <Tag className={classNames}>{children}</Tag>
}

export const SmallHeading = ({size = 'h4', children, className, ...rest}) => {
	const Tag = size
	let classNames = ['small-heading-size', className].join(' ');
	return <Tag className={classNames}>{children}</Tag>
}