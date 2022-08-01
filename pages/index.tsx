import type { NextPage } from 'next'
import {Formik, Form, Field, FormikConfig, FormikValues, useFormikContext} from 'formik'
import {CheckboxWithLabel, TextField} from 'formik-mui'
import React, { useState } from 'react'
import { Button, Box, Grid, CircularProgress, Stepper, Step, StepLabel } from '@mui/material'
import { mixed, number, object, string } from 'yup'

const sleep = async (time: number) => new Promise(acc => setTimeout(acc, time))



const Home: NextPage = () => {

  
  return (
    <>
      <FormikStepper initialValues={{
        firstName: '',
        lastName: '',
        millionaire: false,
        money: 0,
        description: ''
      } 
      } onSubmit = {async (values, helpers) => {
        await sleep(3000)
        console.log(values)
      }}>
        <FormikStep label='Personal information'
          validationSchema={object({
            firstName: string().required('You need to give us a First Name'),
            lastName: string().required('You need to enter a last name, Put in NA if you don\'t have one')
          })}
          >
          <Box paddingBottom={2} paddingTop={2}>
            <Field fullWidth name='firstName' label='firstName' component={TextField}/>
          </Box>
          <Box paddingBottom={2} paddingTop={2}>
            <Field fullWidth name='lastName' label='lastName' component={TextField}/>
          </Box>
        </FormikStep>
        <FormikStep label='HNI status'>
          <Box paddingBottom={2} paddingTop={2}>
            {/* <p>Well, {values.firstName} {values.lastName}, it's time for the moment of truth</p> */}
            <NameMessage message="Well firstName lastName, it's time for the moment of truth."/>
          </Box>
          <Box paddingBottom={2} paddingTop={2}>
            <Field name='millionaire' type='checkbox' Label={{label:'Are you a millionaire'}} component={CheckboxWithLabel}/>
          </Box>
        </FormikStep>
        <FormikStep label="Bank Information"
          validationSchema={object({
            money: mixed().when('millionaire', {
              is: true,
              then: number().required('You need to let us know about them millions').min(1_000_000, 'You said you were a millionaire, how come you have less than a million?'),
              otherwise: number().required('You have to put down how much money you have, I don"t care if it is negative')
            })
          })}
        >
          <Box paddingBottom={2} paddingTop={2}>
            <NameMessage message="Alright, firstName lastName, time to show your cards"/>
          </Box>
          <Box paddingBottom={2} paddingTop={2}>
            <Field fullWidth name='money' type='number' label='How much money do you have' component={TextField}/>
          </Box>
        </FormikStep>
        <FormikStep label='Review Information'>
          <Box paddingBottom={2} paddingTop={2}>
            <Field fullWidth name='description' label='Describe your money situation' component={TextField}/>
          </Box>
        </FormikStep>
      </FormikStepper>
    </>
  )
}

export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'>{
  label: string
}

const FormikStep = ({children}: FormikStepProps) => {
  return(<>
    {children}
  </>)
}
export interface FormikStepperProps extends FormikConfig<FormikValues>{
  children: React.ReactNode
}


export function FormikStepper ({children, ...props}: FormikStepperProps) {

  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[] 
  const [step, setStep] = useState(0)
  const currentChild = childrenArray[step]
  const isLastStep = () => step === childrenArray.length -1
  const [completed, setCompleted] = useState(false)

  return(
  <Formik {...props} onSubmit={async (values, helpers) => {
    if(isLastStep()){ 
      await props.onSubmit(values, helpers)
      setCompleted(true)
    }else{
      (setStep(step+1))
    }}

  } validationSchema={currentChild.props.validationSchema}>
    {({isSubmitting}) => (

    <Form>
      <Stepper >
        {childrenArray.map((child, index) => {
          return(<Step key={child.props.label} completed={completed || step> index}>
            <StepLabel>{child.props.label}</StepLabel>
          </Step>)
        })}

      </Stepper>
      {currentChild}
      <Grid container spacing={2}>
        <Grid item>
          {step>0 && <Button variant='contained' disabled={isSubmitting} onClick={() => setStep(step-1)}>Back</Button>}
        </Grid>
        <Grid item>
          {<Button disabled={isSubmitting} startIcon={isSubmitting && <CircularProgress size='2rem'/>}variant='contained' type='submit'>{ isLastStep() ? 'Submit' : 'Next'}</Button>}
        </Grid>
      </Grid>
    </Form>
    
    )}
  </Formik>)
}

export const NameMessage = ({message}: {message: string}) => {
  
  const {values} = useFormikContext<{firstName: string, lastName: string, millionaire: boolean, money: number, description: string}>()

  const withFirstName = message.replaceAll('firstName', values.firstName)
  const withSecondName = withFirstName.replaceAll('lastName', values.lastName)

  return(
    <p>
      {withSecondName}
    </p>
  )
}

export default Home
