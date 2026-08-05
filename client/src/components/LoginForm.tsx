import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import './auth-forms.scss';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [validated] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [login, { error }] = useMutation(LOGIN_USER);
  const showAlert = !!error && !alertDismissed;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setAlertDismissed(false);

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      if (data?.login?.token) {
        Auth.login(data.login.token);
      }
    } catch (err) {
      console.error(err);
    }

    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form
        noValidate
        validated={validated}
        onSubmit={handleFormSubmit}
        className="auth-form"
      >
        <Alert
          dismissible
          onClose={() => setAlertDismissed(true)}
          show={showAlert}
          variant="danger"
        >
          Invalid login info
        </Alert>
        <Form.Group className="form-group">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your email"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email required
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Your password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password required
          </Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type="submit"
          variant="primary"
        >
          Log In
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
