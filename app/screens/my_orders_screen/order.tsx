"use client"

import React, { useState } from "react"
import {
  ChevronLeft,
  Package,
  MapPin,
  Store,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  MoreVertical,
  Copy,
} from "lucide-react"

const ordersData = [
  {
    id: 1,
    status: "Delivered",
    date: "19/09/2025",
    message: "Your feedback will help others make the right choice. Tap here to share your review",
    orderNumber: "22137961564012",
    tracking: "LK-DM-DEX-026360943",
    image: "https://via.placeholder.com/80",
    showReview: true,
    customerName: "Devinda Thisera",
    customerRef: "767286976",
    address: "Kurunegala Town, 54/1/D Kandawalpola Road Maraluwa...",
    storeName: "ssmobile",
    productName: "Bajaj Pulsar 150 180 Pulsar N160 N125 NS200 Fabric Waterproof Outdoor Moto...",
    price: 1399,
    quantity: 1,
    total: 1553,
  },
  {
    id: 2,
    status: "Delivered",
    date: "19/09/2025",
    message: "Your feedback will help others make the right choice. Tap here to share your review",
    orderNumber: "22137961484012",
    tracking: "LK-DM-DEX-026364441",
    image: "https://via.placeholder.com/80",
    showReview: true,
    customerName: "Devinda Thisera",
    customerRef: "767286976",
    address: "Kurunegala Town, 54/1/D Kandawalpola Road Maraluwa...",
    storeName: "ssmobile",
    productName: "Smart Watch with Multiple Features and Long Battery Life",
    price: 2499,
    quantity: 1,
    total: 2650,
  },
]

type Order = (typeof ordersData)[number]

export default function OrderDetailsPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  const copyOrderNumber = async () => {
    if (selectedOrder) {
      await navigator.clipboard.writeText(selectedOrder.orderNumber)
    }
  }

  // Show Order Details View
  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
          <button onClick={() => setSelectedOrder(null)} className="p-1">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold flex-1 ml-3">Order Details</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                1
              </div>
            </div>
            <MoreVertical className="w-6 h-6" />
          </div>
        </div>

        <div className="overflow-y-auto">
          {/* Delivery Status Banner */}
          <div className="bg-pink-100 flex gap-4 p-5 items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-black mb-2">Delivered</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                You have confirmed that your order has been delivered and received. Thank you for shopping with us.
              </p>
            </div>
            <img src="https://via.placeholder.com/80" alt="Delivered" className="w-20 h-20" />
          </div>

          {/* Package Delivered Info */}
          <button className="flex items-center gap-3 w-full px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-black flex-1">19 Sep-Package delivered!</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Delivery Address */}
          <div className="bg-white px-4 py-4 border-b border-gray-100">
            <div className="flex gap-3">
              <MapPin className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-black">
                  {selectedOrder.customerName}{" "}
                  <span className="text-xs font-normal text-gray-500">{selectedOrder.customerRef}</span>
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">{selectedOrder.address}</p>
              </div>
            </div>
          </div>

          {/* Store Info */}
          <button className="flex items-center gap-3 w-full px-4 py-4 bg-white border-b border-gray-100 hover:bg-gray-50">
            <Store className="w-5 h-5 text-black" />
            <span className="text-sm font-semibold text-black flex-1">{selectedOrder.storeName}</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {/* Product Details */}
          <div className="bg-white border-b-8 border-gray-100 p-4">
            <div className="flex gap-3 mb-4">
              <img
                src={selectedOrder.image || "/placeholder.svg"}
                alt={selectedOrder.productName}
                className="w-20 h-20 rounded-lg bg-gray-100"
              />
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-black leading-relaxed">{selectedOrder.productName}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-black">Rs. {selectedOrder.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Qty: {selectedOrder.quantity}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-3">
              <button className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50">
                Return/Refund
              </button>
              <button className="flex-1 py-2.5 border border-orange-400 rounded-lg text-sm font-medium text-orange-500 hover:bg-orange-50">
                Write A Review
              </button>
            </div>

            {/* Chat with Seller */}
            <button className="flex items-center justify-center gap-2 w-full py-3 text-sm text-red-500 font-medium hover:bg-red-50 rounded-lg">
              <MessageCircle className="w-4 h-4" />
              Chat with Seller
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white border-b-8 border-gray-100 p-4">
            <div className="flex justify-between mb-3">
              <p className="text-sm font-semibold text-black">Total</p>
              <p className="text-sm font-bold text-black">Rs. {selectedOrder.total.toLocaleString()}</p>
            </div>
            <div className="flex justify-between mb-4">
              <p className="text-sm text-black">Order No.</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-black">{selectedOrder.orderNumber}</p>
                <button
                  onClick={copyOrderNumber}
                  className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  copy
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="flex items-center justify-center gap-2 w-full text-sm text-blue-600 font-medium hover:underline"
            >
              View Order Summary
              {showSummary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Related Products */}
          <div className="bg-gray-50 p-4">
            <div className="flex gap-3 overflow-x-auto">
              <img
                src="https://via.placeholder.com/150"
                alt="Related"
                className="w-36 h-36 rounded-lg bg-white flex-shrink-0"
              />
              <img
                src="https://via.placeholder.com/150"
                alt="Related"
                className="w-36 h-36 rounded-lg bg-white flex-shrink-0"
              />
            </div>
          </div>

          {/* Buy Again Button */}
          <button className="m-4 w-[calc(100%-2rem)] bg-orange-500 text-white font-semibold py-3.5 rounded-lg hover:bg-orange-600">
            Buy again
          </button>
        </div>
      </div>
    )
  }

  // Show Orders List View
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200">
        <button className="p-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold flex-1 ml-3">Orders</h1>
        <button className="p-1">
          <ShoppingCart className="w-6 h-6" />
        </button>
      </div>

      {/* Orders List */}
      <div className="overflow-y-auto">
        {ordersData.map((order) => (
          <button
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="w-full bg-white mx-3 my-3 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            {/* Order Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-black">{order.status}</p>
                <p className="text-xs text-gray-400">{order.date}</p>
              </div>
            </div>

            {/* Order Content */}
            <div className="flex gap-3 mb-3">
              <img
                src={order.image || "/placeholder.svg"}
                alt=""
                className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-xs text-gray-600 leading-relaxed mb-2">{order.message}</p>
                {order.orderNumber && (
                  <>
                    <p className="text-xs text-gray-400">Order # {order.orderNumber}</p>
                    <p className="text-xs text-gray-400">Tracking # {order.tracking}</p>
                  </>
                )}
              </div>
            </div>

            {/* Order Footer */}
            {order.showReview && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-600">
                  Review products and earn up to <span className="font-semibold text-black">❤️ 600</span>
                </div>
                <button className="px-5 py-2 border border-pink-400 rounded-full text-xs font-semibold text-pink-600 hover:bg-pink-50">
                  Review
                </button>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
