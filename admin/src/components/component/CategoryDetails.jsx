
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { getCategoryById } from "@/services/reducer/categorySlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


export function CategoryDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // État de chargement initialisé à true
  const categories = useSelector((state) => state.category);
  const Products = useSelector((state)=> state.category.productscat)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState([]);
     
  useEffect(() => {
    // Mettre l'état de chargement à true avant de lancer la requête
    setLoading(true);

    // Utiliser une fonction asynchrone pour attendre la résolution de la promesse
    const fetchData = async () => {
      try {
        await dispatch(getCategoryById(id));
        setName(categories.category.name);
        setDescription(categories.category.description);
        setProduct(categories.products);
        setLoading(false); 
      } catch (error) {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, [dispatch]);



  return (
    <>
    {loading ? (
      <div>Loading...</div>
    ):
    (<div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-2xl font-bold md:text-3xl">{name}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {
              product.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img
                      alt="Product Image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src="/placeholder.svg"
                      width="64" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">{product.stock ?? 0}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>)
    }</>
    );
}
