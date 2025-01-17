import AddProductForm from "../containers/AddProductForm";
import Footer from "../layouts/Footer";
import Navbar from "../layouts/Navbar";

export default function AddProduct() {
  return (
    <>
    <Navbar/>
    <div>
        <AddProductForm />
    </div>
    <Footer/>
    </>
  )
}