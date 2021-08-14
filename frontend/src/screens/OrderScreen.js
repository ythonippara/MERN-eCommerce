import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET } from '../constants/orderConstants'

const OrderScreen = ({ match }) => {
    const orderId = match.params.id
    // A piece of state that shows SDK is ready
    const [sdkReady, setSdkReady] = useState(false)

    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    // Use : to rename an item to avoid duplicate names
    const { loading:loadingPay, success:successPay } = orderPay

    if(!loading) {
        // Show 2 decimals
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100 ).toFixed(2)
        }

        // Calculate prices
        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
        )
    }

    useEffect(() => {
        // Load PayPal script dynamically
        const addPayPalScript = async () => {
            // Fetch the Client ID from the backend
            const { data: clientId } = await axios.get('/api/config/paypal')
            // Vanilla JavaScript
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async =  true
            script.onload = () => {
                // This line indicates that the script has been loaded
                setSdkReady(true)
            }
            // Add script to the body
            document.body.appendChild(script)
        }

        // 1. Check for the order, if doesn't exist load the details..
        // 2. Make sure that the order ID matches the ID in the URL
        // 3. If payment is successful load the order again
        if(!order || successPay || order._id !== orderId) {
            dispatch({ type: ORDER_PAY_RESET })
            // If it does not, fetch the most recent order
            dispatch(getOrderDetails(orderId))
            // Check if the order has been paid
        } else if(!order.isPaid) {
            // Check if the script has loaded
            if(window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay])

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId, paymentResult))
    }

    return loading ? (
        <Loader /> 
        ) : error ? ( <Message variant='danger'>{error}</Message> 
        ) : ( <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, 
                                {' '}{order.shippingAddress.city},
                                {' '}{order.shippingAddress.postalCode},
                                {' '}{order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? ( 
                                <Message variant='success'>Delivered on {order.deliveredAt}</Message> 
                            ) : (
                                <Message variant='danger'>Not Delivered</Message>  
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? ( 
                                <Message variant='success'>Paid on {order.paidAt}</Message> 
                            ) : (
                                <Message variant='danger'>Not Paid</Message>  
                            )} 
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {/*Check length*/}
                            {order.orderItems.length === 0  
                            ? <Message>Order is empty</Message> 
                            : (
                                <ListGroup variant='flush'>
                                    {/*Loop*/}
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image 
                                                        src={item.image}
                                                        alt={item.image}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>   
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {/**Add Paypal & Mark as Delivered Buttons */}
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton 
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        >
                                        </PayPalButton>
                                    )}
                                </ListGroup.Item>
                            )}

                        </ListGroup>
                    </Card>
                </Col>
            </Row>
    </> )
}

export default OrderScreen