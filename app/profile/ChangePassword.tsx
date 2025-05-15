"use client";

import PasswordField from "@/components/PasswordField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/actions/user.actions";
import { useState } from "react";

interface Props {
  userId: string;
}

const ChangePassword = ({ userId }: Props) => {
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPasswordField, setShowPasswordField] = useState(false);

  return (
    <div>
      {!showPasswordField && <Button onClick={() => {
        setShowPasswordField(!showPasswordField);
      }}>Change Password</Button>}
      {showPasswordField && (
        <div>
            <PasswordField
                value={password}
                onChange={(value) => setPassword(value)}
            />
            <Button
                onClick={async () => {
                    setIsSubmitting(true);
                    try {
                        await changePassword(userId, password);
                        alert("Password changed successfully");
                        setPassword("");
                        setShowPasswordField(false);
                    } catch (error) {
                        console.error(error);
                    }
                    setIsSubmitting(false);
                }}
                disabled={isSubmitting}
            >
                {isSubmitting ? "Changing..." : "Change Password"}
            </Button>
        </div>)}
    </div>
  );
};

export default ChangePassword;