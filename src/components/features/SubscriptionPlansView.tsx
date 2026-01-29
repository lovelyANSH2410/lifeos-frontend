import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Crown, Check, Sparkles, Users, Infinity, Loader2, AlertCircle, Zap, X } from 'lucide-react';
import { getUserSubscription, createPaymentOrder, verifyPayment, openRazorpayCheckout } from '@/services/userSubscription.service';
import { useAuth } from '@/contexts/AuthContext';
import type { UserSubscription, SubscriptionPlan, BillingCycle } from '@/types';
import { useScreenSize } from '@/hooks/useScreenSize';
import BottomSheet from '@/components/common/BottomSheet';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanDetails {
  name: SubscriptionPlan;
  title: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  lifetimePrice?: number;
  features: PlanFeature[];
  popular?: boolean;
  icon: React.ReactNode;
  gradient: string;
}

const plans: PlanDetails[] = [
  {
    name: 'FREE',
    title: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { text: '10 Diary Entries', included: true },
      { text: '20 Ideas', included: true },
      { text: '5 Travel Plans', included: true },
      { text: '50 Watch Items', included: true },
      { text: '20 Gift Ideas', included: true },
      { text: '5 Subscriptions', included: true },
      { text: 'Full Money Manager', included: true },
      { text: 'Vault & Documents', included: false },
      { text: 'Shared Features', included: false },
    ],
    icon: <Sparkles className="w-full h-full" />,
    gradient: 'from-gray-500 to-gray-600'
  },
  {
    name: 'PRO',
    title: 'Pro',
    description: 'For power users who want it all',
    monthlyPrice: 199,
    yearlyPrice: 1499,
    features: [
      { text: 'Unlimited Diary Entries', included: true },
      { text: 'Unlimited Ideas', included: true },
      { text: 'Unlimited Travel Plans', included: true },
      { text: 'Unlimited Watch Items', included: true },
      { text: 'Unlimited Gift Ideas', included: true },
      { text: 'Unlimited Subscriptions', included: true },
      { text: 'Full Money Manager', included: true },
      { text: 'Vault & Documents', included: true },
      { text: 'Shared Features', included: false },
    ],
    popular: true,
    icon: <Zap className="w-full h-full" />,
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    name: 'COUPLE',
    title: 'Couple',
    description: 'Perfect for two',
    monthlyPrice: 299,
    yearlyPrice: 2499,
    features: [
      { text: 'Unlimited Diary Entries', included: true },
      { text: 'Unlimited Ideas', included: true },
      { text: 'Unlimited Travel Plans', included: true },
      { text: 'Unlimited Watch Items', included: true },
      { text: 'Unlimited Gift Ideas', included: true },
      { text: 'Unlimited Subscriptions', included: true },
      { text: 'Full Money Manager', included: true },
      { text: 'Vault & Documents', included: true },
      { text: 'Shared Features', included: true },
    ],
    icon: <Users className="w-full h-full" />,
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    name: 'LIFETIME',
    title: 'Lifetime',
    description: 'One-time payment, forever access',
    monthlyPrice: 0,
    yearlyPrice: 0,
    lifetimePrice: 4999,
    features: [
      { text: 'Unlimited Everything', included: true },
      { text: 'All Pro Features', included: true },
      { text: 'All Couple Features', included: true },
      { text: 'Priority Support', included: true },
      { text: 'Early Access to Features', included: true },
      { text: 'No Expiry', included: true },
      { text: 'Best Value', included: true },
    ],
    icon: <Infinity className="w-full h-full" />,
    gradient: 'from-amber-500 to-orange-600'
  }
];

