'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    // Get error message from URL
    const errorParam = searchParams.get('error');
    
    // Map error codes to user-friendly messages
    if (errorParam) {
      switch (errorParam) {
        case 'CredentialsSignin':
          setError('Invalid email or password. Please try again.');
          break;
        case 'SessionRequired':
          setError('You must be signed in to access this page.');
          break;
        case 'AccessDenied':
          setError('You do not have permission to access this resource.');
          break;
        case 'OAuthSignin':
        case 'OAuthCallback':
        case 'OAuthCreateAccount':
        case 'EmailCreateAccount':
        case 'Callback':
        case 'OAuthAccountNotLinked':
        case 'EmailSignin':
        case 'CredentialsSignup':
        case 'default':
          setError('An authentication error occurred. Please try again.');
          break;
        default:
          setError('An unknown error occurred. Please try again later.');
      }
    } else {
      setError('An error occurred during authentication. Please try again.');
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-center">
            <Link 
              href="/auth/signin"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Return to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}