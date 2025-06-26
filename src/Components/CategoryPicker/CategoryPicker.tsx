"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FC, useState } from "react";
import { CategoryCard } from "@/Components/Card/CategoryCard/CategoryCard";
import { Title } from "@/Components/Texts/Title";
import { useFetchNewsCategories } from "@/Hooks/getForumCategories";
import styles from "./CategoryPicker.module.scss";

interface CategoryPickerProps {
  onCategorySelect: (categoryName: string | null) => void;
}
export const CategoryPicker: FC<CategoryPickerProps> = ({
  onCategorySelect,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { categories, error, loading } = useFetchNewsCategories();

  if (loading) return <div>loading...</div>;
  if (error) return <div>error: {error}</div>;

  const handleCategoryClick = (categoryName: string) => {
    const newCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newCategory);
    onCategorySelect(newCategory);
  };

  const visibleItems = showAll ? categories.length : 4;

  return (
    <div className={styles.categoryPickerWrap}>
      <div className={styles.categoryHeaderWrap}>
        <Title text={"Izabrane kategorije"} level={2} />
        <button
          onClick={() => setShowAll(!showAll)}
          className={styles.categoryButton}
        >
          {showAll ? "Prikaži manje" : "Prikaži više"}
        </button>
      </div>

      <div className={styles.categoryCardWrap}>
        <AnimatePresence>
          {categories.slice(0, visibleItems).map((data) => (
            <motion.div
              key={data.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={styles.div}
            >
              <CategoryCard
                imageUrl={`http://127.0.0.1:8090/api/files/pbc_2789640161/${data.id}/${data.image}`}
                imageDescription={data.image_description}
                description={data.category_name}
                onClick={() => handleCategoryClick(data.category_name)}
                isSelected={selectedCategory === data.category_name}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoryPicker;
