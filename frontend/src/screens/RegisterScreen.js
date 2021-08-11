// Form fieds are part of the component state
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
    // Set up component level state
    // Fields
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo } = userRegister

    // location.search has URL query string
    const redirect = location.search ? location.search.split('=')[1] : '/'

    // Redirect if user is already logged in
    useEffect(() => {
        // check for user info
        if(userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    // Pass in e for the form
    const submitHandler = (e) => {
        // Prevent the page from refreshing
        e.preventDefault()
        // Check password fields
        if(password !== confirmPassword) {
            setMessage('Passwords do not match')
            // How to check for empty values???
        } else {
            // Dispatch Register
            dispatch(register(name, email, password))
        }
    }

    return (
      <FormContainer>
          <h1>Sign Up</h1>
          {message && <Message variant='danger'>{message}</Message>}
          {error && <Message variant='danger'>{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                    type='name' 
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></Form.Control>
              </Form.Group>

              <Form.Group controlId='email'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type='email' 
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></Form.Control>
              </Form.Group>

              <Form.Group controlId='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type='password' 
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></Form.Control>
              </Form.Group>

              <Form.Group controlId='confirmPassword'>
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control 
                    type='password' 
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary'>
                  Register
              </Button>
          </Form>

          <Row className='py-3'>
              <Col>
                Have an Account?{' '}
                <Link to={redirect 
                  ? `/login?redirect=${redirect}`
                  : '/login'
                  }>
                      Login
                </Link>
              </Col>
          </Row>
      </FormContainer>
    )
}

export default RegisterScreen