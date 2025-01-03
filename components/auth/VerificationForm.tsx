"use client";
import { useCallback, useEffect, useState } from "react";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { verifyToken } from "@/actions/auth/validation";
import { FormError } from "@/components/FormError";
import { FormSuccess } from "@/components/FormSuccess";

const VerificationForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const handleSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token");
      return;
    }
    verifyToken(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("something went wrong");
      });
  }, [token, success, error]);

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return (
    <CardWrapper
      headerLabel="Verification Form"
      backButtonHref="/login"
      backButtonLabel="Back to Login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};

export default VerificationForm;
