import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchProduct,
  setSearch,
} from "@/services/reducer/productSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FilterIcon } from "lucide-react";

const Filters = ({
  searchTerm,
  setSearchTerm,
  selectedFilters,
  setCurrentPage,
  onFilterChange,
}) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleFilterChange = (filterKey, filterValue) => {
    onFilterChange(filterKey, filterValue);
  };



  return (
    <div className="flex items-center justify-between z-40">
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Button className="shrink-0" variant="outline">
            <FilterIcon className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px] p-4 bg-white">
          <div className="grid gap-4">
            <div>
              <Label className="text-sm font-medium" htmlFor="category">
                Category
              </Label>
              <Select
                id="category"
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium" htmlFor="minPrice">
                  Min Price
                </Label>
                <Input
                  id="minPrice"
                  type="number"
                  value={selectedFilters.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium" htmlFor="maxPrice">
                  Max Price
                </Label>
                <Input
                  id="maxPrice"
                  type="number"
                  value={selectedFilters.maxPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("maxPrice", e.target.value)
                  }
                />
              </div>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={() =>
                dispatch(
                  fetchProduct({
                    page: 1,
                    search: searchTerm,
                    filters: selectedFilters,
                  })
                )
              }
            >
              Apply Filters
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Filters;
