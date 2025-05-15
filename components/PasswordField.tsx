"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const PasswordField = ({ value, onChange }: Props) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="flex">
        <Input className="w-[400px]" type={showPassword ? "text" : "password"} id="password" name="password" value={value} onChange={(e) => onChange(e.target.value)} />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
        </button>
        </div>
    );
};

export default PasswordField;