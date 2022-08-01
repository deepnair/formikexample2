# Formik Example 2

## About

This is a basic Formik Example site that has a multi-step form with validation using yup. The second and third step reflect the First Name and Last Name field values using the useFormikContext hook.

This is based on the Formik tutorial by Bruno Antunes at [React Multi-Step Form Tutorial: Using Formik, Yup and material-ui](https://www.youtube.com/watch?v=l3NEC4McW3g&t).

## Steps

### File creation and basic form

Objective: 

Create a simple Formik form with all the fields. All the fields will appear on a single step for now.

Steps:

1. Create the next-app with 

    ```
    yarn create next-app formikexample2 --typescript 
    ```
    or alternatively
    ```
    yarn create next-app formikexample2 --ts
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

### Formik Stepper

Objective: Turn the single step form into a multistep form.

1. In order to have different steps of the form on different pages, create a FormikStepper function. We will use this FormikStepper function as a wrapper for Formik. This will have props of type FormikConfig\<FormikValues> as that is the same props type of Formik. The props can be desctructured as having a children and spreading the props (which will be required by Formik). It will look as follows:

    ```jsx
    export const FormikStepper = ({children, ...props}: FormikConfig<FormikValues>) => {

    }
    ```
1. This FormikStepper wrapper will have the Formik and Form component within it. The props will be spread within Formik and the children will be put under the Form. It will now look as follows:
    ```jsx
    export const FomikStepper = ({children, ...props}: FormikConfig<FormikValues>) => {
        return (
        <Formik {...props}>
            <Form>
                {children}
            </Form>
        </Formik>
        )
    }
    ```
1. Once this is done, in the original Home function, turn the Formik component into FormikStepper. You can also get rid of the Fomik and Form components since they are already present in the wrapper. The original function will now look like follows (Only one field is showed here but really, all the fields should be shown):
    ```jsx
    const Home: NextPage = () => {
        return (
            <FormikStepper validationSchema={object({
                money: mixed().when('millionaire', {
                    is: true,
                    then: number().required().min(1_000_000, 'Since you said you\'re a millionaire, you must have atleast a million')
                })
            })} onSumbit={() => {}}>
                <Field fullwidth name='firstname' label='First Name' type='text'component={TextField}>

            </FormikStepper>
        )
    }
    ```
1. Now to the FormikStepper function you need to add the childrenArray to take the children of the FormikStepper and turn them into an array you can manipulate. It will be done as follows under the FormikStepper wrapper:
    ```jsx
    const childrenArray = React.Children.toArray(children) as React.ReactElement[]
    ```
1. At this point you'll likely get the following TypeScript error with a red line under children:
    ```
    Argument of type 'ReactNode | ((props: FormikProps<FormikValues>) => ReactNode)' is not assignable to parameter of type 'ReactNode | ReactNode[]
    ```
    In order to solve this you need to assert that 'children' is a ReactNode. In order to solve this you need to  create a separate interface and changing the props type of FormikStepper.
1. Create a new TypeScript interface that asserts that children is of type React.ReactNode and the rest is the same as Formik which is FormikConfig\<FormikValues>. It will look as follows:
    ```ts
    export interface FormikStepperProps extends FormikConfig<FormikValues>{
        children: React.ReactNode
    }
    ```
    Then change the type of FormikStepper's props to FormikStepperProps as follows:
    ```jsx
    export const FormikStepper = ({children, ...props}: FormikStepperProps) => {

    }
1. Then a state needs to be created for each step. This will be done using the useState hook from react as follows:
    ```jsx
    const [step, setStep] = useState(0)
    ```
1. We only want to show the child of the FormikStepper (FormikStep) that corresponds to the step. So we create a current child as follows:
    ```jsx
    const currentChild = childrenArray[step]
    ```
1. Now we can change the content of the Form component in the FormikStepper to 'currentChild' rather than 'children', so that only the part of the form that is relevant to that step is displayed.
1. We can wrap each step with a \<FormikStep>\</FormikStep> component. So that when the FormikStepper looks for the {currentChild}, the relevant FormikStep can be showed. 
1. We want to have each FormikStep have it's own validationSchema and children. And we also want each FormikStep to have a label that could be displayed on top on a stepper as we go through each step. So we will define the FormikStepProps type which will be the typescript type of the props in the FormikStep wrapper as follows:
    ```typescript
    export interface FormikStepProps extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'>{
        label: string
    }
1. Now that we have the FormikStepProps type, we can write out the FormikStep wrapper as follows:
    ```jsx
    export const FormikStep = ({children}: FormikStepProps) => {
        return(
            <>
            {children}
            </>
        )
    }
    ```
    Once we do this, we'll have to go to every FormikStep and add a property called label and put down the label of the FormikStep like:
    ```jsx
    <FormikStep label='Personal details'></FormikStep>
    ```
1. Now we can add 'back' and 'next' buttons below the steps so that we can move back and forth amongst the steps. We'll place this code in the FormikStepper wrapper under the place where the {currentChild} will be displayed. First we'll add the back button and it will only appear if the step is greater than one. We will import this Button from @mui/material. We will use the variant='contained' property on the button so that the button is more easily discernable on a white background. The code will look as follows:
    ```jsx
    {step > 0 && <Button variant='contained' onSubmit={() => {setStep(step-1)}}>{Back}</Button>}
    ```
1. With the next button we will set it so that it calls the submit function if it is the last step, or move forward to the next step if the step is not the last one. Since we will likely check if the current step is the last step frequently, let's create a function for it in the FormikStepper wrapper. It will look as follows:
    ```ts
        const isLastStep = () => {
            return step == childrenArray.length -1
        }
    ```
1. Once we have the isLastStep function, simply turning the type of the button to 'submit' and putting the functionality in the 'onSubmit' property of the \<Formik> component in the FormikStepper wrapper completes the button. The button code will look as follows:
    ```jsx
    {<Button variant='contained' type='submit'>{isLastStep() ? 'Submit' : 'Next'}</Button>}
    ```
1. Now we define the onSubmit function in the Formik component in the FormikStepper. We want this to call the onSubmit function of the parent (FormikStepper) if it is the last step, else we want it to show the next step. The code will look as follows:
    ```jsx
    <Formik onSubmit={async(values, helpers) => {
        if isLastStep(){
            await props.onSubmit(values, helpers);
        }else{
            setStep(step+1)
        }
    }}>
    ```
## Material UI Stepper, CircularProgress when submitting and disabled buttons

Objective: Show the steps with their names on the top in a material UI stepper. When each step is complete and we go to the next step, there is a check next to the step to indicate the step is completed. When the form is submitting, the buttons should be disabled and we should see a CircularProgress spinning in the 'Next' button.

1. Import Stepper, Step, StepLabel from @material/mui.
1. Create the stepper at the top of the return of the FormikStepper wrapper as it will be displayed above the currentChild. We will use the alternateLabel property which frankly makes the Stepper look prettier. We will also add the activeStep={step} property, so the step that we are currently on will also be more prominent in the stepper. The code will look as follows:
    ```jsx
    <Stepper alternativeLabel activeStep={step}>
    </Stepper>
    ```
1. Within the stepper we will map out each child from the childrenArray to get the labels of each step. The code will now look as follows.
    ```jsx
    <Stepper alternativeLabel activeStep={step}>
        {childrenArray.map((child) => {
            <Step key={child.props.label}>
                <StepLabel>{child.props.label}</StepLabel>
            </Step>
        })}
    </Stepper>
    ```
1. This stepper is good but will not show the step as checked when it is completed. So to show the last step as checked when the form is submitted, we need to create a 'completed' state under the FormikStepper component. It will look as follows:
    ```ts
    const [completed, setCompleted] = useState(false)
    ```
1. Now in the onSubmit function of Formik under the FormikStepper, we can set this state to true when we click the Submit button on the last step. The new code of the Formik component under the FormikStepper will look as follows:
    ```jsx
    <Formik onSubmit={async(values, helpers) => {
        if(isLastStep()){
            await props.onSubmit(values, helpers)
            setCompleted(true)
        }else{
            setStep(step+1)
        }
    }}> 
    
    </Formik>
    ```
    Now the last step will be checked when the form is submitted.
1. In order to show the other steps prior to the last step as completed when you are on the next step and the last step as completed when the form is done, we add the following to the Step component from @mui/material:
    ```jsx
    <Stepper alternativeLabel activeStep={step}>
        {childrenArray.map((child, index) => {
            return (
                <Step key={child.props.label} completed={completed || step>index}>
                    <StepLabel>{child.props.label}</StepLabel>
                </Step>
            )
        })}
    </Stepper>
    ```
1. Now in order to disable the buttons and show a CircularProgress icon in the button when submitting the form, we need a state for when the form is submitting. This can be done by writing a function within the \<Formik>\</Formik> component tags and destructuring isSubmitting out from the props and leaving the rest of the code within the function. It will look as follows:

    ```jsx
    <Formik {...props} validationSchema={currentChild.props.validationSchema} onSubmit={async (values, helpers) => {
        if(isLastStep()){
            await props.onSubmit(values,helpers)
            setCompleted(true)
        }else{
            setStep(step+1)
        }
    }}>
        {({isSubmitting}) => (
            <Form>
            ...
            </Form>
        )}
    </Formik>
    ```
1. Now that we have access to the isSubmitting, we can disable the buttons as follows:
    ```jsx
        <Button disabled={isSubmitting}></Button>
    ```
1. We can further add the CircularProgress when submitting with adding it as a component from @mui/material to the startIcon within the button, we can further specify the size of the CircularProgress as follows:
    ```jsx
        <Button startIcon={isSubmitting && <CircularProgress size='2 rem'>}>
    ```
1. Once this is done, we are pretty much done, but we can't see the result because the form will submit instantly. To mimic the submission of a form we'll call a sleep function in the parent FormikStepper on submit. To do that we first write the sleep function as follows:
    ```ts
    const sleep = async (time: number) => new Promise((acc) => setTimeout(acc, time)) 
    ```
1. Then in the FormikStepper component onSubmit function we put the following:
    ```jsx
        <FormikStepper initialValues={{
            firstName: '',
            lastName: '',
            millionaire: false,
            money: 0,
            description: ''
        }}onSubmit={async (values, helpers) => {
            await sleep(3000)
            console.log(values)
        }}>
    ```

## Call the values filled in an earlier step in a later step

1. Within Formik, to access the values there is a built-in hook in Formik known as useFormikContext, it must be called in a component that is below the Formik component. To do this we import useFormikContext from formik.
    ```ts
        import {Formil, Form, Field, FormikConfig, FormikValues, useFormikContext} from 'formik'
    ```
1. Then we created a NameMessage component that uses the FormikContext as follows:
    ```jsx
    const NameMessage = (message: string) => {
        const {values} = useFormikContext<{firstName: string, lastName: string, millionaire: boolean, money: number, description: string}>

        const withFirstName = message.replaceAll('firstName', values.firstName)
        const withSecondName = withFirstName.replaceAll('lastName', values.lastName)

        return (
            <p>
                {withSecondName}
            </p>
        )
    }
    ```
    By calling values.[insert field name here], we can access the contents of any Field component from Formik.
1. We can now use the NameMessage component anywhere under the Formik component. In this case we use it under the FormikSteps.

## Make the Form look more aesthetically pleasing with Material UI

1. In order to make things look better we can use Boxes and Grids from Material UI. With Boxes, we can create a new DOM element wrapping something to give it styling. To give our Field components under FormikStep some padding, we can do the following:
    ```jsx
    <Box paddingBottom={2} paddingTop{2}>
        <Field>
    </Box>
    ```
1. We can use the Grid to separate out the buttons and put a gap between them to have them be more aesthetically pleasing as follows:
    ```jsx
    <Grid container spacing={2}>
        <Grid item>
            {step>0 && <Button>Back</Button>}
        </Grid>
        <Grid item>
            <Button>{step<childrenArray.length-1 ? 'Next' : 'Submit'}</Button>
        </Grid>
    </Grid>
    ```

