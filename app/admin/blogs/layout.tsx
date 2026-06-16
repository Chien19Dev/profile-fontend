import { Fragment } from "react/jsx-runtime";

export default function BlogAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Fragment>{children}</Fragment>;
}
