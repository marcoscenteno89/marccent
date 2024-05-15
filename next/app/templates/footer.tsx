import Link from 'next/link';
import { dt } from "@/components/sac";
import { ThemesWT, AnimListWT } from '@/components/client/theme';
import { WebToast } from '@/components/client/component';

export default function Footer() {
  return (
    <footer className="container-fluid bg" id="footer">
      <div className="container-md">
        <AnimListWT />
        <ThemesWT />
        <div className="text-center pb-3">
          Copyright ©{dt.getFullYear()} Marccent. All rights reserved | 
          <Link href="/privacy-policy"> Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};