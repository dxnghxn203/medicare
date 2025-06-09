import CategoryNews from "./CategoryNews";

interface CategoryListProps {
  getAllArticles: any[];
}

export default function CategoryList({ getAllArticles }: CategoryListProps) {
  // Nhóm bài viết theo category
  const groupedByCategory: { [key: string]: any[] } = {};

  getAllArticles.forEach((article) => {
    if (!groupedByCategory[article.category]) {
      groupedByCategory[article.category] = [];
    }
    groupedByCategory[article.category].push(article);
  });

  return (
    <div>
      {Object.entries(groupedByCategory).map(
        ([categoryName, articles], index) => (
          <CategoryNews
            key={index}
            getAllArticles={articles}
            category={categoryName}
          />
        )
      )}
    </div>
  );
}
