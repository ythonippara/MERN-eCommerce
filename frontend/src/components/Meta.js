import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name='description' meta={description}></meta>
            <meta name='keywords' meta={keywords}></meta>
        </Helmet>
    )
}

Meta.defaultProps = {
    title: 'Welcome To Proshop',
    description: 'We sell the best products for cheap',
    keywords: 'electronics, buy electronics, cheap electronics'
}

export default Meta
