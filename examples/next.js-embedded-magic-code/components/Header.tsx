import * as React from "react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/router";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import useSession from "lib/useSession";

import styles from "./Header.module.css";

export default function NavBar() {
  const { session, logout, isLoading } = useSession();

  const user = session?.user;

  const router = useRouter();

  const isLoggedIn = user?.isLoggedIn === true;

  async function handleLogout(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    await logout();
    router.push("/login");
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="black"
      variant="dark"
      className={styles.navbar}
    >
      <Container className={styles.container}>
        <Navbar.Brand
          href="https://github.com/vvo/iron-session"
          className={styles["align-center"]}
        >
          <span className={styles.github}>
            <Image
              src="/GitHub-Mark-Light-32px.png"
              width="24"
              height="24"
              alt="GitHub"
            />
          </span>
          Iron-Session
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" activeKey={router.pathname}>
            <Link href="/" passHref>
              <Nav.Link>Home</Nav.Link>
            </Link>
            <span>
              <Link href="/profile-sg" passHref>
                <Nav.Link>Profile (SG)</Nav.Link>
              </Link>
            </span>
            <span>
              <Link href="/profile-ssr" passHref>
                <Nav.Link>Profile (SSR)</Nav.Link>
              </Link>
            </span>
          </Nav>

          <Nav className={clsx(styles.user, isLoading && styles.loading)}>
            {isLoggedIn ? (
              <>
                <span className={clsx(styles["align-center"], styles.info)}>
                  <Image
                    src={user.avatarUrl}
                    width="30"
                    height="30"
                    alt="GitHub"
                  />
                  {user.login}
                </span>

                <Link href="/logout" passHref>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                    className={styles.btn}
                  >
                    Logout
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/login" passHref>
                <Button variant="primary" size="sm" className={styles.btn}>
                  Login
                </Button>
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
