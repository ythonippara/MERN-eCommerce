//import React, { useState, useEffect } from 'react'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import { listProducts, listTopProducts } from '../actions/productActions'
//import axios from 'axios'

const HomeScreen = ({ match }) => {
    // products - state name, setproducts - function to manipulate products
    // Then pass an empty array to useState
    //const [products, setProducts] = useState([])

    //useEffect(() => {
        //const fetchProducts = async () => {
            // De-structuring allows to use data variable directly
            //const { data } = await axios.get('/api/products')
            //setProducts(data)
        //}

        //fetchProducts()
        // Pass in array of dependencies to fire off side effects??
    //}, [])

    const keyword = match.params.keyword
    // To test pagination enter localhost:3000/page/2 ...
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    const productList = useSelector(state => state.productList)
    // Destructure productList
    const {loading, error, products, pages, page } = productList

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber))
        // Add dispatch as a dependency to avoid console warning
    }, [dispatch, keyword, pageNumber])

    return (
        <>
        {!keyword && <ProductCarousel /> }
            <h1>Latest Products</h1>
            {loading ? <Loader />
            : error ? <Message variant='danger'>{error}</Message> 
            :  
            <>
                <Row>
                {products.map(product => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                        <Product product={product} />
                    </Col>
                ))}
                </Row>
                <Paginate 
                    pages={pages}
                    page={page}
                    /**If keyword exists then use keyword else use emptry string.*/
                    keyword={keyword ? keyword : ''}
                />
            </>
            }
        </>
    )
}

export default HomeScreen
