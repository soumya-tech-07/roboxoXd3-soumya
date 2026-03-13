'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { useToast } from '../context/ToastContext';
import MeasurementForm from '../components/MeasurementForm';

const supabase = createClient();

function EyeIcon({ open }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    loading: authLoading,
    profile,
    updateProfile,
    updatePassword,
  } = useAuth();
  const { openLogin } = useAuthModal();
  const { showError, showSuccess } = useToast();
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [addressLine1, setAddressLine1] = useState(profile?.address_line1 || '');
  const [addressLine2, setAddressLine2] = useState(profile?.address_line2 || '');
  const [city, setCity] = useState(profile?.city || '');
  const [state, setState] = useState(profile?.state || '');
  const [postalCode, setPostalCode] = useState(profile?.postal_code || '');
  const [country, setCountry] = useState(profile?.country || 'India');
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletCurrency, setWalletCurrency] = useState('INR');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState('');
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [walletTopupAmount, setWalletTopupAmount] = useState('');
  const [walletTopupLoading, setWalletTopupLoading] = useState(false);

  // Redirect to home and open login modal if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      setTimeout(() => {
        openLogin();
      }, 100);
    }
  }, [isAuthenticated, authLoading, router, openLogin]);

  // Load orders when orders tab is active
  useEffect(() => {
    if (isAuthenticated && user && activeTab === 'orders') {
      loadOrders();
    }
  }, [isAuthenticated, user, activeTab]);

  // Load wallet when wallet tab is active
  useEffect(() => {
    if (isAuthenticated && user && activeTab === 'wallet') {
      loadWallet();
    }
  }, [isAuthenticated, user, activeTab]);

  // Keep local state in sync with loaded profile
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhone(profile.phone || '');
      setAddressLine1(profile.address_line1 || '');
      setAddressLine2(profile.address_line2 || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setPostalCode(profile.postal_code || '');
      setCountry(profile.country || 'India');
    }
  }, [profile]);

  const handleProfileSave = async (event) => {
    event.preventDefault();

    if (!firstName.trim() && !lastName.trim()) {
      showError('Please enter at least one name field.');
      return;
    }

    try {
      setSavingProfile(true);
      const { error } = await updateProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || null,
        address_line1: addressLine1.trim() || null,
        address_line2: addressLine2.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        postal_code: postalCode.trim() || null,
        country: country.trim() || null,
      });

      if (error) {
        showError(error.message || 'Failed to update profile details.');
        return;
      }

      showSuccess('Profile details updated successfully.');
      setEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Something went wrong while updating your profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const cancelEditProfile = () => {
    setFirstName(profile?.first_name || '');
    setLastName(profile?.last_name || '');
    setPhone(profile?.phone || '');
    setAddressLine1(profile?.address_line1 || '');
    setAddressLine2(profile?.address_line2 || '');
    setCity(profile?.city || '');
    setState(profile?.state || '');
    setPostalCode(profile?.postal_code || '');
    setCountry(profile?.country || 'India');
    setEditingProfile(false);
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!newPassword) {
      showError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 6) {
      showError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('New password and confirmation do not match.');
      return;
    }

    try {
      setChangingPassword(true);
      const { error } = await updatePassword(newPassword);

      if (error) {
        showError(error.message || 'Failed to change password.');
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showSuccess('Password updated successfully.');
      setEditingPassword(false);
    } catch (error) {
      console.error('Error updating password:', error);
      showError('Something went wrong while updating your password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const cancelEditPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setEditingPassword(false);
  };

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Load order items for each order with product images
      const ordersWithItems = await Promise.all(
        (data || []).map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id)
            .order('created_at', { ascending: true });

          if (itemsError) throw itemsError;

          // Fetch product images for each item
          const itemsWithImages = await Promise.all(
            (items || []).map(async (item) => {
              if (item.product_id) {
                const { data: product, error: productError } = await supabase
                  .from('products')
                  .select('image_url, gallery')
                  .eq('id', item.product_id)
                  .single();

                if (!productError && product) {
                  const gallery = Array.isArray(product.gallery) 
                    ? product.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
                    : [];
                  const productImage = gallery.length > 0 ? gallery[0] : (product.image_url || null);
                  
                  return {
                    ...item,
                    productImage,
                  };
                }
              }
              return item;
            })
          );

          return {
            ...order,
            items: itemsWithImages || [],
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (error) {
      console.error('Error loading orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async () => {
    if (!user) return;
    try {
      setWalletLoading(true);
      setWalletError('');

      const { data: balanceRow, error: balanceError } = await supabase
        .from('wallet_balances')
        .select('wallet_id, currency, balance')
        .eq('user_id', user.id)
        .eq('currency', 'INR')
        .maybeSingle();

      if (balanceError) {
        console.error('Error loading wallet balance:', balanceError);
        setWalletBalance(0);
      } else if (balanceRow) {
        setWalletBalance(Number(balanceRow.balance) || 0);
        setWalletCurrency(balanceRow.currency || 'INR');

        const { data: txs } = await supabase
          .from('wallet_transactions')
          .select('id, type, amount, source, reference_type, reference_id, note, created_at')
          .eq('wallet_id', balanceRow.wallet_id)
          .order('created_at', { ascending: false })
          .limit(10);
        setWalletTransactions(txs || []);
      } else {
        setWalletBalance(0);
        setWalletTransactions([]);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
      setWalletError('Failed to load wallet. Please try again later.');
      setWalletBalance(0);
      setWalletTransactions([]);
    } finally {
      setWalletLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-purple-600 bg-purple-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getPaymentMethodDisplay = (paymentMethod, paymentStatus) => {
    if (paymentMethod === 'COD') {
      return {
        text: 'Pay on Delivery',
        color: 'text-yellow-600 bg-yellow-50',
      };
    } else if (paymentMethod === 'ONLINE') {
      return {
        text: 'Paid',
        color: 'text-green-600 bg-green-50',
      };
    }
    // Fallback
    return {
      text: paymentStatus === 'paid' ? 'Paid' : 'Pending',
      color: paymentStatus === 'paid' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50',
    };
  };

  const getDeliveryStatus = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'completed':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Pending';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
            MY PROFILE
          </h1>
          <p className="text-xs sm:text-sm text-gray-600" style={{ lineHeight: '1.6' }}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('account')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'account'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            >
              ACCOUNT INFO
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            >
              MY ORDERS
            </button>
            <button
              onClick={() => setActiveTab('measurements')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'measurements'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            >
              BODY MEASUREMENTS
            </button>
            <button
              onClick={() => setActiveTab('wallet')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-all cursor-pointer ${
                activeTab === 'wallet'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            >
              WALLET
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {/* Account Info Tab */}
          {activeTab === 'account' && (
            <div className="max-w-2xl space-y-4">

              {/* ── PERSONAL INFORMATION ── */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Card header with Edit toggle */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900 tracking-wider">
                    PERSONAL INFORMATION
                  </h2>
                  {!editingProfile && (
                    <button
                      type="button"
                      onClick={() => setEditingProfile(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
                      </svg>
                      Edit
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {editingProfile ? (
                    /* ── Edit form ── */
                    <form onSubmit={handleProfileSave} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">
                            FIRST NAME
                          </label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            autoFocus
                            className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            placeholder="Enter first name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">
                            LAST NAME
                          </label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">
                          EMAIL ADDRESS
                        </label>
                        <div className="flex items-center gap-2 border border-gray-200 bg-gray-50 rounded px-3 py-2.5">
                          <span className="text-sm text-gray-500 select-all">{user?.email}</span>
                          <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded shrink-0">
                            cannot edit
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">
                          PHONE
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                          placeholder="e.g. +91 98765 43210"
                        />
                      </div>

                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <h3 className="text-xs font-medium tracking-widest text-gray-500 mb-3">ADDRESS</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">ADDRESS LINE 1</label>
                            <input
                              type="text"
                              value={addressLine1}
                              onChange={(e) => setAddressLine1(e.target.value)}
                              className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                              placeholder="Street, building, area"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">ADDRESS LINE 2 (optional)</label>
                            <input
                              type="text"
                              value={addressLine2}
                              onChange={(e) => setAddressLine2(e.target.value)}
                              className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                              placeholder="Landmark, floor, etc."
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">CITY</label>
                              <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">STATE</label>
                              <input
                                type="text"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                placeholder="State"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">POSTAL CODE</label>
                              <input
                                type="text"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                                placeholder="PIN / ZIP"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">COUNTRY</label>
                            <input
                              type="text"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                              placeholder="Country"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={savingProfile}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs tracking-widest rounded hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          {savingProfile ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              SAVING...
                            </>
                          ) : 'SAVE CHANGES'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditProfile}
                          disabled={savingProfile}
                          className="px-5 py-2.5 border border-gray-300 text-gray-600 text-xs tracking-widest rounded hover:border-gray-400 hover:text-gray-800 disabled:opacity-50 cursor-pointer transition-colors"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ── Read-only view ── */
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                        <span className="text-white text-base font-medium select-none">
                          {firstName
                            ? firstName.charAt(0).toUpperCase()
                            : user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {firstName || lastName
                            ? `${firstName} ${lastName}`.trim()
                            : <span className="text-gray-400 italic">No name set</span>}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        {phone && <p className="text-sm text-gray-600">{phone}</p>}
                        {(profile?.address_line1 || profile?.city) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs font-medium tracking-widest text-gray-400 mb-1">ADDRESS</p>
                            <p className="text-sm text-gray-600">
                              {profile.address_line1}
                              {profile.address_line2 && `, ${profile.address_line2}`}
                              {(profile.city || profile.state || profile.postal_code) && (
                                <br />
                              )}
                              {[profile.city, profile.state, profile.postal_code].filter(Boolean).join(', ')}
                              {profile.country && (
                                <>
                                  <br />
                                  {profile.country}
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ── CHANGE PASSWORD ── */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Card header with toggle */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-gray-900 tracking-wider">
                    PASSWORD
                  </h2>
                  {!editingPassword && (
                    <button
                      type="button"
                      onClick={() => setEditingPassword(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 012.828 0l.172.172a2 2 0 010 2.828L12 16H9v-3z" />
                      </svg>
                      Change
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {editingPassword ? (
                    /* ── Password form ── */
                    <form onSubmit={handlePasswordChange} className="space-y-5">
                      {/* Current Password */}
                      <div>
                        <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">
                          CURRENT PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            autoFocus
                            className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 pr-10 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                            placeholder="Enter current password"
                          />
                          <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" tabIndex={-1}>
                            <EyeIcon open={showCurrentPassword} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* New Password */}
                        <div>
                          <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">
                            NEW PASSWORD
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 pr-10 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                              placeholder="Min. 6 characters"
                            />
                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" tabIndex={-1}>
                              <EyeIcon open={showNewPassword} />
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label className="block text-xs font-medium tracking-widest text-gray-500 mb-2">
                            CONFIRM PASSWORD
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full border bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 pr-10 text-sm rounded focus:outline-none focus:ring-1 focus:border-black transition-colors ${
                                confirmPassword && newPassword !== confirmPassword
                                  ? 'border-red-400 focus:ring-red-400'
                                  : 'border-gray-300 focus:ring-black'
                              }`}
                              placeholder="Re-enter new password"
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer" tabIndex={-1}>
                              <EyeIcon open={showConfirmPassword} />
                            </button>
                          </div>
                          {confirmPassword && newPassword !== confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-500">Passwords do not match</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="submit"
                          disabled={changingPassword}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs tracking-widest rounded hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
                        >
                          {changingPassword ? (
                            <>
                              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              UPDATING...
                            </>
                          ) : 'UPDATE PASSWORD'}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditPassword}
                          disabled={changingPassword}
                          className="px-5 py-2.5 border border-gray-300 text-gray-600 text-xs tracking-widest rounded hover:border-gray-400 hover:text-gray-800 disabled:opacity-50 cursor-pointer transition-colors"
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ── Read-only view ── */
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-sm text-gray-500">••••••••••••</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Search by order # or product name"
                        className="w-full md:max-w-xs border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Status
                      </label>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="border border-gray-300 bg-white text-gray-900 px-3 py-2 text-xs rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black cursor-pointer"
                      >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered / Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  {orders
                    .filter((order) => {
                      const term = orderSearch.trim().toLowerCase();
                      if (!term) return true;
                      const orderNumber = (order.order_number || '').toLowerCase();
                      const productNames = (order.items || [])
                        .map((i) => (i.product_name || '').toLowerCase())
                        .join(' ');
                      return orderNumber.includes(term) || productNames.includes(term);
                    })
                    .filter((order) => {
                      if (orderStatusFilter === 'all') return true;
                      const status = (order.status || '').toLowerCase();
                      if (orderStatusFilter === 'delivered') {
                        return status === 'delivered' || status === 'completed';
                      }
                      return status === orderStatusFilter;
                    })
                    .map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-4 sm:p-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order #{order.order_number}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {getDeliveryStatus(order.status)}
                              </span>
                              {(() => {
                                const paymentDisplay = getPaymentMethodDisplay(order.payment_method, order.payment_status);
                                return (
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${paymentDisplay.color}`}
                                  >
                                    {paymentDisplay.text}
                                  </span>
                                );
                              })()}
                            </div>
                            <p className="text-sm text-gray-600">
                              Placed on{' '}
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="flex flex-col sm:items-end gap-2">
                            <p className="text-lg font-semibold text-gray-900">
                              ₹ {order.total.toLocaleString('en-IN')}
                            </p>
                            <button
                              onClick={() => toggleOrderDetails(order.id)}
                              className="text-sm text-brand hover:underline cursor-pointer"
                            >
                              {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Summary */}
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap gap-4">
                          {order.items?.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <div className="relative w-16 h-20 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                {item.productImage ? (
                                  <Image
                                    src={item.productImage}
                                    alt={item.product_name}
                                    fill
                                    quality={60}
                                    loading="lazy"
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 uppercase">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                </p>
                                <p className="text-xs text-gray-900 mt-1">
                                  ₹ {item.subtotal.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <div className="flex items-center justify-center w-16 h-20 bg-gray-50 rounded border border-gray-200">
                              <p className="text-xs text-gray-600">
                                +{order.items.length - 3} more
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expanded Order Details */}
                      {expandedOrder === order.id && (
                        <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Shipping Address */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                Shipping Address
                              </h4>
                              {order.shipping_address && (
                                <div className="text-sm text-gray-600 space-y-1">
                                  <p>{order.shipping_address.full_name}</p>
                                  <p>{order.shipping_address.phone}</p>
                                  <p>{order.shipping_address.address_line1}</p>
                                  {order.shipping_address.address_line2 && (
                                    <p>{order.shipping_address.address_line2}</p>
                                  )}
                                  <p>
                                    {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                    {order.shipping_address.postal_code}
                                  </p>
                                  <p>{order.shipping_address.country}</p>
                                </div>
                              )}
                            </div>

                            {/* Payment Info */}
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                                Payment Information
                              </h4>
                              <div className="text-sm text-gray-600 space-y-2">
                                <div className="flex justify-between">
                                  <span>Payment Method:</span>
                                  <span className="font-medium text-gray-900">
                                    {order.payment_method === 'COD'
                                      ? 'Cash on Delivery'
                                      : 'Online Payment (Razorpay)'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Payment Status:</span>
                                  {(() => {
                                    const paymentDisplay = getPaymentMethodDisplay(order.payment_method, order.payment_status);
                                    return (
                                      <span
                                        className={`px-2 py-1 rounded text-xs font-medium uppercase ${paymentDisplay.color}`}
                                      >
                                        {paymentDisplay.text}
                                      </span>
                                    );
                                  })()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items Details */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                              Order Items
                            </h4>
                            <div className="space-y-4">
                              {order.items?.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                                >
                                  <div className="relative w-20 h-24 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                    {item.productImage ? (
                                      <Image
                                        src={item.productImage}
                                        alt={item.product_name}
                                        fill
                                        quality={60}
                                        loading="lazy"
                                        className="object-cover"
                                        sizes="80px"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 uppercase mb-1">
                                      {item.product_name}
                                    </p>
                                    <p className="text-xs text-gray-600 mb-2">
                                      SKU: {item.product_sku || 'N/A'} {item.size && `• Size: ${item.size}`}
                                    </p>
                                    <div className="flex justify-between items-center">
                                      <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity}
                                      </p>
                                      <p className="text-sm font-medium text-gray-900">
                                        ₹ {item.subtotal.toLocaleString('en-IN')}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                              Order Summary
                            </h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-gray-700">
                                <span>Subtotal</span>
                                <span>₹ {order.subtotal.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-700">
                                <span>Shipping</span>
                                <span className={order.shipping_cost === 0 ? 'text-brand' : ''}>
                                  {order.shipping_cost === 0
                                    ? 'FREE'
                                    : `₹ ${order.shipping_cost.toLocaleString('en-IN')}`}
                                </span>
                              </div>
                              {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-red-600">
                                  <span>Discount</span>
                                  <span>-₹ {order.discount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="border-t border-gray-300 pt-3 mt-3">
                                <div className="flex justify-between text-base font-semibold text-gray-900">
                                  <span>TOTAL</span>
                                  <span>₹ {order.total.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <Link
                              href={`/order-confirmation/${order.id}`}
                              className="px-6 py-3 border border-gray-300 text-gray-700 text-sm tracking-wider hover:border-brand hover:text-brand transition-colors text-center cursor-pointer"
                            >
                              VIEW ORDER
                            </Link>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => {
                                  // TODO: Implement cancel order functionality
                                  showError('Order cancellation feature coming soon');
                                }}
                                className="px-6 py-3 border border-red-300 text-red-600 text-sm tracking-wider hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                              >
                                CANCEL ORDER
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16 sm:py-24">
                  <div className="max-w-md mx-auto">
                    <svg
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                      NO ORDERS YET
                    </h2>
                    <p className="text-sm text-gray-600 mb-8 tracking-wide">
                      You haven&apos;t placed any orders yet. Start shopping to see your orders here.
                    </p>
                    <Link
                      href="/"
                      className="inline-block px-6 py-3 bg-brand text-white text-xs sm:text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
                    >
                      START SHOPPING
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Body Measurements Tab */}
          {activeTab === 'measurements' && (
            <div className="w-full">
              <div className="border border-gray-200 rounded-lg p-6 sm:p-8 lg:p-10">
                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2" style={{ letterSpacing: '-0.02em' }}>
                    YOUR MEASUREMENTS
                  </h2>
                  <p className="text-sm text-gray-600" style={{ lineHeight: '1.6' }}>
                    Save your measurements to get personalized size recommendations on product pages.
                  </p>
                </div>
                <MeasurementForm
                  loadAllCharts={true}
                  showSizeChart={true}
                  submitButtonText="UPDATE MEASUREMENTS"
                />
              </div>
            </div>
          )}

          {/* Wallet Tab */}
          {activeTab === 'wallet' && (
            <div className="max-w-3xl">
              <div className="border border-gray-200 rounded-lg p-6 sm:p-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-1" style={{ letterSpacing: '-0.02em' }}>
                      WALLET BALANCE
                    </h2>
                    <p className="text-sm text-gray-600" style={{ lineHeight: '1.6' }}>
                      Use your Retro Louve wallet to pay faster at checkout.
                    </p>
                  </div>
                  <div className="text-right">
                    {walletLoading ? (
                      <p className="text-sm text-gray-500">Loading...</p>
                    ) : (
                      <p className="text-2xl font-semibold text-gray-900">
                        ₹ {(walletBalance ?? 0).toLocaleString('en-IN')}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{walletCurrency}</p>
                  </div>
                </div>

                {/* Top-up form */}
                <div className="mb-8 border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Add Money to Wallet
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="number"
                      min="100"
                      step="50"
                      value={walletTopupAmount}
                      onChange={(e) => setWalletTopupAmount(e.target.value)}
                      className="input-no-spinner w-full sm:w-48 border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 px-3 py-2.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      placeholder="Amount (min ₹100)"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const raw = walletTopupAmount.trim();
                        const amount = Number(raw);
                        if (!raw || isNaN(amount) || amount <= 0) {
                          showError('Enter a valid amount');
                          return;
                        }
                        if (amount < 100) {
                          showError('Minimum top-up amount is ₹100');
                          return;
                        }
                        try {
                          setWalletTopupLoading(true);
                          if (typeof window === 'undefined') {
                            showError('Payment is only available in the browser.');
                            return;
                          }
                          if (!window.Razorpay) {
                            await new Promise((resolve, reject) => {
                              const script = document.createElement('script');
                              script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                              script.async = true;
                              script.onload = resolve;
                              script.onerror = () => reject(new Error('Failed to load payment gateway'));
                              document.body.appendChild(script);
                            });
                          }

                          const timestamp = Date.now().toString().slice(-10);
                          const userIdShort = user.id.substring(0, 8);
                          const receipt = `RLWALLET_${timestamp}_${userIdShort}`.substring(0, 40);

                          const orderRes = await fetch('/api/razorpay/create-order', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              amount,
                              currency: 'INR',
                              receipt,
                              notes: {
                                user_id: user.id,
                                purpose: 'wallet_topup',
                              },
                            }),
                          });

                          if (!orderRes.ok) {
                            const errorData = await orderRes.json().catch(() => ({}));
                            throw new Error(errorData.error || 'Failed to create wallet top-up order');
                          }

                          const razorpayOrder = await orderRes.json();

                          const paymentData = await new Promise((resolve, reject) => {
                            const options = {
                              key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                              amount: Math.round(amount * 100),
                              currency: 'INR',
                              name: 'Retro Louve Wallet',
                              description: 'Wallet top-up',
                              order_id: razorpayOrder.id,
                              handler: async function (response) {
                                try {
                                  const verifyRes = await fetch('/api/razorpay/verify-payment', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      razorpay_order_id: response.razorpay_order_id,
                                      razorpay_payment_id: response.razorpay_payment_id,
                                      razorpay_signature: response.razorpay_signature,
                                    }),
                                  });
                                  const verifyData = await verifyRes.json();
                                  if (verifyData.verified) {
                                    resolve(verifyData);
                                  } else {
                                    reject(new Error('Payment verification failed'));
                                  }
                                } catch (err) {
                                  reject(err);
                                }
                              },
                              prefill: {
                                name: `${firstName || ''} ${lastName || ''}`.trim() || user.email || '',
                                email: user.email || '',
                                contact: phone || '',
                              },
                              theme: { color: '#000000' },
                              modal: {
                                ondismiss: function () {
                                  reject(new Error('Payment cancelled by user'));
                                },
                              },
                            };
                            const razorpay = new window.Razorpay(options);
                            razorpay.open();
                          });

                          await supabase.rpc('wallet_apply_topup', {
                            p_amount: amount,
                            p_currency: 'INR',
                            p_razorpay_order_id: paymentData.order_id,
                            p_razorpay_payment_id: paymentData.payment_id,
                          });

                          showSuccess('Wallet top-up successful');
                          setWalletTopupAmount('');
                          await loadWallet();
                        } catch (err) {
                          console.error('Wallet top-up error:', err);
                          showError(err.message || 'Wallet top-up failed. Please try again.');
                        } finally {
                          setWalletTopupLoading(false);
                        }
                      }}
                      disabled={walletTopupLoading}
                      className="px-6 py-2.5 bg-black text-white text-xs tracking-widest rounded hover:bg-gray-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      {walletTopupLoading ? 'PROCESSING...' : 'ADD MONEY'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Payments are processed securely via Razorpay. Minimum top-up ₹100.
                  </p>
                  {walletError && <p className="mt-2 text-xs text-red-600">{walletError}</p>}
                </div>

                {/* Recent Transactions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Recent Activity
                  </h3>
                  {walletTransactions.length === 0 ? (
                    <p className="text-sm text-gray-500">No wallet transactions yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {walletTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between text-sm text-gray-700 border-b border-gray-100 pb-2 last:border-b-0"
                        >
                          <div>
                            <p className="font-medium">
                              {tx.type === 'credit' ? 'Added to wallet' : 'Used for order'}
                            </p>
                            {tx.note && (
                              <p className="text-xs text-gray-500">{tx.note}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(tx.created_at).toLocaleString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.type === 'credit' ? '+' : '-'}₹ {Number(tx.amount).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
