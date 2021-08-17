import axios from 'axios'
import { 
    PRODUCT_LIST_REQUEST, 
    PRODUCT_LIST_SUCCESS, 
    PRODUCT_LIST_FAIL, 
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_CREATE_REVIEW_REQUEST,
    PRODUCT_CREATE_REVIEW_SUCCESS,
    PRODUCT_CREATE_REVIEW_FAIL,
} from '../constants/productConstants'

// Actions
// Use redux-thunk for async requests
export const listProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST })

        // Use axios
        const { data } = await axios.get('/api/products')

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_LIST_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}

export const listProductDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        // Use axios
        // Use back ticks `` to pass a literal 
        const { data } = await axios.get(`/api/products/${id}`)

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_DETAILS_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST })

        // Get access to the logged in user object
        const { userLogin: { userInfo } } = getState()
        
        const config = {
            headers: {
                // Get token with getState and pass in headers
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
        await axios.delete(`/api/products/${id}`, config)

        dispatch({ type: PRODUCT_DELETE_SUCCESS })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_DELETE_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}

export const createProduct = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_CREATE_REQUEST })

        // Get access to the logged in user object
        const { userLogin: { userInfo } } = getState()
        
        const config = {
            headers: {
                // Get token with getState and pass in headers
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
        const { data } = await axios.post(`/api/products`, {}, config)

        dispatch({ type: PRODUCT_CREATE_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_CREATE_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}

export const updateProduct = (product) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_UPDATE_REQUEST })

        // Get access to the logged in user object
        const { userLogin: { userInfo } } = getState()
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // Get token with getState and pass in headers
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
        const { data } = await axios.put(`/api/products/${product._id}`, product, config)

        dispatch({ type: PRODUCT_UPDATE_SUCCESS, payload: data })
        //dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ 
            type: PRODUCT_UPDATE_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}

export const createProductReview = (productId, review) => async (dispatch, getState) => {
    try {
        dispatch({ type: PRODUCT_CREATE_REVIEW_REQUEST })

        // Get access to the logged in user object
        const { userLogin: { userInfo } } = getState()
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                // Get token with getState and pass in headers
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        
        // Put into variable if message is needed
        await axios.post(`/api/products/${productId}/reviews`, review, config)

        dispatch({ type: PRODUCT_CREATE_REVIEW_SUCCESS })

    } catch (error) {
        dispatch({ 
            type: PRODUCT_CREATE_REVIEW_FAIL,
            payload: 
              error.response && error.response.data.message 
                ? error.response.data.message 
                : error.message
        })
    }
}