// import { useState } from 'react';
// import { NavLink, Outlet } from 'react-router-dom';
// import { FiMenu, FiX } from 'react-icons/fi';
// import { MdDashboard } from 'react-icons/md';
// import { FaBoxes } from 'react-icons/fa';
// import { AiOutlinePlusCircle } from 'react-icons/ai';
// import { FaShoppingCart } from 'react-icons/fa';
// import { FaShoppingBag } from 'react-icons/fa';
// import { MdMoneyOff } from 'react-icons/md';

// export default function Layout() {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
//   const closeMobileMenu = () => setMobileMenuOpen(false);

//   // Navigation items data (same as before)

//   const navItems = [
//     {
//       to: '/',
//       icon: MdDashboard,
//       label: 'Dashboard',
//     },
//     {
//       to: '/medicine',
//       icon: FaBoxes,
//       label: 'Stock',
//     },
//     {
//       to: '/items',
//       icon: AiOutlinePlusCircle,
//       label: 'Items',
//     },
//     {
//       to: '/purchase',
//       icon: FaShoppingCart,
//       label: 'Purchase',
//     },
//     {
//       to: '/sale',
//       icon: FaShoppingBag,
//       label: 'Sale',
//     },
//     {
//       to: '/expense',
//       icon: MdMoneyOff,
//       label: 'Expense',
//     },
//   ];
//   return (
//     <div className='flex h-screen w-screen flex-col bg-gradient-to-br from-slate-50 to-gray-100 font-sans antialiased overflow-hidden'>
//       {/* Header */}
//       <header className='sticky top-0 z-20 flex h-16 items-center bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 text-gray-800 shadow-sm'>
//         <div className='flex w-full items-center justify-between'>
//           <div className='flex items-center space-x-3'>
//             {/* Mobile menu button */}
//             <button
//               onClick={toggleMobileMenu}
//               className='lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600'
//               aria-label='Toggle menu'
//             >
//               <FiMenu className='h-6 w-6' />
//             </button>
//             <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md'>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 className='h-6 w-6'
//                 fill='none'
//                 viewBox='0 0 24 24'
//                 stroke='currentColor'
//                 strokeWidth={2}
//               >
//                 <path
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                   d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
//                 />
//               </svg>
//             </div>
//             <h1 className='text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
//               MediTrack
//             </h1>
//           </div>
//           <div className='flex items-center space-x-3'>
//             <span className='hidden text-sm text-gray-600 md:inline-block'>
//               Admin User
//             </span>
//             <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-sm'>
//               <svg
//                 xmlns='http://www.w3.org/2000/svg'
//                 className='h-5 w-5'
//                 fill='none'
//                 viewBox='0 0 24 24'
//                 stroke='currentColor'
//               >
//                 <path
//                   strokeLinecap='round'
//                   strokeLinejoin='round'
//                   d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main container – sidebar + content */}
//       <div className='flex flex-1 overflow-hidden relative'>
//         {/* Sidebar for desktop */}
//         <aside className='hidden  lg:block w-64 overflow-y-auto bg-white/90 backdrop-blur-sm border-r border-gray-200/60 shadow-lg sidebar-scroll'>
//           <nav className='p-4'>
//             <ul className='space-y-1'>
//               {navItems.map((item) => {
//                 const Icon = item.icon;

//                 return (
//                   <li key={item.to}>
//                     <NavLink
//                       to={item.to}
//                       end={item.to === '/'}
//                       onClick={closeMobileMenu}
//                       className={({ isActive }) =>
//                         `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
//                           isActive
//                             ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
//                             : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
//                         }`
//                       }
//                     >
//                       {({ isActive }) => (
//                         <>
//                           <Icon className='mr-3 h-5 w-5' />
//                           {item.label}
//                           {isActive && (
//                             <span className='ml-auto h-2 w-2 rounded-full bg-indigo-500'></span>
//                           )}
//                         </>
//                       )}
//                     </NavLink>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>
//         </aside>

//         {/* Mobile menu overlay */}
//         {mobileMenuOpen && (
//           <>
//             {/* Backdrop */}
//             <div
//               className='fixed inset-0 bg-black/50 z-30 lg:hidden'
//               onClick={closeMobileMenu}
//             />
//             {/* Slide‑in sidebar */}
//             <aside className='fixed top-0 left-0 h-full w-64 z-40 bg-white/95 backdrop-blur-sm shadow-2xl overflow-y-auto sidebar-scroll lg:hidden animate-slide-in'>
//               <div className='flex items-center justify-between p-4 border-b border-gray-100'>
//                 <span className='font-semibold text-gray-700'>Menu</span>
//                 <button
//                   onClick={closeMobileMenu}
//                   className='p-1 rounded-lg hover:bg-gray-100'
//                 >
//                   <FiX className='h-5 w-5 text-gray-600' />
//                 </button>
//               </div>
//               <nav className='p-4'>
//                 <ul className='space-y-1'>
//                   {navItems.map((item) => {
//                     const Icon = item.icon;

