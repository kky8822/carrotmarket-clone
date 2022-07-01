import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Favs: NextPage = () => {
  return (
    <Layout canGoBack title="Favs">
      <ProductList kind="Fav" />
    </Layout>
  );
};

export default Favs;
