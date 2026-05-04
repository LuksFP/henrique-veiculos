"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function PasswordField() {
  const [show, setShow] = useState(false);
  return (
    <div className="login-field">
      <span className="login-field-icon" aria-hidden="true">
        <Lock size={16} />
      </span>
      <input
        name="password"
        type={show ? "text" : "password"}
        id="login-password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        className="login-input login-input--pw"
      />
      <button
        type="button"
        className="login-field-eye"
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
        onClick={() => setShow((v) => !v)}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}
