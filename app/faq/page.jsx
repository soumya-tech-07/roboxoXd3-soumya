'use client';

import Link from 'next/link';
import { useState } from 'react';

// Icon Components
const PackageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h5V8h-5m0 8H8m5 0v-4m0 4h.01M9 12h6m-6-4h6m2 5a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CreditCardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const CancelIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const WarningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const GiftIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function FAQPage() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const faqData = [
    {
      category: 'Before You Order',
      icon: PackageIcon,
      questions: [
        {
          q: 'How do I find my perfect size?',
          a: (
            <div className="space-y-2">
              <p>Finding your perfect size is easy:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Check the size chart on every product page</li>
                <li>Use our Smart Size Suggestion Tool</li>
                <li>For personalised help, email: <a href="mailto:xxx@gmail.com" className="underline">xxx@gmail.com</a></li>
              </ul>
            </div>
          ),
        },
        {
          q: 'Will the product colour look exactly like the image?',
          a: 'Product colours may vary slightly due to lighting and display settings. We do our best to represent accurate colours, but slight variations are normal.',
        },
        {
          q: 'Why do I need to record an unboxing video?',
          a: (
            <div className="space-y-2">
              <p>Please record a full unboxing video before opening the package. It is mandatory for:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Damage claims</li>
                <li>Missing items</li>
                <li>Incorrect products</li>
              </ul>
              <p className="font-semibold text-red-600 mt-2">No video = no claim.</p>
            </div>
          ),
        },
      ],
    },
    {
      category: 'Order Process & Delivery',
      icon: TruckIcon,
      questions: [
        {
          q: 'What happens after I place an order?',
          a: (
            <div className="space-y-2">
              <p>After placing an order, you receive:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Email confirmation</li>
                <li>WhatsApp confirmation</li>
                <li>Order ID & details</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'How long does shipping take?',
          a: (
            <div className="space-y-2">
              <p>Shipping timelines:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Metro cities: 5–8 business days</li>
                <li>Other locations: 7–12 business days</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'How do I track my order?',
          a: 'You will receive a WhatsApp message with the tracking link once your order is dispatched.',
        },
        {
          q: 'What about preorder items?',
          a: 'Preorder items are shipped on/around the date mentioned on the product page. We will notify you if delays occur.',
        },
        {
          q: 'What if my prepaid order is not delivered?',
          a: 'If the courier cannot deliver after multiple attempts, the order returns to us and you receive a Louve Cash refund in your Retro Louve Wallet.',
        },
      ],
    },
    {
      category: 'Payment Options',
      icon: CreditCardIcon,
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: (
            <div className="space-y-2">
              <p>We accept:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Debit/Credit Cards</li>
                <li>Net Banking</li>
                <li>UPI</li>
                <li>Wallets</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'Is online payment safe?',
          a: 'Yes — all transactions are processed securely with encrypted payment gateways.',
        },
        {
          q: 'Why is COD not showing for my address?',
          a: (
            <div className="space-y-2">
              <p>COD may not be available for certain PIN codes. Try:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Using a nearby address</li>
                <li>Selecting a prepaid payment mode</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'My payment failed but money was deducted. What now?',
          a: 'If money was deducted but the order was not created, your bank usually reverses the amount within 10 business days.',
        },
      ],
    },
    {
      category: 'Cancellation Policy',
      icon: CancelIcon,
      questions: [
        {
          q: 'Can I cancel my order?',
          a: 'Yes — you can cancel only before the order is dispatched.',
        },
        {
          q: 'How will I get my refund for cancelled orders?',
          a: 'Refunds for prepaid cancellations are issued as Louve Cash in your Retro Louve Wallet.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      icon: RefreshIcon,
      questions: [
        {
          q: 'What is your return policy?',
          a: (
            <div className="space-y-2">
              <p>To qualify for a return or exchange:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Return requested within 15 days of delivery</li>
                <li>Products are unused, unwashed, undamaged</li>
                <li>Tags are attached</li>
                <li>Not purchased during a sale</li>
                <li>Unboxing video available (for issues)</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'Which items cannot be returned?',
          a: (
            <div className="space-y-2">
              <p>For hygiene & safety, the following cannot be returned/exchanged:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 columns-2">
                <li>Caps</li>
                <li>Hats</li>
                <li>Masks</li>
                <li>Boxers</li>
                <li>Shorts</li>
                <li>Bodysuits</li>
                <li>Crop Tops</li>
                <li>Tank Tops</li>
                <li>Baby Tees</li>
                <li>Stickers & stationery</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'How do I initiate a return or exchange?',
          a: (
            <div className="space-y-2">
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Log in to your Retro Louve account</li>
                <li>Open My Orders</li>
                <li>Select the order</li>
                <li>Click Return / Exchange</li>
                <li>Our team reviews your request within 48–72 hours</li>
              </ol>
              <p className="mt-3"><span className="font-semibold">Pickup Process:</span> Reverse pickup is arranged once your request is approved. Pack the item in original condition.</p>
            </div>
          ),
        },
        {
          q: 'Are there any fees for returns?',
          a: 'A ₹100 pickup fee applies per order. Shipping/COD charges are non-refundable.',
        },
        {
          q: 'How will I receive my refund?',
          a: 'Refunds are issued only as Louve Cash in your Retro Louve Wallet, processed within 1–2 business days after pickup.',
        },
        {
          q: 'What is your exchange policy?',
          a: (
            <div className="space-y-2">
              <p><span className="font-semibold">Exchange Window:</span> Accepted within 15 days of delivery</p>
              <p><span className="font-semibold">Exchange Fee (COD orders):</span> ₹100 pickup charge</p>
              <p><span className="font-semibold">Price Differences:</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>If new item costs more → pay the difference</li>
                <li>If it costs less → balance credited as Louve Cash</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'Can I return sale items?',
          a: 'All discounted, promotional and sale items are final sale. They are not eligible for returns or exchanges.',
        },
      ],
    },
    {
      category: 'Damaged or Wrong Items',
      icon: WarningIcon,
      questions: [
        {
          q: 'I received a damaged or wrong item. What should I do?',
          a: (
            <div className="space-y-2">
              <p>To process your request smoothly:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Record a clear unboxing video</li>
                <li>Email it to <a href="mailto:xxx@gmail.com" className="underline">xxx@gmail.com</a> within 24 hours of delivery</li>
              </ul>
              <p className="font-semibold text-red-600 mt-2">Claims without video cannot be accepted.</p>
            </div>
          ),
        },
        {
          q: 'How do I track my return/exchange?',
          a: 'Once your return/exchange is in transit, you receive a WhatsApp update with a tracking link.',
        },
      ],
    },
    {
      category: 'Gifting & Special Requests',
      icon: GiftIcon,
      questions: [
        {
          q: 'Can I remove tags for gifting?',
          a: 'No — tags must remain attached for return eligibility.',
        },
        {
          q: 'Can I add a gift note?',
          a: (
            <div className="space-y-2">
              <p>Yes! You can:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Email your note (max 250 characters) to <a href="mailto:xxx@gmail.com" className="underline">xxx@gmail.com</a></li>
                <li>Call us immediately after placing the order</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      category: 'Account & Support',
      icon: UserIcon,
      questions: [
        {
          q: 'I forgot my password. What should I do?',
          a: 'Click "Forgot Password" on the login page to reset it.',
        },
        {
          q: 'How do I unsubscribe from marketing emails?',
          a: 'You will automatically receive our updates. You can unsubscribe anytime using the link in the email.',
        },
        {
          q: 'Do you accept bulk or custom orders?',
          a: (
            <p>
              Yes! We accept bulk and custom orders. Email details to{' '}
              <a href="mailto:xxx@gmail.com" className="underline">xxx@gmail.com</a>
            </p>
          ),
        },
      ],
    },
    {
      category: 'Privacy & Security',
      icon: LockIcon,
      questions: [
        {
          q: 'What information do you collect?',
          a: (
            <div className="space-y-2">
              <p>We collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Name, email, phone</li>
                <li>Address</li>
                <li>Payment information</li>
                <li>Device & browsing data</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'How do you use my information?',
          a: (
            <div className="space-y-2">
              <p>We use this to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process and deliver orders</li>
                <li>Improve website experience</li>
                <li>Send updates/offers (with your consent)</li>
              </ul>
            </div>
          ),
        },
        {
          q: 'Do you sell my data?',
          a: 'No. We do NOT sell your data or share it unnecessarily. We only share with courier partners, payment processors, and technical service providers.',
        },
        {
          q: 'How can I access or delete my data?',
          a: (
            <p>
              To update, access or delete your data, email:{' '}
              <a href="mailto:orders.retrolouve@gmail.com" className="underline">orders.retrolouve@gmail.com</a>
            </p>
          ),
        },
        {
          q: 'Is my information secure?',
          a: 'Yes. We use secure, encrypted systems to protect your information.',
        },
      ],
    },
    {
      category: 'Contact Us',
      icon: EmailIcon,
      questions: [
        {
          q: 'How can I contact customer support?',
          a: (
            <div className="space-y-2">
              <p>For any help or queries:</p>
              <p className="flex items-center gap-2">
                <EmailIcon />
                <a href="mailto:retrolouve@gmail.com" className="underline font-semibold">retrolouve@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <EmailIcon />
                <span>Orders & data requests: <a href="mailto:orders.retrolouve@gmail.com" className="underline font-semibold">orders.retrolouve@gmail.com</a></span>
              </p>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen text-black pt-32 sm:pt-40 lg:pt-60 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-xs sm:text-sm tracking-[0.3em] uppercase font-light whitespace-nowrap">
              F A Q s
            </h3>
            <div className="flex-1 h-px bg-black" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            Everything you need to know about ordering, shipping, returns, and more.
            Can&apos;t find what you&apos;re looking for? Contact us at{' '}
            <a href="mailto:retrolouve@gmail.com" className="underline">retrolouve@gmail.com</a>
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">


          {/* Exchange/Returns Policy Card */}
          <Link
            href="/exchange-policy"
            className="group border-2 border-gray-900 p-6 hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold tracking-wide mb-2 uppercase">
                  Exchange/Returns Policy
                </h3>
                <p className="text-xs opacity-80">
                  Read our complete exchange and return policy
                </p>
              </div>
              <svg className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-6">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200">
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-semibold tracking-wide flex items-center gap-3 text-gray-900">
                  {section.icon && (
                    <span className="text-gray-700 flex items-center">
                      {(() => {
                        const IconComponent = section.icon;
                        return <IconComponent />;
                      })()}
                    </span>
                  )}
                  {section.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-200">
                {section.questions.map((item, qIndex) => {
                  const uniqueIndex = `${sectionIndex}-${qIndex}`;
                  const isOpen = openSection === uniqueIndex;

                  return (
                    <div key={qIndex}>
                      <button
                        onClick={() => toggleSection(uniqueIndex)}
                        className="w-full px-6 py-4 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors group cursor-pointer"
                      >
                        <span className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-black">
                          {item.q}
                        </span>
                        <svg
                          className={`shrink-0 w-5 h-5 text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Answer */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                      >
                        <div className="px-6 pb-5 text-sm sm:text-base text-gray-900 leading-relaxed">
                          {typeof item.a === 'string' ? <p>{item.a}</p> : item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gray-50 border border-gray-200 p-8 sm:p-12">
          <h3 className="text-xl sm:text-2xl font-semibold mb-3">Still have questions?</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Our customer care team is here to help. Reach out and we&apos;ll respond within 24–48 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-colors cursor-pointer"
          >
            CONTACT US
          </Link>
        </div>
      </div>
    </div>
  );
}