"use client";

import { useState } from "react";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

interface SecretInputProps {
  styles?: string;
  setSecret: (value: string) => void;
  label?: string;
}

export default function SecretInput({
  styles = "",
  setSecret,
  label = "Password",
}: SecretInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={styles}>
      <p className="block text-base mb-2">{label}</p>
      <span className="flex relative">
        <input
          onChange={(event) => setSecret(event.target.value)}
          className="border w-full text-base px-2 py-1 focus:outline-none focus:ring-0 focus:bg-gray-200 rounded-md font-normal"
          placeholder="Enter password"
          type={showPassword ? "text" : "password"}
          required
        />
        <button
          type="button"
          className="absolute right-2 top-2 hover:bg-slate-200 text-blue-500 rounded-full p-1"
        >
          <VscEye
            onClick={() => setShowPassword(false)}
            className={`${showPassword ? "block" : "hidden"}`}
          />
          <VscEyeClosed
            onClick={() => setShowPassword(true)}
            className={`${showPassword ? "hidden" : "block"}`}
          />
        </button>
      </span>
    </div>
  );
}
