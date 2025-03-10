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
        requiredMessage: 'auth.login.form.username.required',
        type: 'email'
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
    secondaryText: 'auth.login.form.register'
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
        requiredMessage: 'auth.login.form.username.required',
        type: 'email'
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
        requiredMessage: 'auth.login.form.username.required',
        type: 'email'
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
        label: 'auth.login.form.firstname.label',
        required: true,
        requiredMessage: 'auth.login.form.firstname.required'
      },
      {
        key: 'lastname',
        label: 'auth.login.form.lastname.label',
        required: true,
        requiredMessage: 'auth.login.form.lastname.required'
      },
      {
        key: 'email',
        label: 'auth.login.form.email.label',
        required: true,
        requiredMessage: 'auth.login.form.email.required',
        type: 'email'
      },
      {
        key: 'password',
        label: 'auth.login.form.password.label',
        required: true,
        requiredMessage: 'auth.login.form.password.required',
        type: 'password'
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
  resetPasswordForm: {
    inputs: [
      {
        key: 'login_id',
        label: 'auth.login.form.username.label',
        required: true,
        requiredMessage: 'auth.login.form.username.required',
        type: 'email'
      },
      {
        key: 'password',
        label: 'auth.login.form.password.label',
        required: true,
        requiredMessage: 'auth.login.form.password.required'
      },
      {
        key: 'change_password_id',
        label: 'auth.login.form.changePasswordId.label',
        required: true,
        requiredMessage: 'auth.login.form.changePasswordId.required'
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
  }
};
