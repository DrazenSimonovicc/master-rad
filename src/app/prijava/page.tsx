"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/Components/Button";
import TextInput from "@/Components/Inputs/TextInput/TextInput";
import { Description } from "@/Components/Texts/Description";
import { Title } from "@/Components/Texts/Title";
import { pb } from "@/libs/pocketbase";
import styles from "./page.module.scss";

const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email i lozinka su obavezni.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await pb.collection("users").authWithPassword(email, password);

      if (pb.authStore.isValid) {
        router.push("/");
      } else {
        setError("Nevažeći email ili lozinka");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Nevažeći email ili lozinka");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !passwordConfirm) {
      setError("Sva polja su obavezna.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Lozinke nisu iste.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm,
      });

      await pb.collection("users").authWithPassword(email, password);

      router.push("/podaci-o-korisniku");
    } catch (err) {
      console.error("SignUp error:", err);
      setError("Trenutno ne možete kreirati nalog. Pokušajte ponovo kasnije.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.leftSide}>
        <picture>
          <img
            src="/loginPage/login.jpg"
            alt={isSignUp ? "registracija-slika" : "prijava-slika"}
          />
        </picture>
      </div>

      <div className={styles.rightSide}>
        <div className={styles.description}>
          <Description text="Dražen Simonović" />
          <Description text="Master rad" />
          <Title
            level={2}
            text="Razvoj obrazovnog veb portala za učitelje i nastavnike"
            className={styles.title}
          />
          <Title text={isSignUp ? "Registracija" : "Prijava"} level={3} />
        </div>

        <form
          className={styles.inputs}
          onSubmit={async (e) => {
            e.preventDefault();
            if (isSignUp) {
              await handleSignUp();
            } else {
              await handleLogin();
            }
          }}
        >
          <TextInput
            type="text"
            value={email}
            onChange={setEmail}
            placeholder="Unesite svoj email"
            error={error && email === "" ? "Email je obavezan" : ""}
          />
          <TextInput
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Unesite svoju lozinku"
            error={error && password === "" ? "Lozinka je obavezna" : ""}
          />
          {isSignUp && (
            <TextInput
              type="password"
              value={passwordConfirm}
              onChange={setPasswordConfirm}
              placeholder="Potvrdi svoju lozinku"
              error={
                error && passwordConfirm === ""
                  ? "Morate potvrditi svoju lozinku"
                  : ""
              }
            />
          )}
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonWrap}>
            <Button
              type="submit"
              className={styles.loginButton}
              themes={["standardHeight", "standardWide", "blue"]}
              title={
                loading
                  ? isSignUp
                    ? "Registracija..."
                    : "Prijava..."
                  : isSignUp
                    ? "Registruj se"
                    : "Prijavi se"
              }
            />
          </div>
        </form>

        <p className={styles.toggleText}>
          {isSignUp ? "Već imate nalog?" : "Nemate nalog?"}{" "}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ cursor: "pointer", color: "blue" }}
          >
            {isSignUp ? "Prijavite se" : "Registrujte se"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
