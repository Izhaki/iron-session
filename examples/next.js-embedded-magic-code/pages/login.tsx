import React, { useState } from "react";
import useSession, { FetchError } from "lib/useSession";
import { useRouter } from "next/router";
import Form from "components/LoginForm";

import styles from "./login.module.css";

export default function Login() {
  const { login } = useSession();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState("");

  return (
    <>
      <div className={styles.login}>
        <Form
          errorMessage={errorMsg}
          onSubmit={async function handleSubmit(event) {
            event.preventDefault();

            const username = event.currentTarget.username.value;

            try {
              await login(username);
              router.push("/profile-sg");
            } catch (error) {
              if (error instanceof FetchError) {
                setErrorMsg(error.data.message);
              } else {
                console.error("An unexpected error happened:", error);
              }
            }
          }}
        />
      </div>
    </>
  );
}
