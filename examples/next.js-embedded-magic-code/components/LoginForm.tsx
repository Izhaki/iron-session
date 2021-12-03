import { FormEvent } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default function LoginForm({
  errorMessage,
  onSubmit,
}: {
  errorMessage: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formLogin">
          <Form.Control
            type="text"
            name="username"
            required
            placeholder="Github username"
          />
        </Form.Group>

        {errorMessage && <Alert variant="warning">{errorMessage}</Alert>}

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">
            Login
          </Button>
        </div>
      </Form>
    </>
  );
}
