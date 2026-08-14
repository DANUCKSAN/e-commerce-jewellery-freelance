"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuthFormProps } from "@/lib/type";
import { createAuthSchema, type AuthFormValues } from "@/lib/validations/auth";

import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";

const inputClassName = "h-12 px-3.5";

export function AuthForm({ errorMessage, mode, onSubmit }: AuthFormProps) {
  const isSignUp = mode === "sign-up";
  const schema = createAuthSchema(mode);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleFormSubmit = async (values: AuthFormValues) => {
    await onSubmit(values);
  };

  return (
    <Card className="w-full border-0 bg-white/72 py-0 shadow-[0_24px_75px_rgba(63,38,28,0.08)] ring-1 ring-[#171411]/10 backdrop-blur-sm sm:max-w-md">
      <CardHeader className="px-5 pb-2 pt-6 sm:px-7 sm:pt-7">
        <p className="text-footnote font-semibold uppercase tracking-[0.18em] text-[#5B2333]">
          {isSignUp ? "Your private collection" : "Welcome back"}
        </p>
        <h1 className="mt-2 font-serif text-[2.25rem] leading-none tracking-[-0.04em] text-[#171411]">
          {isSignUp ? "Create your account" : "Sign in"}
        </h1>
        <CardDescription>
          {isSignUp
            ? "Save considered pieces and return to them whenever you wish."
            : "Continue to your saved pieces and personal collection."}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-6 sm:px-7 sm:pb-7">
        <form noValidate onSubmit={form.handleSubmit(handleFormSubmit)}>
          {errorMessage ? (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-lg border border-red-700/20 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-800"
            >
              <AlertCircle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <FieldGroup>
            {isSignUp && (
              <>
                <Controller
                  name="firstName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="auth-first-name">
                        First name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="auth-first-name"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.invalid ? "first-name-error" : undefined
                        }
                        autoCapitalize="words"
                        autoComplete="given-name"
                        className={inputClassName}
                        placeholder="Your first name"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          id="first-name-error"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="lastName"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="auth-last-name">
                        Last name
                      </FieldLabel>
                      <Input
                        {...field}
                        id="auth-last-name"
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.invalid ? "last-name-error" : undefined
                        }
                        autoCapitalize="words"
                        autoComplete="family-name"
                        className={inputClassName}
                        placeholder="Your last name"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          id="last-name-error"
                          errors={[fieldState.error]}
                        />
                      )}
                    </Field>
                  )}
                />
              </>
            )}

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="auth-email">Email address</FieldLabel>
                  <Input
                    {...field}
                    id="auth-email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? "email-error" : undefined
                    }
                    autoCapitalize="none"
                    autoComplete="email"
                    className={inputClassName}
                    inputMode="email"
                    placeholder="you@example.com"
                    spellCheck={false}
                  />
                  {fieldState.invalid && (
                    <FieldError id="email-error" errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="auth-password">Password</FieldLabel>
                  <Input
                    {...field}
                    id="auth-password"
                    type="password"
                    aria-invalid={fieldState.invalid}
                    aria-describedby={
                      fieldState.invalid ? "password-error" : undefined
                    }
                    autoComplete={
                      isSignUp ? "new-password" : "current-password"
                    }
                    className={inputClassName}
                    placeholder={
                      isSignUp ? "At least 8 characters" : "Your password"
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError
                      id="password-error"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            {isSignUp && (
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-confirm-password">
                      Confirm password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="auth-confirm-password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      aria-describedby={
                        fieldState.invalid
                          ? "confirm-password-error"
                          : undefined
                      }
                      autoComplete="new-password"
                      className={inputClassName}
                      placeholder="Repeat your password"
                    />

                    {fieldState.invalid && (
                      <FieldError
                        id="confirm-password-error"
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-5 min-h-12 w-full items-center justify-center bg-[#5B2333] text-white hover:bg-[#171411]"
          >
            {form.formState.isSubmitting ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : null}
            {form.formState.isSubmitting
              ? isSignUp
                ? "Creating your account…"
                : "Signing you in…"
              : isSignUp
                ? "Create account"
                : "Sign in"}
          </Button>

          <p className="mt-5 text-center text-sm text-[#171411]/60">
            {isSignUp ? "Already have an account?" : "New to Aurelle?"}{" "}
            <Link
              href={isSignUp ? "/sign-in" : "/sign-up"}
              className="font-semibold text-[#5B2333] underline decoration-[#5B2333]/35 underline-offset-4 transition-colors hover:text-[#171411] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B2333]"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