const SubscriptionPlansView: React.FC = () => {
  const { user } = useAuth();
  const screenSize = useScreenSize();
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'MONTHLY' | 'YEARLY' | 'LIFETIME'>('MONTHLY');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isPaymentBannerOpen, setIsPaymentBannerOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserSubscription();
      setUserSubscription(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription');
      console.error('Error fetching subscription:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    if (plan === 'FREE') {
      return; // Can't select FREE
    }

    if (plan === 'LIFETIME') {
      setSelectedBillingCycle('LIFETIME');
    }

    setSelectedPlan(plan);
    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      // Determine billing cycle
      const billingCycle = plan === 'LIFETIME' ? 'NONE' : selectedBillingCycle;

      // Create payment order
      const orderResponse = await createPaymentOrder(plan, billingCycle as 'MONTHLY' | 'YEARLY' | 'NONE');
      const orderData = orderResponse.data;

      // Open Razorpay checkout
      openRazorpayCheckout(
        orderData,
        {
          name: 'LifeOS',
          description: `Upgrade to ${plan} plan${billingCycle !== 'NONE' ? ` (${billingCycle})` : ''}`,
          prefill: {
            email: user?.email || undefined,
            name: user?.name || undefined,
          },
          onSuccess: async (paymentId: string, signature: string) => {
            try {
              setIsProcessingPayment(true);
              // Verify payment
              const verifyResponse = await verifyPayment(
                orderData.orderId,
                paymentId,
                signature,
                plan,
                billingCycle as 'MONTHLY' | 'YEARLY' | 'NONE'
              );

              // Update subscription state
              setUserSubscription(verifyResponse.data.subscription);
              setIsPaymentBannerOpen(false);
              setSelectedPlan(null);
              setIsProcessingPayment(false);
              
              // Show success message (you can add a toast notification here)
              alert('Payment successful! Your subscription has been upgraded.');
            } catch (error: any) {
              console.error('Payment verification error:', error);
              setPaymentError(error.message || 'Payment verification failed');
              setIsProcessingPayment(false);
            }
          },
          onError: (error: string) => {
            setPaymentError(error);
            setIsProcessingPayment(false);
          },
        }
      );
    } catch (error: any) {
      console.error('Payment order creation error:', error);
      setPaymentError(error.message || 'Failed to create payment order');
      setIsProcessingPayment(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCurrentPlan = () => {
    return userSubscription?.plan || 'FREE';
  };

  const isCurrentPlan = (plan: SubscriptionPlan) => {
    return getCurrentPlan() === plan;
  };

  const getSavings = (monthlyPrice: number, yearlyPrice: number) => {
    const monthlyTotal = monthlyPrice * 12;
    const savings = monthlyTotal - yearlyPrice;
    const savingsPercent = Math.round((savings / monthlyTotal) * 100);
    return { savings, savingsPercent };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400" />
        <p className="text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Choose Your Plan</h1>
          <p className={`text-gray-400 ${screenSize === 'mobile' ? 'text-sm' : ''}`}>Unlock the full potential of LifeOS</p>
        </div>
        {userSubscription && userSubscription.plan !== 'FREE' && (
          <div className={`modern-card ${screenSize === 'mobile' ? 'p-3' : 'p-4'} rounded-xl`}>
            <p className={`${screenSize === 'mobile' ? 'text-[10px]' : 'text-xs'} text-gray-400 mb-1`}>Current Plan</p>
            <p className={`${screenSize === 'mobile' ? 'text-base' : 'text-lg'} font-bold text-white`}>{userSubscription.plan}</p>
            {userSubscription.daysRemaining !== null && (
              <p className={`${screenSize === 'mobile' ? 'text-[10px]' : 'text-xs'} text-gray-500 mt-1`}>
                {userSubscription.daysRemaining} days remaining
              </p>
            )}
          </div>
        )}
      </div>

      {/* Billing Cycle Toggle (for non-LIFETIME plans) */}
      <div className="flex items-center justify-center gap-2 p-1 bg-white/5 rounded-xl w-fit mx-auto">
        <button
          onClick={() => setSelectedBillingCycle('MONTHLY')}
          className={`${screenSize === 'mobile' ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-lg ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} font-medium transition-all ${
            selectedBillingCycle === 'MONTHLY'
              ? 'bg-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setSelectedBillingCycle('YEARLY')}
          className={`${screenSize === 'mobile' ? 'px-3 py-1.5' : 'px-4 py-2'} rounded-lg ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} font-medium transition-all ${
            selectedBillingCycle === 'YEARLY'
              ? 'bg-indigo-500 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Yearly
        </button>
      </div>

      {/* Plans Grid */}
      <div className={`grid gap-6 ${
        screenSize === 'mobile' 
          ? 'grid-cols-1' 
          : screenSize === 'tablet' 
          ? 'grid-cols-2' 
          : 'grid-cols-4'
      }`}>
        {plans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.name);
          const isLifetime = plan.name === 'LIFETIME';
          const price = isLifetime 
            ? plan.lifetimePrice || 0
            : selectedBillingCycle === 'YEARLY' 
            ? plan.yearlyPrice 
            : plan.monthlyPrice;
          
          const savings = !isLifetime && selectedBillingCycle === 'YEARLY' 
            ? getSavings(plan.monthlyPrice, plan.yearlyPrice)
            : null;

          return (
            <div
              key={plan.name}
              className={`modern-card ${screenSize === 'mobile' ? 'p-4' : 'p-6'} rounded-2xl relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-indigo-500/50' : ''
              } ${isCurrent ? 'ring-2 ring-green-500/50' : ''}`}
            >
              {plan.popular && (
                <div className={`absolute top-0 right-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white ${screenSize === 'mobile' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'} font-bold rounded-bl-xl`}>
                  POPULAR
                </div>
              )}
              {isCurrent && (
                <div className={`absolute top-0 left-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white ${screenSize === 'mobile' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'} font-bold rounded-br-xl`}>
                  CURRENT
                </div>
              )}

              {/* Plan Icon & Title */}
              <div className={`${screenSize === 'mobile' ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-gradient-to-r ${plan.gradient} flex items-center justify-center text-white ${screenSize === 'mobile' ? 'mb-3' : 'mb-4'}`}>
                <div className={screenSize === 'mobile' ? 'w-5 h-5' : 'w-6 h-6'}>
                  {plan.icon}
                </div>
              </div>
              <h3 className={`${screenSize === 'mobile' ? 'text-xl' : 'text-2xl'} font-bold text-white mb-1`}>{plan.title}</h3>
              <p className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} text-gray-400 ${screenSize === 'mobile' ? 'mb-4' : 'mb-6'}`}>{plan.description}</p>

              {/* Price */}
              <div className={screenSize === 'mobile' ? 'mb-4' : 'mb-6'}>
                {isLifetime ? (
                  <div>
                    <div className={`${screenSize === 'mobile' ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-1`}>
                      {formatPrice(plan.lifetimePrice || 0)}
                    </div>
                    <p className={`${screenSize === 'mobile' ? 'text-[10px]' : 'text-xs'} text-gray-400`}>One-time payment</p>
                  </div>
                ) : (
                  <div>
                    <div className={`${screenSize === 'mobile' ? 'text-2xl' : 'text-3xl'} font-bold text-white mb-1`}>
                      {formatPrice(price)}
                      <span className={`${screenSize === 'mobile' ? 'text-sm' : 'text-lg'} text-gray-400`}>/{selectedBillingCycle === 'YEARLY' ? 'year' : 'month'}</span>
                    </div>
                    {savings && savings.savings > 0 && (
                      <p className={`${screenSize === 'mobile' ? 'text-[10px]' : 'text-xs'} text-green-400 font-medium`}>
                        Save {formatPrice(savings.savings)} ({savings.savingsPercent}%)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className={`${screenSize === 'mobile' ? 'space-y-2' : 'space-y-3'} ${screenSize === 'mobile' ? 'mb-4' : 'mb-6'}`}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    {feature.included ? (
                      <Check className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-green-400 flex-shrink-0 mt-0.5`} />
                    ) : (
                      <div className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} flex-shrink-0 mt-0.5`} />
                    )}
                    <span className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} ${feature.included ? 'text-gray-300' : 'text-gray-500 line-through'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handlePlanSelect(plan.name)}
                disabled={isCurrent || plan.name === 'FREE'}
                className={`w-full ${screenSize === 'mobile' ? 'py-2.5 text-sm' : 'py-3'} rounded-xl font-bold transition-all ${
                  isCurrent
                    ? 'bg-white/10 text-gray-400 cursor-not-allowed'
                    : plan.name === 'FREE'
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg hover:shadow-${plan.gradient.split(' ')[1]}/30`
                }`}
              >
                {isCurrent ? 'Current Plan' : plan.name === 'FREE' ? 'Free Forever' : 'Upgrade Now'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Processing Modal/BottomSheet */}
      {(isProcessingPayment || paymentError) && selectedPlan && (
        screenSize === 'mobile' ? (
          <BottomSheet
            isOpen={isProcessingPayment || !!paymentError}
            onClose={() => {
              if (!isProcessingPayment) {
                setIsPaymentBannerOpen(false);
                setPaymentError(null);
                setSelectedPlan(null);
              }
            }}
            title={paymentError ? "Payment Error" : "Processing Payment"}
            maxHeight="50vh"
          >
            <div className={`${screenSize === 'mobile' ? 'p-4' : 'p-6'} space-y-4`}>
              {isProcessingPayment ? (
                <>
                  <div className={`flex items-center justify-center ${screenSize === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mb-4`}>
                    <Loader2 className={`${screenSize === 'mobile' ? 'w-6 h-6' : 'w-8 h-8'} text-white animate-spin`} />
                  </div>
                  <h3 className={`${screenSize === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-white text-center`}>
                    Opening Payment Gateway
                  </h3>
                  <p className={`text-gray-400 text-center ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                    Please complete the payment in the Razorpay checkout window.
                  </p>
                </>
              ) : paymentError ? (
                <>
                  <div className={`flex items-center justify-center ${screenSize === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-gradient-to-r from-rose-500 to-pink-600 mx-auto mb-4`}>
                    <AlertCircle className={`${screenSize === 'mobile' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
                  </div>
                  <h3 className={`${screenSize === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-white text-center`}>
                    Payment Failed
                  </h3>
                  <p className={`text-gray-400 text-center ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                    {paymentError}
                  </p>
                  <button
                    onClick={() => {
                      setIsPaymentBannerOpen(false);
                      setPaymentError(null);
                      setSelectedPlan(null);
                    }}
                    className={`w-full ${screenSize === 'mobile' ? 'py-2.5 text-sm' : 'py-3'} bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all`}
                  >
                    Close
                  </button>
                </>
              ) : null}
            </div>
          </BottomSheet>
        ) : createPortal(
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
            <div className="bg-[#0F131F] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className={`${screenSize === 'mobile' ? 'p-4' : 'p-6'} space-y-4`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`${screenSize === 'mobile' ? 'text-lg' : 'text-xl'} font-bold text-white`}>
                    {paymentError ? "Payment Error" : "Processing Payment"}
                  </h3>
                  {!isProcessingPayment && (
                    <button
                      onClick={() => {
                        setIsPaymentBannerOpen(false);
                        setPaymentError(null);
                        setSelectedPlan(null);
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <X className={`${screenSize === 'mobile' ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400`} />
                    </button>
                  )}
                </div>
                {isProcessingPayment ? (
                  <>
                    <div className={`flex items-center justify-center ${screenSize === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto mb-4`}>
                      <Loader2 className={`${screenSize === 'mobile' ? 'w-6 h-6' : 'w-8 h-8'} text-white animate-spin`} />
                    </div>
                    <p className={`text-gray-400 text-center ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                      Please complete the payment in the Razorpay checkout window.
                    </p>
                  </>
                ) : paymentError ? (
                  <>
                    <div className={`flex items-center justify-center ${screenSize === 'mobile' ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-gradient-to-r from-rose-500 to-pink-600 mx-auto mb-4`}>
                      <AlertCircle className={`${screenSize === 'mobile' ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
                    </div>
                    <p className={`text-gray-400 text-center ${screenSize === 'mobile' ? 'text-xs' : 'text-sm'}`}>
                      {paymentError}
                    </p>
                    <button
                      onClick={() => {
                        setIsPaymentBannerOpen(false);
                        setPaymentError(null);
                        setSelectedPlan(null);
                      }}
                      className={`w-full ${screenSize === 'mobile' ? 'py-2.5 text-sm' : 'py-3'} bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all`}
                    >
                      Close
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
};

export default SubscriptionPlansView;