//                     return (
//                       <li key={item.to}>
//                         <NavLink
//                           to={item.to}
//                           end={item.to === '/'}
//                           onClick={closeMobileMenu}
//                           className={({ isActive }) =>
//                             `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
//                               isActive
//                                 ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
//                                 : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
//                             }`
//                           }
//                         >
//                           {({ isActive }) => (
//                             <>
//                               <Icon
//                                 className={`mr-3 h-5 w-5 ${
//                                   isActive
//                                     ? 'text-indigo-500'
//                                     : 'text-gray-400 group-hover:text-indigo-500'
//                                 }`}
//                               />
//                               {item.label}

//                               {isActive && (
//                                 <span className='ml-auto h-2 w-2 rounded-full bg-indigo-500'></span>
//                               )}
//                             </>
//                           )}
//                         </NavLink>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </nav>
//             </aside>
//           </>
//         )}

//         {/* Main Content */}
//         <main className='flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 main-scroll'>
//           <div className='rounded-2xl border-gray-100/80 bg-white p-4 sm:p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm h-[37rem]'>
//             <Outlet />
//           </div>
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className='border-t border-gray-200/60 bg-white/80 py-3 px-4 sm:py-4 sm:px-6 text-center text-xs sm:text-sm text-gray-500 backdrop-blur-sm'>
//         © {new Date().getFullYear()} MediTrack. All rights reserved.
//       </footer>

//       {/* Custom scrollbar styles (already in your index.css) */}
//     </div>
//   );
// }

import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { MdDashboard, MdLocalPharmacy } from 'react-icons/md'; // added MdLocalPharmacy
import { FaBoxes } from 'react-icons/fa';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FaShoppingCart, FaShoppingBag } from 'react-icons/fa';
import { MdMoneyOff } from 'react-icons/md';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navItems = [
    {
      to: '/',
      icon: MdDashboard,
      label: 'Dashboard',
    },
    {
      to: '/medicine',
      icon: FaBoxes,
      label: 'Stock',
    },
    {
      to: '/items',
      icon: AiOutlinePlusCircle,
      label: 'Items',
    },
    {
      to: '/purchase',
      icon: FaShoppingCart,
      label: 'Purchase',
    },
    {
      to: '/sale',
      icon: FaShoppingBag,
      label: 'Sale',
    },
    {
      to: '/expense',
      icon: MdMoneyOff,
      label: 'Expense',
    },
  ];

  return (
    <div className='flex h-screen w-screen flex-col bg-gradient-to-br from-slate-50 to-gray-100 font-sans antialiased overflow-hidden'>
      {/* Header */}
      <header className='sticky top-0 z-20 flex h-16 items-center bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 text-gray-800 shadow-sm'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center space-x-3'>
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className='lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600'
              aria-label='Toggle menu'
            >
              <FiMenu className='h-6 w-6' />
            </button>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md'>
              {/* Modern pharmacy logo */}
              <MdLocalPharmacy className='h-6 w-6' />
            </div>
            <h1 className='text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
              MediTrack
            </h1>
          </div>
          <div className='flex items-center space-x-3'>
            <span className='hidden text-sm text-gray-600 md:inline-block'>
              Admin User
            </span>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-sm'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main container – sidebar + content */}
      <div className='flex flex-1 overflow-hidden relative'>
        {/* Sidebar for desktop */}
        <aside className='hidden lg:block w-64 overflow-y-auto bg-white/90 backdrop-blur-sm border-r border-gray-200/60 shadow-lg sidebar-scroll'>
          <nav className='p-4'>
            <ul className='space-y-1'>
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={closeMobileMenu}
                      className={({ isActive }) =>
                        `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className='mr-3 h-5 w-5' />
                          {item.label}
                          {isActive && (
                            <span className='ml-auto h-2 w-2 rounded-full bg-indigo-500'></span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className='fixed inset-0 bg-black/50 z-30 lg:hidden'
              onClick={closeMobileMenu}
            />
            {/* Slide‑in sidebar */}
            <aside className='fixed top-0 left-0 h-full w-64 z-40 bg-white/95 backdrop-blur-sm shadow-2xl overflow-y-auto sidebar-scroll lg:hidden animate-slide-in'>
              <div className='flex items-center justify-between p-4 border-b border-gray-100'>
                <span className='font-semibold text-gray-700'>Menu</span>
                <button
                  onClick={closeMobileMenu}
                  className='p-1 rounded-lg hover:bg-gray-100'
                >
                  <FiX className='h-5 w-5 text-gray-600' />
                </button>
              </div>
              <nav className='p-4'>
                <ul className='space-y-1'>
                  {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.to}>
                        <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
                            }`
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <Icon
                                className={`mr-3 h-5 w-5 ${
                                  isActive
                                    ? 'text-indigo-500'
                                    : 'text-gray-400 group-hover:text-indigo-500'
                                }`}
                              />
                              {item.label}
                              {isActive && (
                                <span className='ml-auto h-2 w-2 rounded-full bg-indigo-500'></span>
                              )}
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto bg-slate-50/50 p-4 sm:p-6 main-scroll'>
          <div className='rounded-2xl border-gray-100/80 bg-white p-4 sm:p-6 shadow-xl shadow-gray-200/50 backdrop-blur-sm h-[37rem]'>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className='border-t border-gray-200/60 bg-white/80 py-3 px-4 sm:py-4 sm:px-6 text-center text-xs sm:text-sm text-gray-500 backdrop-blur-sm'>
        © {new Date().getFullYear()} MediTrack. All rights reserved.
      </footer>
    </div>
  );
}
