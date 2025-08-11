'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, FileText, Pill, MessageSquare, Check, Star, Phone, Mail, Facebook, Twitter, Linkedin } from 'lucide-react'
import { ariaPatterns, focusStyles } from '@/lib/accessibility-utils'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Skip to content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        aria-label="মূল কন্টেন্টে যান"
      >
        মূল কন্টেন্টে যান
      </a>

      {/* Hero Section */}
      <section
        className="bg-gradient-to-br from-blue-50 to-emerald-50 pt-20 pb-16"
        role="banner"
        aria-label="প্রধান ব্যানার"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                বাংলাদেশের #১ ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সিস্টেম
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-4">
                আধুনিক প্রযুক্তি দিয়ে আপনার ক্লিনিক ও ফার্মেসি পরিচালনা করুন।
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-8">
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
                    aria-label="লাইভ ডেমো দেখুন, কোন রেজিস্ট্রেশন প্রয়োজন নেই"
                  >
                    ডেমো দেখুন
                  </Button>
                </Link>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
                <img
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDQwMCAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjU2IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjIwIiB5PSIyMCIgd2lkdGg9IjM2MCIgaGVpZ2h0PSIyMTYiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNFNUU3RUIiLz4KPHN2ZyB4PSI2MCIgeT0iNjAiIHdpZHRoPSIyODAiIGhlaWdodD0iMTM2IiBmaWxsPSJub25lIj4KICA8cmVjdCB3aWR0aD0iMjgwIiBoZWlnaHQ9IjM2IiBmaWxsPSIjMzM4MUY2Ii8+CiAgPHJlY3QgeT0iNTIiIHdpZHRoPSIxMzAiIGhlaWdodD0iMjAiIGZpbGw9IiNFNUU3RUIiLz4KICA8cmVjdCB5PSI4NCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0Y5RkFGQiIvPgogIDxyZWN0IHk9IjExNiIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0Y5RkFGQiIvPgo8L3N2Zz4KPC9zdmc+"
                  alt="ক্লিনিক ম্যানেজমেন্ট ড্যাশবোর্ডের স্ক্রিনশট - রোগীর তালিকা, অ্যাপয়েন্টমেন্ট এবং রিপোর্ট দেখাচ্ছে"
                  className="w-full h-64 object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              শক্তিশালী ফিচার সমূহ
            </h2>
            <p className="text-xl text-gray-600">
              বাংলা ও English দুটো ভাষা supported এবং SSLCommerz ও Stripe-ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow border-green-100">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">অ্যাপয়েন্টমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">অনলাইন বুকিং এবং স্বয়ংক্রিয় SMS রিমাইন্ডার সিস্টেম।</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-green-100">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">প্রেসক্রিপশন</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">ডিজিটাল প্রেসক্রিপশন তৈরি করুন এবং PDF প্রিন্ট করুন।</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-green-100">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Pill className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">ফার্মেসি স্টক</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">ইনভেন্টরি ম���যানেজমেন্ট এবং এক্সপায়ারি ডেট ট্র্যাকিং।</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow border-green-100">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">SMS রিমাইন্ডার</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">স্বয়ংক্রিয় SMS এবং ইমেইল নোটিফিকেশন সিস্টেম।</p>
              </CardContent>
            </Card>
          </div>

          {/* Product Screenshots */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 rounded-lg p-6 h-48 flex items-center justify-center">
              <span className="text-gray-500 text-sm text-center">Patient Management Interface</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-48 flex items-center justify-center">
              <span className="text-gray-500 text-sm text-center">Prescription Writing Tool</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-6 h-48 flex items-center justify-center">
              <span className="text-gray-500 text-sm text-center">Inventory Dashboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              সাশ্রয়ী মূল্যে প্ল্যান সমূহ
            </h2>
            <p className="text-xl text-gray-600">আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন</p>
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
                    <span>অ্যাপয়েন্টমেন্ট বুকিং</span>
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
                    <span>৫০০ রোগীর রেকর্ড</span>
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
                "এই সফটওয়্যার ব্যবহার করে আমাদের ক্লিনিকের কাজের গতি অনেক বেড়েছে। রোগীদের তথ্য সংরক্ষণ এবং অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা এখন অনেক সহজ।"
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
                "ফার্মেসি ইনভেন্টরি ম্যানেজমেন্��� ফিচারটি অসাধা���ণ। এখন আর ওষুধের স্টক নিয়ে চিন্তা করতে হয় না।"
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
                <p className="text-gray-600">আমরা মোবাইল ব্যাংকিং, ব্যাং�� ট্রান্সফার এবং অ���লাইন পেমেন্ট সিস্টেম সাপোর্ট করি। SSLCommerz এর মাধ্যমে নিরাপদ পেমেন্ট করতে পারেন।</p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">সেটআপ করতে কত সময় লাগে?</h3>
                <p className="text-gray-600">সাধারণত ১-২ ঘন্টার মধ্যে আপনার সিস্টেম সেটআপ হয়ে যাবে। আমাদের টিম আপনাকে সম্পূর্ণ প্রক্রিয়ায় সাহায্য করবে।</p>
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ক্লিনিক ম্যানেজমেন্ট সিস্টেম</h3>
              <p className="text-gray-400 mb-4">
                বাংলাদেশের সবচেয়ে ভালো ক্লিনিক ও ফার্মেসি ম্যানেজমেন্ট সফটওয়্যার।
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">যোগাযোগ</h4>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-gray-400">+৮৮০ ১৭০০ ০০০০০০</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-gray-400">support@clinicms.com</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">দ্রুত লিংক</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">প্রাইভেসি পলিসি</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">টার্মস অফ সার্ভিস</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">সাপোর্ট</a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">সোশ্যাল মিডিয়া</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © ২০২৪ ক্লিনিক ম্যানেজমেন্ট সিস্টেম। সর্বস্বত্ব সংরক্ষিত।
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
