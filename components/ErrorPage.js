("use client");

import Link from "next/link";

export default function ErrorPage() {
  return (
    <>
      <p>Oops!</p>
      <p>Some Server occured occured, please try again later</p>
      <Link href="/">Go Home</Link>
    </>
  );
}
