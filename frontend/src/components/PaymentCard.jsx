import React from "react";

export default function PaymentCard({ payment, isAdmin, onStatusUpdate, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "overdue":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {isAdmin ? payment.employee_name : "Payment"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Date: {formatDate(payment.date)}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                payment.status
              )}`}
            >
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(payment.amount)}
            </span>
          </div>
        </div>

        {payment.notes && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Notes:</span> {payment.notes}
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="mt-6 flex space-x-3">
            {payment.status !== "paid" && (
              <button
                onClick={() => onStatusUpdate(payment.id, "paid")}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors duration-200"
              >
                Mark as Paid
              </button>
            )}
            {payment.status !== "pending" && (
              <button
                onClick={() => onStatusUpdate(payment.id, "pending")}
                className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-700 transition-colors duration-200"
              >
                Mark as Pending
              </button>
            )}
            <button
              onClick={() => onDelete(payment.id)}
              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
