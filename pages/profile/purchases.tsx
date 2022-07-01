import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Purchases: NextPage = () => {
  return (
    <Layout canGoBack title="Purchases">
      <ProductList kind="Purchase" />
    </Layout>
  );
};

export default Purchases;
