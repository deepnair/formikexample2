import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Formik, Form, Field} from 'formik'
import { stringify } from 'querystring'
import {CheckboxWithLabel, TextField} from 'formik-mui'

const Home: NextPage = () => {
  return (
    <>
      <Formik initialValues={{
        firstName: '',
        lastName: '',
        millionaire: false,
        money: 0,
        description: ''
      } 
      } onSubmit = {() => {}}>
        <Form>
          <Field fullWidth name='firstName' label='firstName' component={TextField}/>
          <Field fullWidth name='lastName' label='lastName' component={TextField}/>
          <Field fullWidth name='millionaire' type='checkbox' Label={{label:'Are you a millionaire'}} component={CheckboxWithLabel}/>
          <Field fullWidth name='money' type='number' label='How much money do you have' component={TextField}/>
          <Field fullWidth name='description' label='Describe your money situation' component={TextField}/>
        </Form>
      </Formik>
    </>
  )
}

export default Home
