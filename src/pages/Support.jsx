import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Clock, MapPin, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
            <p className="text-gray-600 mt-2">
              Get in touch with our team for any questions or emergencies
            </p>
          </div>

          {/* Emergency Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Phone */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone Support</h3>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Call us for immediate assistance with your orders, livestock inquiries, or any urgent matters.
              </p>
              <a
                href="tel:+254700000000"
                className="inline-flex items-center gap-2 text-green-600 font-medium hover:text-green-700"
              >
                +254 700 000 000
              </a>
            </div>

            {/* Email */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Us</h3>
                  <p className="text-sm text-gray-500">Response within 24 hours</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Send us a detailed message and we'll get back to you as soon as possible.
              </p>
              <a
                href="mailto:support@farmart.co.ke"
                className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
              >
                support@farmart.co.ke
              </a>
            </div>

            {/* Live Chat */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <p className="text-sm text-gray-500">Mon-Sat, 8am-8pm</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Chat with our support team in real-time for quick answers to your questions.
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <MessageCircle size={18} />
                Start Chat
              </button>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visit Us</h3>
                  <p className="text-sm text-gray-500">Office Hours: 9am-5pm</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Come see us at our headquarters for in-person assistance.
              </p>
              <p className="text-gray-900 font-medium">
                Nairobi, Kenya
              </p>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Operating Hours</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Customer Support</h4>
                <p className="text-gray-600">Monday - Saturday: 8:00 AM - 8:00 PM</p>
                <p className="text-gray-600">Sunday: 10:00 AM - 4:00 PM</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Emergency Livestock Support</h4>
                <p className="text-gray-600">Available 24/7 for urgent livestock emergencies</p>
                <p className="text-gray-600">Call: +254 700 000 000</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-green-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Need to Raise a Dispute?</h2>
            <p className="text-gray-600 mb-4">
              If you have an issue with an order or transaction, you can raise a dispute through our dedicated system.
            </p>
            <Link
              to="/dispute/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Raise a Dispute
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
