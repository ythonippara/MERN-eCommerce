import axios from 'axios'
import {
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_RESET,
} from '../constants/orderConstants'

export const createOrder = (order) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST
        })

        // Get access to the logged in user object
        const { userLogin: { userInfo } } = getState()
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // Get token with getState and pass in headers
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            '/api/orders',
            order,
            config
        )

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({ 
            type: ORDER_CREATE_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}

export const getOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST
        })

        // Get access to the logged in user object
        const { userLogin: { userInfo } } = getState()
        
        const config = {
            headers: {
                // Content-Type is not needed for get request
                // Get token with getState and pass in headers
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(
            `/api/orders/${id}`,
            config
        )

        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({ 
            type: ORDER_DETAILS_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}

export const payOrder = (orderId, paymentResult) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ORDER_PAY_REQUEST
        })

        // Get access to the logged in user object
        const { userLogin: { userInfo } } = getState()
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // Get token with getState and pass in headers
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.put(
            // No need to pass the whole order object
            `/api/orders/${orderId}/pay`,
            paymentResult,
            config
        )

        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({ 
            type: ORDER_PAY_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}