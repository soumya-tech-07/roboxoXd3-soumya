'use client';

import Link from 'next/link';

export default function ExchangePolicyPage() {
  const policySections = [
    {
      title: 'Return Policy',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      content: [
        {
          heading: 'Return Window',
          text: 'Returns are accepted within 7 days of delivery date. After 7 days from delivery, the order is no longer eligible for return.',
        },
        {
          heading: 'Return Conditions',
          text: 'To qualify for a return, products must be:',
          list: [
            'Unused and unwashed',
            'In original condition with all tags attached',
            'In original packaging (if applicable)',
            'Not purchased during a sale or promotional period',
          ],
        },
        {
          heading: 'Non-Returnable Items',
          text: 'For hygiene and safety reasons, the following items cannot be returned or exchanged:',
          list: [
            'Caps and Hats',
            'Masks',
            'Boxers',
            'Shorts',
            'Bodysuits',
            'Crop Tops',
            'Tank Tops',
            'Baby Tees',
            'Stickers & Stationery',
          ],
        },
        {
          heading: 'Sale Items',
          text: 'All discounted, promotional, and sale items are final sale and not eligible for returns or exchanges.',
        },
      ],
    },
    {
      title: 'Exchange Policy',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      content: [
        {
          heading: 'Exchange Window',
          text: 'Exchanges are accepted within 7 days of delivery date. After 7 days from delivery, the order is no longer eligible for exchange.',
        },
        {
          heading: 'Exchange Process',
          text: 'To exchange an item:',
          list: [
            'Select a different size of the same product',
            'Ensure the new item is in stock',
            'Pay any price difference if the new item costs more',
            'Receive balance as Louve Cash if the new item costs less',
          ],
        },
        {
          heading: 'Exchange Fee',
          text: 'A ₹100 pickup charge applies per order for exchanges (COD orders).',
        },
        {
          heading: 'Price Differences',
          text: 'If the exchanged item costs more, you will need to pay the difference. If it costs less, the balance will be credited as Louve Cash in your Retro Louve Wallet.',
        },
      ],
    },
    {
      title: 'How to Initiate Return/Exchange',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      content: [
        {
          heading: 'Step-by-Step Process',
          list: [
            'Log in to your Retro Louve account',
            'Go to "My Orders" section',
            'Select the order you want to return/exchange',
            'Click on "Return" or "Exchange" button',
            'Fill out the return/exchange request form',
            'Our team will review your request within 48-72 hours',
          ],
        },
        {
          heading: 'Pickup Process',
          text: 'Once your request is approved, we will arrange a reverse pickup. Please pack the item in its original condition and packaging.',
        },
        {
          heading: 'Alternative Method',
          text: (
            <>
              You can also place a return/exchange request directly from our{' '}
              <Link href="/exchange-return" className="underline text-brand hover:text-brand/80">
                Exchange/Return Request page
              </Link>
              .
            </>
          ),
        },
      ],
    },
    {
      title: 'Fees & Charges',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: [
        {
          heading: 'Pickup Fee',
          text: 'A ₹100 pickup fee applies per order for returns and exchanges.',
        },
        {
          heading: 'Shipping Charges',
          text: 'Original shipping charges and COD charges (if applicable) are non-refundable.',
        },
        {
          heading: 'Refund Method',
          text: 'All refunds are issued as Louve Cash in your Retro Louve Wallet, processed within 1-2 business days after pickup.',
        },
      ],
    },
    {
      title: 'Damaged or Wrong Items',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      content: [
        {
          heading: 'What to Do',
          text: 'If you received a damaged or wrong item, please contact us as soon as possible with your order number and a description of the issue.',
        },
        {
          heading: 'How to Report',
          list: [
            'Go to the Exchange/Return Request page or contact us via the Contact page',
            'Provide your order number and a clear description of the damage or wrong item',
            'Our team will review and respond within 48-72 hours',
          ],
        },
        {
          heading: 'Processing Time',
          text: 'Damaged or wrong item claims are processed within 48-72 hours after we receive your request.',
        },
      ],
    },
    {
      title: 'Tracking Your Return/Exchange',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: [
        {
          heading: 'Status Updates',
          text: 'You will receive WhatsApp updates with tracking links once your return/exchange is in transit.',
        },
        {
          heading: 'Check Status',
          text: 'You can check the status of your return/exchange request in the "My Orders" section of your account.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-32 sm:pt-40 lg:pt-60 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-6 mb-6">
            <h3 className="text-xs text-black sm:text-sm tracking-[0.3em] uppercase font-light whitespace-nowrap">
              POLICY
            </h3>
            <div className="flex-1 h-px bg-black" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-black font-serif tracking-tight mb-4">
            Exchange/Returns Policy
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            Our comprehensive policy on returns, exchanges, and refunds. 
            Please read carefully before initiating a return or exchange request.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {policySections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-200">
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-semibold tracking-wide flex items-center gap-3 text-gray-900">
                  <span className="text-gray-700 flex items-center">
                    {section.icon}
                  </span>
                  {section.title}
                </h2>
              </div>

              {/* Section Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {section.content.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    {item.heading && (
                      <h3 className="text-base font-semibold text-gray-900 mb-2">
                        {item.heading}
                      </h3>
                    )}
                    {item.text && (
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                        {typeof item.text === 'string' ? item.text : item.text}
                      </p>
                    )}
                    {item.list && (
                      <ul className="list-disc list-inside space-y-2 ml-2 text-sm sm:text-base text-gray-700">
                        {item.list.map((listItem, listIndex) => (
                          <li key={listIndex}>{listItem}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-12 p-6 sm:p-8 bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            Important Reminders
          </h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Returns and exchanges are allowed only within 7 days of delivery.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>All products must be unused, unwashed, and with tags attached for returns/exchanges.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Sale items are final sale and cannot be returned or exchanged.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>Refunds are issued as Louve Cash in your Retro Louve Wallet only.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold">•</span>
              <span>A ₹100 pickup fee applies per order.</span>
            </li>
          </ul>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center bg-gray-50 border border-gray-200 p-8 sm:p-12">
          <h3 className="text-xl sm:text-2xl text-black font-semibold mb-3">Ready to Place a Request?</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            If you&apos;re ready to initiate a return or exchange, click below to get started.
          </p>
          <Link
            href="/exchange-return"
            className="inline-block px-8 py-3 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
          >
            PLACE AN EXCHANGE/RETURN REQUEST
          </Link>
        </div>

        {/* Contact Section */}
        {/* <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Have questions about our policy?{' '}
            <Link href="/contact" className="underline text-brand hover:text-brand/80">
              Contact us
            </Link>
            {' '}or email{' '}
            <a href="mailto:orders.retrolouve@gmail.com" className="underline text-brand hover:text-brand/80">
              orders.retrolouve@gmail.com
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}

