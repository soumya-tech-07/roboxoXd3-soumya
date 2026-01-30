import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100">

      {/* Bottom Bar */}
      <div className="bg-brand text-white">
        <div className="mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-[10px] tracking-wider">
            <span>CONNECT</span>
            <div className="flex gap-4 sm:gap-8 items-center">
              <Link
                href="mailto:retrolouve@gmail.com"
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <Mail size={16} />
                <span>EMAIL</span>
              </Link>
              <Link
                href="https://www.instagram.com/retrolouve?igsh=MTlsZDB2emlkMnllcA%3D%3D"
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} />
                <span>INSTAGRAM</span>
              </Link>
              {/* <Link 
                href="https://youtube.com" 
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Youtube size={16} />
                <span>YOUTUBE</span>
              </Link>
              <Link 
                href="mailto:orders.retrolouve@gmail.com" 
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <Mail size={16} />
                <span>EMAIL</span>
              </Link>
              <Link 
                href="tel:+911234567890" 
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <Phone size={16} />
                <span>PHONE</span>
              </Link> */}
            </div>
          </div>
        </div>
      </div>



      {/* Main Footer Content */}
      <div className="mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Logo and Copyright */}
          <div className='md:col-span-2 flex flex-col justify-between'>
            <div className="relative h-32 w-auto mb-4 sm:mb-8">
              <Image
                src="/images/4.png"
                alt="Retro Louve"
                width={200}
                height={200}
                className="h-full w-auto object-contain"
              />
            </div>
            <p className="text-[10px] text-gray-600">
              © 2026 RETRO LOUVE RETAIL PRIVATE LIMITED, ALL RIGHTS RESERVED.
            </p>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-[10px] font-semibold mb-4 text-black tracking-wider">HELP</h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/exchange-return" className="hover:underline uppercase">
                  Place an Exchange/Return Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-[10px] font-semibold mb-4 text-black tracking-wider">COMPANY</h3>
            <ul className="space-y-2 text-xs text-gray-700">
              {/* <li>
                <Link href="/story" className="hover:underline">
                  STORY
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  CONTACT US
                </Link>
              </li> */}
              <li>
                <Link href="/blog" className="hover:underline">
                  BLOGS
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>


      {/* Popular Searches Section */}
      {/* <div className="bg-gray-100 border-t border-gray-200">
        <div className="mx-auto px-4 sm:px-8 md:px-16 py-6 sm:py-8">
          <h3 className="text-black text-[10px] font-semibold mb-3 sm:mb-4 tracking-wider">POPULAR SEARCHES</h3>
           */}
      {/* Shop by Category */}
      {/* <div className="mb-6">
            <h4 className="text-[10px] font-medium mb-2 text-gray-600">SHOP BY CATEGORY</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <Link href="#" className="hover:underline">OVERSIZED T-SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> JOGGERS</Link>, 
              <Link href="#" className="hover:underline"> ACID WASH T-SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> DESIGNER SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> CASUAL JACKETS</Link>, 
              <Link href="#" className="hover:underline"> BLACK HOODIES</Link>, 
              <Link href="#" className="hover:underline"> PRINTED SWEATSHIRTS</Link>
            </p>
          </div> */}

      {/* Shop by Style */}
      {/* <div className="mb-6">
            <h4 className="text-[10px] font-medium mb-2 text-gray-600">SHOP BY STYLE</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <Link href="#" className="hover:underline">PRINTED SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> CHECKED SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> CASUAL SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> FULL-SLEEVE SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> HALF-SLEEVE SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> CREW NECK T-SHIRT</Link>, 
              <Link href="#" className="hover:underline"> PRINTED T-SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> QUOTES T-SHIRTS</Link>
            </p>
          </div> */}

      {/* Shop by Color */}
      {/* <div>
            <h4 className="text-[10px] font-medium mb-2 text-gray-600">SHOP BY COLOR</h4>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <Link href="#" className="hover:underline">BLACK T-SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> WHITE T-SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> BLUE T-SHIRTS</Link>, 
              <Link href="#" className="hover:underline"> RED T-SHIRTS</Link>
            </p>
          </div>
        </div> 
      </div> */}
    </footer>
  );
}