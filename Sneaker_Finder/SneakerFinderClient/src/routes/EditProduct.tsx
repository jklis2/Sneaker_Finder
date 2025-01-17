import EditProductForm from '../containers/EditProductForm';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';

export default function EditProduct() {
  return (
    <>
    <Navbar/>
    <div className="container mx-auto py-8">
      <EditProductForm />
    </div>
    <Footer />
    </>
  );
}