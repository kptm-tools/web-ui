export default {
  api: {
    error: {
      messages: {
        '400':
          'Bad Request: The server could not understand the request due to invalid syntax.',
        '401':
          'Unauthorized: Authentication is required and has failed or has not been provided.',
        '403':
          'Forbidden: You do not have permission to access the requested resource.',
        '404':
          'Not Found: The requested resource could not be found on the server.',
        '405':
          'Method Not Allowed: The requested HTTP method is not allowed for the resource.',
        '409':
          'Conflict: The request could not be processed due to a conflict with the current state of the resource.',
        '429':
          'Too Many Requests: You have made too many requests in a given time frame.',
        '500':
          'Internal Server Error: The server encountered an unexpected condition.',
        '502':
          'Bad Gateway: The server was acting as a gateway and received an invalid response.',
        '503':
          'Service Unavailable: The server is currently unable to handle the request.',
        '504':
          'Gateway Timeout: The server was acting as a gateway and did not receive a timely response.',
        default: 'An unexpected error occurred. Please try again later.'
      }
    }
  },
  auth: {
    login: {
      form: {
        username: {
          label: 'Your username',
          required: 'Username is required'
        },
        firstname: {
          label: 'Your firstname',
          required: 'Firstname is required'
        },
        lastname: {
          label: 'Your lastname',
          required: 'Lastname is required'
        },
        email: {
          label: 'Your email',
          required: 'Email is required'
        },
        password: {
          label: 'Your password',
          required: 'Password is required'
        },
        applicationId: {
          label: 'Your App Id',
          required: 'App Id is required'
        },
        changePasswordId: {
          label: 'Your Change Password ID',
          required: 'Change Password ID is required'
        },
        loginTitle: 'Log In',
        register: 'Register',
        recoverPasswordTitle: 'Recover Password',
        changePasswordTitle: 'Change Password',
        submit: 'Submit',
        forgotPassword: 'Forgot your password?',
        cancel: 'Cancel'
      }
    }
  }
};
