declare module "src/components/*" {
  import { ComponentType } from "react";
  const component: ComponentType<any>;
  export default component;
}