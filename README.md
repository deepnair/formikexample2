# Formik Example 2

## About

This is a basic Formik Example site that has a multi-step form with validation using yup. The second and third step reflect the First Name and Last Name field values using the useFormikContext hook.

This is based on the Formik tutorial by Bruno Antunes at [React Multi-Step Form Tutorial: Using Formik, Yup and material-ui](https://www.youtube.com/watch?v=l3NEC4McW3g&t).

## Steps

### File creation and basic form

1. Create the next-app with 

    ```
    yarn create next-app formikexample2 --typescript 
    ```
1. Install the dependencies with 
    ```
    yarn add formik formik-mui @mui/material yup @emotion/styled @emotion/react
    ```
1. Create the basic Formik form by importing Formik, Form, and Field from 'formik'.
1. In the Formik component, add initialvalues, onSubmit which are required properties for the component.
1. Then add the validationSchema using yup which will look as follows:
    ```ts
    validationSchema={object({
            money: mixed().when('millionaire', {
              is: true,
              then: number().required('You need to let us know about them millions').min(1_000_000, 'You said you were a millionaire, how come you have less than a million?'),
              otherwise: number().required('You have to put down how much money you have, I don"t care if it is negative')
            })
          })}
    ```
    What this does is you import 'object' from yup which states that the 'money' field will require the value to be greater than a million if the 'millionaire' field is true. (The 1_000_000 notation for numbers is valid and helps large numbers be easily discernable in code.)
1. Each Field will have a name, label, type, and component property. The component property takes either a TextField or CheckboxWithLabel (both from formik-mui). It will look as follows:
    ```jsx
    <Field fullWidth name='lastName' label='lastName' component={TextField}/>
    <Field name='millionaire' type='checkbox' Label={{label:'Are you a millionaire'}} component={CheckboxWithLabel}/>
    ```
    Note that the Label in checkbox label is different, it is just that the way the CheckboxWithLabel component is labeled is this way in formik-mui from where CheckboxWithLabel is imported.