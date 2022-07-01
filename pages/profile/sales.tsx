import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Sales: NextPage = () => {
  return (
    <Layout canGoBack title="Sales">
      <ProductList kind="Sale" />
    </Layout>
  );
};

export default Sales;
