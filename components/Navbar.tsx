'use client'
import { useState, useEffect, useRef } from 'react';
import { FaUser, FaPowerOff } from 'react-icons/fa';
import {useRouter} from 'next/navigation'
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event:any) => {
    //@ts-ignore
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLogout = ()=>{
    localStorage.removeItem('token');
    router.push('/login');
  }

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="flex z-50 fixed top-0 w-full bg-white left-0  h-[12vh] justify-between px-10 py-4 shadow-xl border-b items-center">
      <div onClick={()=>router.push('/')}>
        <Image
          height={200}
          width={240}
          src={'/logo.png'}
          alt="Logo"
        />
      </div>
      <div className="relative" ref={dropdownRef}>
        <div
          className="cursor-pointer flex items-center gap-2"
          onClick={toggleDropdown}
        >
          <div>Admin</div>
          <Image
          height={200}
          width={240}

          src={'/dummy.jpg'}
            alt="Admin"
            className="w-8 h-8 rounded-full"
          />
        </div>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
            <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100">
              <FaUser />
              <span>Profile</span>
            </div>
            <div onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100">
              <FaPowerOff />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
