import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import axios from 'axios'

const HomeScreen = () => {
    // products - state name, setproducts - function to manipulate products
    // Then pass an empty array to useState
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            // De-structuring allows to use data variable directly
            const { data } = await axios.get('/api/products')
            setProducts(data)
        }

        fetchProducts()
        // Pass in array of dependencies to fire off side effects??
    }, [])

    return (
        <>
        <h1>Latest Products</h1>
        <Row>
            {products.map(product => (
                <Col sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                </Col>
            ))}
        </Row>
        </>
    )
}

export default HomeScreen
