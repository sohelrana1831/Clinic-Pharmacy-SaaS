'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, Pill, MessageSquare, Check, Star, Phone, Mail, Facebook, Twitter, Linkedin } from 'lucide-react'
import { ariaPatterns, focusStyles } from '@/lib/accessibility-utils'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Skip to content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        aria-label="মূ�� কন্টেন্টে যান"
      >
        মূল কন্টেন্ট�� যান
      </a>

      {/* Navigation Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ক</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">ক্লিনিক মস</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">ফিচার</a>
              <a href="#pricing" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">প্রাইসিং</a>
              <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">যোগাযোগ</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  লগ ইন
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  শুরু করুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-blue-950 dark:to-emerald-950 pt-20 pb-16 transition-colors duration-200"
        role="banner"
        aria-label="প্রধান ব্যানার"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                বাংলাদেশের #১ ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সিস্টেম
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-4">
                আধুনিক প্রযুক্���ি দিয়ে আপনার ক্লিনিক ও ফার্মেসি পরিচালনা করুন।
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8">
                রোগীর তথ্য, অ্যাপয়েন্টমেন্ট, প্রেসক্রিপশন এবং স্টক ম্যানেজমেন্ট - সব একসাথে।
              </p>
              <div className="flex flex-col sm:flex-row gap-4" role="group" aria-label="প্রধান কর্মক্ষেত্র">
                <Link href="/auth/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white px-8 py-3 ${focusStyles.ring}`}
                    aria-label="১৪ দিনের ফ্রি ট্রায়াল শুরু করুন, কোন ক্রেডিট কার্ড প্রয়োজন নেই"
                  >
                    ফ্রি ট্রায়াল শুরু করুন
                  </Button>
                </Link>
                <Link href="/auth/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className={`w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 focus:bg-blue-50 px-8 py-3 ${focusStyles.ring}`}
                    aria-label="লাইভ ডেমো দেখুন, কোন রে��িস্ট্রেশন ��্রয়োজন নেই"
                  >
                    ডেমো দেখুন
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 sm:p-8 transition-colors duration-200">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIyMTYiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNFNUU3RUIiLz4KPHN2ZyB4PSI2MCIgeT0iNjAiIHdpZHRoPSIyODAiIGhlaWdodD0iMTM2IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iMjgwIiBoZWlnaHQ9IjM2IiBmaWxsPSIjMzM4MUY2Ii8+CiAgPHJlY3QgeT0iNTIiIHdpZHRoPSIxMzAiIGhlaWdodD0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KICA8cmVjdCB5PSI4NCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0Y5RkFGQiIvPgogIDxyZWN0IHk9IjExNiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0Y5RkFGQiIvPgo8L3N2Zz4KPC9zdmc+"
                  alt="ক্লিনিক ম্যানেজমেন্ট ড্যাশবোর্ডের স্ক্রিনশট - রোগীর তা���িকা, অ্যাপয়েন্টমেন্ট এবং রিপ���র্ট দেখাচ্ছে"
                  className="w-full h-64 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="main-content"
        className="py-16 sm:py-20 bg-white dark:bg-gray-900 transition-colors duration-200"
        aria-label="প্রধান ফিচার সমূহ"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              শক্তিশালী ফিচার সমূহ
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              বাংলা ও English দুটো ভাষা supported এবং SSLCommerz ও Stripe-ready
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8" role="list">
            <Card
              className={`text-center hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 ${focusStyles.within}`}
              role="listitem"
              tabIndex={0}
              aria-label="অ্যাপয়েন্টমেন্ট ম্যানেজমেন্ট ফিচার"
            >
              <CardHeader>
                <div
                  className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
                  aria-hidden="true"
                >
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">অ্যাপয়েন্টমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">অনলাইন ���ুকিং এবং স্বয়ংক্রিয় SMS রিমাইন্ডার সিস্টেম।</p>
              </CardContent>
            </Card>

            <Card
              className={`text-center hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 ${focusStyles.within}`}
              role="listitem"
              tabIndex={0}
              aria-label="প্রেসক্রিপশন ম্যানেজমেন্ট ফিচার"
            >
              <CardHeader>
                <div
                  className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
                  aria-hidden="true"
                >
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">প্রেসক্রিপশন</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">ডিজিটাল প্রেসক্রিপশন তৈরি করুন এবং PDF প্রিন্ট করুন।</p>
              </CardContent>
            </Card>

            <Card
              className={`text-center hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 ${focusStyles.within}`}
              role="listitem"
              tabIndex={0}
              aria-label="ফার্মেসি স্টক ম্যানেজমেন্ট ফিচার"
            >
              <CardHeader>
                <div
                  className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4"
                  aria-hidden="true"
                >
                  <Pill className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">ফার্মেসি স্টক</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">ইনভেন্টরি ম্যানেজমেন্ট এবং এক্সপায়ারি ডেট ট্র্যাকিং।</p>
              </CardContent>
            </Card>

            <Card
              className={`text-center hover:shadow-lg transition-all duration-300 border-green-100 dark:border-green-800 bg-white dark:bg-gray-800 ${focusStyles.within}`}
              role="listitem"
              tabIndex={0}
              aria-label="SMS রিমাইন্ডার ফিচার"
            >
              <CardHeader>
                <div
                  className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4"
                  aria-hidden="true"
                >
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl text-gray-900 dark:text-gray-100">SMS রিমাইন্ডার</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">স্বয়ংক্রিয় SMS এবং ইমেইল নোটিফিকেশন সিস্টেম।</p>
              </CardContent>
            </Card>
          </div>

          {/* Product Screenshots */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-8 flex items-center px-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 h-40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">রোগীর তালিকা</h3>
                  <div className="w-16 h-6 bg-blue-100 dark:bg-blue-900 rounded text-xs flex items-center justify-center text-blue-600 dark:text-blue-300">৫৪ জন</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="w-8 h-8 bg-blue-200 dark:bg-blue-800 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-20 h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-500 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-full"></div>
                    <div className="flex-1">
                      <div className="w-24 h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="w-14 h-2 bg-gray-200 dark:bg-gray-500 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-8 flex items-center px-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 h-40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">প্রেসক্রিপশন</h3>
                  <div className="w-12 h-6 bg-emerald-100 dark:bg-emerald-900 rounded text-xs flex items-center justify-center text-emerald-600 dark:text-emerald-300">নতুন</div>
                </div>
                <div className="space-y-2">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded p-3">
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-6 bg-blue-100 dark:bg-blue-900 rounded text-xs flex items-center justify-center text-blue-600 dark:text-blue-300">সেভ</div>
                    <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded text-xs flex items-center justify-center text-gray-600 dark:text-gray-300">প্রিন্ট</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-colors border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-8 flex items-center px-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
              <div className="p-4 h-40">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">ইনভেন্টরি</h3>
                  <div className="w-16 h-6 bg-red-100 dark:bg-red-900 rounded text-xs flex items-center justify-center text-red-600 dark:text-red-300">স্টক কম</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                    <span className="text-xs text-gray-700 dark:text-gray-300">প্যারাসিটামল</span>
                    <span className="text-xs text-red-600 dark:text-red-400 font-medium">৫টি</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                    <span className="text-xs text-gray-700 dark:text-gray-300">নাপা এক্সটেন্ড</span>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">২৫০টি</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                    <span className="text-xs text-gray-700 dark:text-gray-300">সিরাপ</span>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">১২টি</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-850 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              সাশ্রয়ী মূল্যে প্ল্যা��� সমূহ
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">বেসিক</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">৳২,৫০০</span>
                  <span className="text-gray-600">/মাস</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>১০০ র���গীর রেকর্ড</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>অ্যাপয়েন্টমেন্ট বু���িং</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>বেসিক রিপোর্ট</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500 bg-blue-50 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">জনপ্রিয়</span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">প্রো</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">৳৪,৫০০</span>
                  <span className="text-gray-600">/মাস</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>৫০০ রোগীর রেকর���ড</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>ফার্মেসি ইনভেন্টরি</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>SMS নোটিফিকেশন</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">এন্টারপ্রাইজ</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">৳৮,০০০</span>
                  <span className="text-gray-600">/মাস</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>আনলিমিটেড রোগী</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>মাল্টি-ব্রাঞ্চ সাপোর্ট</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>অ্যাডভান্স অ্যানালিটিক্স</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              আমাদের ক্লায়েন্টদের মতামত
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "এই সফটওয়্যার ব্যবহার করে আ���াদের ক্লিনিকের কাজের গতি অনেক বেড়েছে। রোগীদের তথ��য সংরক্ষণ এবং অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা এখন অনেক সহজ।"
              </p>
              <div>
                <p className="font-semibold text-gray-900">ডা. রহিম উদ্দিন</p>
                <p className="text-gray-600">প্রধান চিকিৎসক, SR Pharma</p>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "ফার্মেসি ইনভেন্টরি ম্যানেজমেন্��� ফিচারটি অসাধা�����। এখন আর ওষুধের স্টক নিয়ে চিন্তা করতে হয় না।"
              </p>
              <div>
                <p className="font-semibold text-gray-900">নাসির আহমেদ</p>
                <p className="text-gray-600">ম্যানেজার, সিটি হেলথ ক্লিনিক</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              প্রায়শই জিজ্ঞাসিত প্রশ্ন
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">পেমেন্ট কিভাবে করব?</h3>
                <p className="text-gray-600">আমরা মোবাইল ব্যাংকিং, ব্যাং�� ট্রান্সফার এবং অ����লাইন পেমেন্ট সিস্টেম সাপোর্ট করি। SSLCommerz এর মাধ্যমে নিরাপদ পেমেন্ট করতে পারেন।</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">সেটআপ করতে কত সময় লাগে?</h3>
                <p className="text-gray-600">সাধারণত ১-২ ঘন্টার মধ্যে আপনার সিস্টেম সেটআপ হ��়ে যাবে। আমাদের টিম আপনাকে সম্পূর্ণ প্রক্রিয়ায় সাহায্য করবে।</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">ডেটা এক্সপোর্ট করা যাবে?</h3>
                <p className="text-gray-600">হ্যাঁ, আপনি যেকোনো সময় আপনার সকল ডেটা Excel, PDF বা CSV ফরম্যাটে এক্সপোর্ট করতে পারবেন।</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">সাপোর্ট কেমন পাবো?</h3>
                <p className="text-gray-600">আমরা ২৪/৭ ফোন, ইমেইল এবং হোয়াটসঅ্যাপ সাপোর্ট প্রদান করি। বাংলা ও ইংরেজি দুই ভাষাতেই সাহায্য পাবেন।</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-gray-900 text-white py-12"
        role="contentinfo"
        aria-label="সাইট ফুটার"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">ক্লিনিক ম্যানেজমেন্ট সিস্টেম</h3>
              <p className="text-gray-300 mb-4 text-sm sm:text-base">
                বাংলাদেশের সবচেয়ে ভালো ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার।
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">যোগাযোগ</h4>
              <address className="space-y-2 not-italic">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-400" aria-hidden="true" />
                  <a
                    href="tel:+8801700000000"
                    className={`text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                    aria-label="ফোন করুন +৮৮০ ১৭০০ ০০০০০০"
                  >
                    +৮৮০ ১৭০০ ০০০০০০
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-400" aria-hidden="true" />
                  <a
                    href="mailto:support@clinicms.com"
                    className={`text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                    aria-label="ইমেইল পাঠান support@clinicms.com"
                  >
                    support@clinicms.com
                  </a>
                </div>
              </address>
            </div>

            <nav aria-label="ফুটার নেভিগেশন">
              <h4 className="font-semibold mb-4 text-white">দ্রুত লিংক</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/privacy"
                    className={`block text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                    aria-label="প্রাইভেসি পলিসি পড়ুন"
                  >
                    প্রাইভেসি পলিসি
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className={`block text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                    aria-label="টার্মস অফ সার্ভিস পড়ুন"
                  >
                    টার্মস অফ সার্ভিস
                  </a>
                </li>
                <li>
                  <a
                    href="/support"
                    className={`block text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                    aria-label="সাপোর্ট পেজে যান"
                  >
                    সাপোর্ট
                  </a>
                </li>
              </ul>
            </nav>

            <div>
              <h4 className="font-semibold mb-4 text-white">সোশ্যাল মিডিয়া</h4>
              <div className="flex space-x-4" role="list">
                <a
                  href="https://facebook.com/clinicms"
                  className={`text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                  aria-label="ফেসবুকে আমাদের ফলো করুন"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://twitter.com/clinicms"
                  className={`text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                  aria-label="টুইটারে আমাদের ফলো করুন"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="https://linkedin.com/company/clinicms"
                  className={`text-gray-300 hover:text-white transition-colors ${focusStyles.ring}`}
                  aria-label="লিংকডইনে আমাদের ফলো করুন"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © ২০২৪ ক্লিনিক ম্যানেজমে��্ট সিস্টেম। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
