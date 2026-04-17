import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Mail, Phone, MapPin, Bell, Shield, Smartphone, MessageSquare } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, updateProfile, showToast } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editStreet, setEditStreet] = useState(user?.address?.street || '');
  const [editCity, setEditCity] = useState(user?.address?.city || '');
  const [editZip, setEditZip] = useState(user?.address?.zip || '');

  if (!user) return null;

  const handleSaveProfile = () => {
    updateProfile({
      name: editName,
      phone: editPhone
    });
    setIsEditingProfile(false);
    showToast('Profile Updated', 'success');
  };

  const handleSaveAddress = () => {
    updateProfile({
      address: {
        street: editStreet,
        city: editCity,
        zip: editZip
      }
    });
    setIsEditingAddress(false);
    showToast('Address Updated', 'success');
  };

  const handleNotificationToggle = (key: keyof typeof user.notifications) => {
    updateProfile({
      notifications: {
        ...user.notifications,
        [key]: !user.notifications[key]
      }
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white z-101 shadow-2xl flex flex-col"
          >
            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <img src={user.avatar} alt={user.name} className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl shadow-lg" />
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">{user.name}</h2>
                  <p className="text-xs sm:text-sm text-slate-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'profile' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'notifications' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Notifications
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex-1 py-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'security' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Security
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personal Information</h3>
                      <button 
                        onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        {isEditingProfile ? 'Save' : 'Edit'}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <User className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Full Name</p>
                          {isEditingProfile ? (
                            <input 
                              type="text" 
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-transparent border-b border-brand-200 focus:outline-none text-sm font-bold text-slate-900"
                            />
                          ) : (
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 opacity-60">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                          <p className="text-sm font-bold text-slate-900">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                          {isEditingProfile ? (
                            <input 
                              type="tel" 
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              placeholder="Enter phone number"
                              className="w-full bg-transparent border-b border-brand-200 focus:outline-none text-sm font-bold text-slate-900"
                            />
                          ) : (
                            <p className="text-sm font-bold text-slate-900">{user.phone || 'Not provided'}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Delivery Address</h3>
                      <button 
                        onClick={() => isEditingAddress ? handleSaveAddress() : setIsEditingAddress(true)}
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        {isEditingAddress ? 'Save' : 'Edit'}
                      </button>
                    </div>
                    <div className="p-6 bg-brand-50/50 rounded-3xl border border-brand-100">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-6 h-6 text-brand-600 mt-1" />
                        <div className="flex-1 space-y-3">
                          {isEditingAddress ? (
                            <div className="space-y-3">
                              <input 
                                type="text" 
                                value={editStreet}
                                onChange={(e) => setEditStreet(e.target.value)}
                                placeholder="Street Address"
                                className="w-full bg-white px-3 py-2 rounded-lg border border-brand-200 focus:outline-none text-sm font-bold text-slate-900"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input 
                                  type="text" 
                                  value={editCity}
                                  onChange={(e) => setEditCity(e.target.value)}
                                  placeholder="City"
                                  className="w-full bg-white px-3 py-2 rounded-lg border border-brand-200 focus:outline-none text-sm font-bold text-slate-900"
                                />
                                <input 
                                  type="text" 
                                  value={editZip}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditZip(e.target.value)}
                                  placeholder="Zip Code"
                                  className="w-full bg-white px-3 py-2 rounded-lg border border-brand-200 focus:outline-none text-sm font-bold text-slate-900"
                                />
                              </div>
                            </div>
                          ) : user.address ? (
                            <>
                              <p className="text-lg font-bold text-slate-900">{user.address.street}</p>
                              <p className="text-slate-500">{user.address.city}, {user.address.zip}</p>
                            </>
                          ) : (
                            <p className="text-slate-500 italic">No address saved yet.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Notification Channels</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <Smartphone className="w-6 h-6 text-brand-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">Push Notifications</p>
                            <p className="text-xs text-slate-500">Receive alerts on your device</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleNotificationToggle('push')}
                          className={`w-14 h-8 rounded-full transition-all relative ${user.notifications.push ? 'bg-brand-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${user.notifications.push ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <MessageSquare className="w-6 h-6 text-brand-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">SMS Alerts</p>
                            <p className="text-xs text-slate-500">Get status updates via text</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleNotificationToggle('sms')}
                          className={`w-14 h-8 rounded-full transition-all relative ${user.notifications.sms ? 'bg-brand-600' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${user.notifications.sms ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Alert Preferences</h3>
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={user.notifications.orderUpdates}
                          onChange={() => handleNotificationToggle('orderUpdates')}
                          className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" 
                        />
                        <div>
                          <p className="font-bold text-slate-900">Order Status Updates</p>
                          <p className="text-xs text-slate-500">Confirmed, Shipping, Delivered</p>
                        </div>
                      </label>
                      <label className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={user.notifications.promotions}
                          onChange={() => handleNotificationToggle('promotions')}
                          className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500" 
                        />
                        <div>
                          <p className="font-bold text-slate-900">Promotions & Offers</p>
                          <p className="text-xs text-slate-500">Exclusive discounts and news</p>
                        </div>
                      </label>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <section>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Security Settings</h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-slate-100 transition-all">
                        <div className="flex items-center gap-4">
                          <Shield className="w-6 h-6 text-slate-400" />
                          <div className="text-left">
                            <p className="font-bold text-slate-900">Change Password</p>
                            <p className="text-xs text-slate-500">Update your account password</p>
                          </div>
                        </div>
                        <X className="w-5 h-5 text-slate-300 rotate-45" />
                      </button>
                      <button className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-slate-100 transition-all text-red-600">
                        <div className="flex items-center gap-4">
                          <Shield className="w-6 h-6 text-red-400" />
                          <div className="text-left">
                            <p className="font-bold">Delete Account</p>
                            <p className="text-xs text-red-400 opacity-70">Permanently remove your data</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={onClose}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
