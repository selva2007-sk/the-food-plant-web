import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Truck, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { Order } from '../types';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'shipping': return <Truck className="w-5 h-5 text-amber-500" />;
      case 'delivered': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Package className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'shipping': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">Order History</h2>
                <p className="text-sm text-slate-500">Track your gourmet deliveries</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {!user?.orders || user.orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                  <p className="text-slate-500 max-w-[240px]">
                    When you place an order, it will appear here for tracking.
                  </p>
                </div>
              ) : (
                user.orders.map((order) => (
                  <div key={order.id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-5 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order ID</p>
                        <p className="text-sm font-bold text-slate-900">{order.id}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>

                    <div className="p-5 space-y-6">
                      {/* Tracking Steps */}
                      <div className="relative flex justify-between">
                        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-100 z-0" />
                        {order.trackingSteps.map((step, index) => (
                          <div key={index} className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                              step.isCompleted ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-slate-200 text-slate-300'
                            }`}>
                              {step.status === 'confirmed' && <Clock className="w-4 h-4" />}
                              {step.status === 'shipping' && <Truck className="w-4 h-4" />}
                              {step.status === 'delivered' && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <p className={`text-[10px] mt-2 font-bold text-center max-w-[60px] ${step.isCompleted ? 'text-brand-600' : 'text-slate-400'}`}>
                              {step.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Order Items Summary */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Items</p>
                        <div className="flex -space-x-3 overflow-hidden">
                          {order.items.map((item, i) => (
                            <img 
                              key={i} 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                            />
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                          <p className="text-lg font-bold text-brand-700">${order.total.toFixed(2)}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
              >
                Back to Shopping
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OrderHistory;
