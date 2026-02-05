import { useEffect } from 'react';
import { useRouter } from 'next/router';

// Redirect to home - radiologist selection is now automatic
export default function RadiologistSelect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);
  return null;
}
