"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import CheckEmailAction from "./checkEmailAction";
import EmailLoginAction from "./emailLoginAction";
import SignUpAction from "./signupAction";

enum EmailState {
  NOT_CHECKED,
  EXIST,
  NOT_EXIST,
}

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [emailState, setEmailState] = useState<EmailState>(
    EmailState.NOT_CHECKED
  );

  const doCheckEmail = async () => {
    const exist = await CheckEmailAction(email);
    setEmailState(exist ? EmailState.EXIST : EmailState.NOT_EXIST);
  };

  const handleActionButton = () => {
    if (emailState === EmailState.NOT_CHECKED) {
      doCheckEmail();
    } else if (emailState === EmailState.EXIST) {
      EmailLoginAction(email, password);
    } else if (emailState === EmailState.NOT_EXIST) {
      SignUpAction({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
    }
  };

  return (
    <>
      <h1 className="font-medium text-lg mb-2">Logg inn eller registrer deg</h1>
      <p className="mb-11 text-sm font-normal text-neutral-500">På et sting!</p>
      <p className="text-neutral-800 text-sm font-semibold mb-3">
        E-postadresse
      </p>
      <Input
        className="mb-3"
        onChange={(e) => setEmail(e.currentTarget.value)}
      />

      {emailState === EmailState.EXIST && (
        <>
          <p className="text-neutral-800 text-sm font-semibold my-3">Passord</p>
          <Input
            type="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <span className="text-sm text-[#006EFF] font-semibold mb-10 mt-2">
            Glemt passord?
          </span>
        </>
      )}

      {emailState === EmailState.NOT_CHECKED && (
        <p className="text-neutral-800 text-sm font-normal mb-10">
          Når du oppretter en konto, godtar du våre personvernregler og
          retningslinjer for informasjonskapsler.{" "}
        </p>
      )}

      {emailState === EmailState.NOT_EXIST && (
        <>
        <p className="text-neutral-800 text-sm font-semibold my-3">Passord</p>
          <Input
            type="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <p className="text-neutral-800 text-sm font-semibold mb-3">Fornavn</p>
          <Input
            className="mb-3"
            onChange={(e) => setFirstName(e.currentTarget.value)}
          />
          <p className="text-neutral-800 text-sm font-semibold mb-3">
            Etternavn
          </p>
          <Input
            className="mb-3"
            onChange={(e) => setLastName(e.currentTarget.value)}
          />
        </>
      )}
      <Button onClick={handleActionButton}>Logg inn</Button>
    </>
  );
};

export default LoginPage;
