import { InputFormContainer } from 'src/models/form.models';

export const inputForms: InputFormContainer = {
  loginForm: {
    inputs: [
      {
        key: 'application_id',
        label: 'auth.login.form.applicationId.label',
        required: true,
        requiredMessage: 'auth.login.form.applicationId.required'
      },
      {
        key: 'loginId',
        label: 'auth.login.form.username.label',
        required: true,
        requiredMessage: 'auth.login.form.username.required'
      },
      {
        key: 'password',
        label: 'auth.login.form.password.label',
        required: true,
        requiredMessage: 'auth.login.form.password.required',
        type: 'password'
      }
    ],
    submitText: 'auth.login.form.loginTitle',
    secondaryText: 'Register'
  },
  changePasswordForm: {
    inputs: [
      {
        key: 'application_id',
        label: 'auth.login.form.applicationId.label',
        required: true,
        requiredMessage: 'auth.login.form.applicationId.required'
      },
      {
        key: 'loginId',
        label: 'auth.login.form.username.label',
        required: true,
        requiredMessage: 'auth.login.form.username.required'
      },
      {
        key: 'password',
        label: 'auth.login.form.password.label',
        required: true,
        requiredMessage: 'auth.login.form.password.required',
        type: 'password'
      },
      {
        key: 'changePasswordId',
        label: 'auth.login.form.changePasswordId.label',
        required: true,
        requiredMessage: 'auth.login.form.changePasswordId.required'
      }
    ],
    title: 'auth.login.form.changePasswordTitle',
    submitText: 'auth.login.form.submit'
  },
  forgotPasswordForm: {
    inputs: [
      {
        key: 'login_id',
        label: 'auth.login.form.username.label',
        required: true,
        requiredMessage: 'auth.login.form.username.required'
      },
      {
        key: 'application_id',
        label: 'auth.login.form.applicationId.label',
        required: true,
        requiredMessage: 'auth.login.form.applicationId.required'
      }
    ],
    submitText: 'auth.login.form.submit',
    secondaryText: 'auth.login.form.cancel'
  },
  registerForm: {
    inputs: [
      {
        key: 'firstname',
        label: 'First Name',
        required: true,
        requiredMessage: 'auth.login.form.firstname.required'
      },
      {
        key: 'lastname',
        label: 'Last Name',
        required: true,
        requiredMessage: 'auth.login.form.lastname.required'
      },
      {
        key: 'email',
        label: 'Email',
        required: true,
        requiredMessage: 'auth.login.form.email.required',
        type: 'email'
      },
      {
        key: 'password',
        label: 'Password',
        required: true,
        requiredMessage: 'Password is required',
        type: 'password'
      },
      {
        key: 'application_id',
        label: 'auth.login.form.applicationId.label',
        required: true,
        requiredMessage: 'auth.login.form.applicationId.required'
      }
    ],
    submitText: 'Submit',
    secondaryText: 'cancelar'
  }
};
