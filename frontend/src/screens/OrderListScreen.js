import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listMyOrders } from '../actions/orderActions'

const OrderListScreen = ({ history, match }) => {
    const dispatch = useDispatch()

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if(userInfo && userInfo.isAdmin) {
            dispatch(listMyOrders())  
        } else {
            history.push('/login')
        }
        // Dependency array
    }, [dispatch, history, userInfo])

      // Handler
      const deleteHandler = (id) => {
          // How to style this??
          if(window.confirm('Are you sure?')) {
              //dispatch(deleteOrder(id))
          }
    }

    return (
        <>
            <h1>Orders</h1>
            {/*{loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> 
            : (*/}
                <Table 
                    striped 
                    bordered 
                    hover
                    responsive
                    className='table-sm'
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/**Loop through the user list and display each user */}
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.isPaid}</td>
                                <td>{order.isDelivered}</td>
                                <td>
                                    {order.isAdmin ? (
                                        <i className='fas fa-check' style ={{color: 'green'}}></i>
                                    ) : (
                                        <i className='fas fa-times' style={{color: 'red'}}></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/order/${order._id}/edit`}>
                                        <Button variant='light' className='btn=sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button 
                                        variant='danger' 
                                        className='btn-sm'
                                        onClick={() => deleteHandler(order._id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            {/*)*/}}
        </>
    )
}

export default OrderListScreen