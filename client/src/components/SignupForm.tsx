import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import './auth-forms.scss';

interface SignupFormData {
  username: string;
  email: string;
  password: string;
}

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState<SignupFormData>({
    username: '',
    email: '',
    password: '',
  });

  const [validated] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const [addUser, { error }] = useMutation(ADD_USER);
  const showAlert = !!error && !alertDismissed;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setUserFormData({
      ...userFormData,
      [name]: value,
    });
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
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      if (data?.addUser?.token) {
        Auth.login(data.addUser.token);
      }
    } catch (err) {
      console.error(err);
    }

    setUserFormData({
      username: '',
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
          Something went wrong
        </Alert>

        <Form.Group className="form-group">
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Your username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username required
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
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
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password
            )
          }
          type="submit"
          variant="primary"
        >
          Sign Up
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
