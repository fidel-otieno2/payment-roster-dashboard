import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PaymentCard from "../components/PaymentCard";
import PaymentFilters from "../components/PaymentFilters";
import "../dashboard.css";

export default function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [sidebarActive, setSidebarActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  console.log("Dashboard user:", user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:4000/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data);
      setFilteredPayments(response.data);
    } catch (err) {
      setError("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  const totalPayments = payments.length;
  const paidPayments = payments.filter(p => p.status === 'paid').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const overduePayments = payments.filter(p => p.status === 'overdue').length;
  const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  if (loading) {
    return (
      <div className="dashboard">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}>
          <div className="loading">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarActive ? 'active' : ''}`}>
        <h2>Payment Roster</h2>
        <ul>
          <li onClick={() => navigate("/")}>🏠 Dashboard</li>
          {user.role === "admin" && <li onClick={() => navigate("/add-payment")}>➕ Add Payment</li>}
          {user.role === "admin" && <li onClick={() => navigate("/statistics")}>📊 Statistics</li>}
          {user.role === "admin" && <li onClick={() => navigate("/user-management")}>👥 User Management</li>}
          <li onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <h1>Payment Dashboard</h1>
          <p>Welcome back, {user.name}! 👋</p>
        </header>

        {/* Menu Toggle Button for Mobile */}
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Stats Cards */}
        <section className="stats-cards">
          <div className="stat-card">
            <h3>Total Payments</h3>
            <p>{totalPayments}</p>
          </div>
          <div className="stat-card">
            <h3>Paid</h3>
            <p>{paidPayments}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{pendingPayments}</p>
          </div>
          <div className="stat-card">
            <h3>Overdue</h3>
            <p>{overduePayments}</p>
          </div>
          <div className="stat-card">
            <h3>Total Amount</h3>
            <p>${totalAmount.toFixed(2)}</p>
          </div>
        </section>

        {/* Filters */}
        <section className="filters">
          <h3>Filters</h3>
          <PaymentFilters onFilter={(filters) => {
            let filtered = payments;
            if (filters.status) {
              filtered = filtered.filter((payment) => payment.status === filters.status);
            }
            setFilteredPayments(filtered);
          }} isAdmin={user.role === "admin"} />
        </section>

        {/* Payment Cards */}
        <section className="payment-cards">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                isAdmin={user.role === "admin"}
                onStatusUpdate={async (paymentId, newStatus) => {
                  try {
                    const token = localStorage.getItem("token");
                    await axios.patch(
                      `http://localhost:4000/api/payments/${paymentId}`,
                      { status: newStatus },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    fetchPayments();
                  } catch (err) {
                    setError("Failed to update payment status");
                  }
                }}
                onDelete={async (paymentId) => {
                  if (window.confirm("Are you sure you want to delete this payment?")) {
                    try {
                      const token = localStorage.getItem("token");
                      await axios.delete(`http://localhost:4000/api/payments/${paymentId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      fetchPayments();
                    } catch (err) {
                      setError("Failed to delete payment");
                    }
                  }
                }}
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
              <p>No payments found matching your criteria.</p>
            </div>
          )}
        </section>

        {/* Charts Section */}
        <section className="charts">
          <div className="chart">
            <h3>Payment Status Distribution</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: '10px' }}>
              <div style={{ height: `${totalPayments > 0 ? (paidPayments / totalPayments) * 100 : 0}%`, background: '#28a745', flex: 1, borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'end', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                Paid
              </div>
              <div style={{ height: `${totalPayments > 0 ? (pendingPayments / totalPayments) * 100 : 0}%`, background: '#ffc107', flex: 1, borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'end', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                Pending
              </div>
              <div style={{ height: `${totalPayments > 0 ? (overduePayments / totalPayments) * 100 : 0}%`, background: '#dc3545', flex: 1, borderRadius: '4px 4px 0 0', display: 'flex', alignItems: 'end', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                Overdue
              </div>
            </div>
          </div>
          <div className="chart">
            <h3>Monthly Overview</h3>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ color: '#6c757d' }}>Chart visualization would go here</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
