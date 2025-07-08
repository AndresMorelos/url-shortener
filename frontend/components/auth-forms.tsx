"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Link2, User2, User, Lock } from "lucide-react"
import { useApiStore } from '../hooks/use-api-store'
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

type Inputs = {
  name: string | undefined,
  username: string,
  password: string,
}

const schema = yup
  .object({
    name: yup.string().optional(),
    username: yup.string().required('Please provide an username'),
    password: yup.string().matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[,.@$!%*?&])[A-Za-z\d,.@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and at least 8 characters.'
    ).required('Please provide a password'),
  }).required();

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  })

  const login = useApiStore((state) => state.login)
  const signup = useApiStore((state) => state.signUp)
  const loading = useApiStore((state) => state.loading)
  const error = useApiStore((state) => state.error)



  const onSubmit: SubmitHandler<Inputs> = async (data, e) => {
    e?.preventDefault();
    if (isLogin) {
      await login(data.username, data.password)
    } else {
      await signup({ name: data.name, username: data.username, password: data.password })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Link2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">URL Shortener</h1>
          <p className="text-gray-600 mt-2">Admin Panel Access</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">
              {isLogin ? "Welcome back" : "Create account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Enter your credentials to access the admin panel" : "Sign up to start managing your URLs"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      {...register('name', { required: false})}
                      className="pl-10 h-11"
                    />
                  </div>
                  {errors && errors.name && (
                    <Alert variant="destructive">
                      <AlertDescription>{errors.name.message}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative">
                  <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...register('username', { required: true })}
                    className="pl-10 h-11"
                  />
                </div>
                {errors && errors.username && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.username.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register('password', { required: true })}
                    className="pl-10 pr-10 h-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors && errors.password && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.password.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                disabled={loading}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin)
                    reset()
                  }}
                  className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
