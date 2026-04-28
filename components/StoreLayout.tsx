import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </>
  );
}
