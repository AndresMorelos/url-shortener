"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Copy, ExternalLink, Eye, Link2, Plus, Trash2, LogOut, BarChart3 } from "lucide-react"
import { useApiStore } from "@/hooks/use-api-store"
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import * as Toast from "@radix-ui/react-toast"
import { useToast } from "@/hooks/use-toast"

type CreateShortUrlInputs = {
  url: string
}

const schema = yup
  .object({
    url: yup.string().url('Please enter a valid URL (e.g., https://example.com)').required('Please provide an URL'),
  })
  .required()

export function AdminPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null)
  const user = useApiStore((state) => state.user);
  const urls = useApiStore((state) => state.urls)
  const fetchUrls = useApiStore((state) => state.fetchUrls)
  const createUrl = useApiStore((state) => state.createUrl)
  const deleteUrl = useApiStore((state) => state.deleteUrl)
  const logout = useApiStore((state) => state.logout)
  const {
    toast,
  } = useToast();

  useEffect(() => {
    fetchUrls()
  }, [])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateShortUrlInputs>({
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<CreateShortUrlInputs> = async (data, e) => {
    e?.preventDefault();
    setIsLoading(true)
    try {
      const shortUrl = await createUrl(data.url)
      if (shortUrl) {
        setShortenedUrl(shortUrl)
        toast({
          title: "URL shortened successfully!",
          description: "Your shortened URL is ready to use.",
          variant: "success",
        })
      }
    } catch (error) {
      setError("Failed to shorten URL. Please try again.")
      toast({
        title: "Failed to shorten URL",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard!",
        description: "The shortened URL has been copied.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually.",
        variant: "destructive",
      })
    }
  }

  const onDeleteUrl = (id: number) => {
    try {
      deleteUrl(id)
      toast({
        title: "URL deleted",
        description: "The shortened URL has been removed.",
        variant: "destructive",
      })
    } catch (error) {
      toast({
        title: "Failed to delete url",
        description: "",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalVisits = urls.reduce((sum, url) => sum + url.visitCount, 0)

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Link2 className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">URL Shortener</h1>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.username}</p>
                  </div>
                </div>

                <Button variant="ghost" size="sm" onClick={() => logout()} className="text-gray-600 hover:text-gray-900">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-4 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total URLs</p>
                    <p className="text-3xl font-bold text-gray-900">{urls.length}</p>
                  </div>
                  <Link2 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Visits</p>
                    <p className="text-3xl font-bold text-gray-900">{totalVisits}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Visits</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {urls.length > 0 ? Math.round(totalVisits / urls.length) : 0}
                    </p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* URL Shortener Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create Short URL
              </CardTitle>
              <CardDescription>Enter a long URL to create a shortened version</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL to shorten</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/very-long-url"
                    {...register('url', { required: true })}
                    className="w-full"
                  />
                </div>

                {errors && errors.url && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.url.message}</AlertDescription>
                  </Alert>
                )}

                {shortenedUrl && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="space-y-3">
                      <div>
                        <p className="font-medium text-green-800">URL shortened successfully!</p>
                      </div>
                      <div className="flex items-center gap-2 rounded-md bg-white p-3 border">
                        <code className="flex-1 text-sm">{shortenedUrl}</code>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(shortenedUrl)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Shortening...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Shorten URL
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                URL Dashboard
              </CardTitle>
              <CardDescription>View and manage all your shortened URLs</CardDescription>
            </CardHeader>
            <CardContent>
              {urls.length === 0 ? (
                <div className="text-center py-12">
                  <Link2 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No URLs yet</h3>
                  <p className="mt-2 text-gray-500">Create your first shortened URL using the form above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {urls.map((urlItem) => (
                    <div
                      key={urlItem.id}
                      className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="font-mono text-xs px-2 py-1">
                              {urlItem.urlCode}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {urlItem.visitCount} visits
                            </Badge>
                            <span className="text-xs text-gray-500">{formatDate(urlItem.createdAt)}</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-blue-600 break-all">{urlItem.shortUrl}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(urlItem.shortUrl!)}
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  window.open(urlItem.shortUrl, "_blank")
                                  fetchUrls()
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>

                            <p className="text-sm text-gray-600 break-all leading-relaxed">{urlItem.url}</p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteUrl(urlItem.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
