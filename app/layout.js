import Header from "../components/Header";
import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";

export const metadata = {
  title: "Admin Home",
  description: "Description of Admin Home",
};

export default function RootLayout({ children }) {
  const footer = <footer>Footer</footer>;

  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          {children}
          {footer}
        </AuthProvider>
      </body>
    </html>
  );
}
